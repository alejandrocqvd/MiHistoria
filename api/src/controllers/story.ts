import { Request, Response } from "express";
import { db } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import sanitizeHtml from "sanitize-html";

/**
 * Handles fetching a story's page contents.
 * 
 * @param {Request} req - Contains the ID of the story.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, sends the story text for the appropriate page.
 */
export const getPage = (req: Request, res: Response) => {
    const { username, page_number } = req.body;

    // Query to get story page text.
    const q = `SELECT text
                FROM page
                WHERE username = ? AND page_number = ?`;
    db.query(q, [username, page_number], (error, data) => {
        // Error checking
        if (error) return res.status(500).json({ error: error });
        const typedData = data as RowDataPacket[];
        if (typedData.length === 0) return res.status(400).json({ error: `Page number ${page_number} for user '${username}' does not exist.` });
        
        // Sanitize the HTML.
        const rawHTML = typedData[0].text;
        const sanitizedHTML = sanitizeHtml(rawHTML, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'span',
                'font', 'img', 'del', 'ins', 'sub', 'sup'
            ]),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'a': ['href', 'name', 'target'],
                'img': ['src', 'alt', 'title', 'width', 'height'],
                'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
                'div': ['style'],
                'span': ['style'],
                'p': ['style'],
                'font': ['color', 'size', 'face'],
            },
            allowedStyles: {
                '*': {
                    'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/],
                    'text-align': [/^left$/, /^right$/, /^center$/],
                    'font-size': [/^\d+(?:px|em|%)$/]
                },
            },
        });

        return res.status(200).json({ message: "Successfully fetched story page text", data: sanitizedHTML });
    });
}

/**
 * Handles updating a story's page.
 * 
 * @param {Request} req - Contains the text for the page being updated.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, updated the story's page.
 */
export const updatePage = (req: Request, res: Response) => {
    try {
        const { story_username, page_number, text } = req.body;

        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Check if the story belongs to the user.
        if (story_username !== username) return res.status(401).json({ error: "Access denied. Story does not belong to user." });
        
        // Sanitize the HTML text.
        const sanitizedHTML = sanitizeHtml(text, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'span',
                'font', 'img', 'del', 'ins', 'sub', 'sup'
            ]),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'a': ['href', 'name', 'target'],
                'img': ['src', 'alt', 'title', 'width', 'height'],
                'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
                'div': ['style'],
                'span': ['style'],
                'p': ['style'],
                'font': ['color', 'size', 'face'],
            },
            allowedStyles: {
                '*': {
                    'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/],
                    'text-align': [/^left$/, /^right$/, /^center$/],
                    'font-size': [/^\d+(?:px|em|%)$/]
                },
            },
        });
        
        // Query to update page.
        const q = `UPDATE page
                    SET text = ?
                    WHERE page_number = ? AND username = ?`;
        db.query(q, [text, page_number, username], (error) => {
            // Error checking
            if (error) return res.status(500).json({ error: error });

            return res.status(200).json({ message: `Successfully updated page ${page_number} of ${username}'s story.` });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles retrieving a story's basic information.
 * 
 * @param {Request} req - Contains the ID of the story.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, returns story details.
 */
export const getStory = (req: Request, res: Response) => {
    const { username } = req.body;

    // Query to get story information, author information, save count, and like count.
    const q = `SELECT u.username, u.first_name, u.last_name, u.dob, u.image AS user_image, s.title, s.image AS story_image
                FROM story AS s
                LEFT JOIN user AS u ON u.username = s.username
                WHERE s.username = ?`;
    db.query(q, username, (error, data) => {
        // Error checking
        if (error) return res.status(500).json({ error: error });
        
        const typedData = data as RowDataPacket[];
        return res.status(200).json({ message: "Successfully fetched story information. ", data: typedData[0] });
    });
}

/**
 * Handles creating or updating a story.
 * 
 * @param {Request} req - Contains the information of the story and the user.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, saves or creates a story.
 */
export const saveStory = (req: Request, res: Response) => {
    const { title, text } = req.body;

    try {
        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Check if story already exists
        const q = `SELECT * FROM story WHERE username = ?`;
        db.query(q, [username], (error, data) => {
            // Error checking.
            if (error) return res.status(500).json({ error: error });
            const typedData = data as RowDataPacket[];

            // If the story already exists, update it's content.
            if (typedData.length) {
                const q = `UPDATE story 
                            SET title = ?, text = ?, image = ?
                            WHERE username = ?`;
                db.query(q, [title, text, null, username], (error) => {
                    // Error checking.
                    if (error) return res.status(500).json({ error });

                    return res.status(200).json({ message: "Story successfully updated." });
                });
            } else {
                const q = `INSERT INTO story (username, title, text, image, timestamp)
                            VALUES (?, ?, ?, ?, ?)`;
                db.query(q, [username, title, text, null, null], (error) => {
                    // Error checking,
                    if (error) return res.status(500).json({ error });

                    return res.status(201).json({ message: "Story successfully created. "});
                });
            }
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}
