/**
 * Story Module
 * 
 * This module provides the necessary functions for stories and all their functionalities.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { Request, Response } from "express";
import { db } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";
import { JSDOM } from 'jsdom';
import { PoolClient } from "pg";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

/**
 * Handles fetching a story's page contents.
 * 
 * @param {Request} req - Contains the ID of the story.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, sends the story text for the appropriate page.
 */
export const getPage = async (req: Request, res: Response) => {
    const { username, page_number } = req.body;

    try {
        // Query to get story page text
        const q = `
            SELECT text
            FROM mi_historia.page
            WHERE username = $1 AND page_number = $2
        `;
        const result = await db.query(q, [username, page_number]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: `Page number ${page_number} for user '${username}' does not exist.` });
        }
        
        // Sanitize the HTML
        const rawHTML = result.rows[0].text;
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
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
}

/**
 * Handles updating a story's page.
 * 
 * @param {Request} req - Contains the text for the page being updated.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, updates the story's page.
 */
export const updatePage = async (req: Request, res: Response) => {
    try {
        const { story_username, page_number, text } = req.body;

        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Check if the story belongs to the user
        if (story_username !== username) return res.status(401).json({ error: "Access denied. Story does not belong to user." });
        
        // Sanitize the HTML text
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

        // Query to update page
        const q = `
            UPDATE mi_historia.page
            SET text = $1
            WHERE page_number = $2 AND username = $3
        `;
        await db.query(q, [sanitizedHTML, page_number, username]);

        return res.status(200).json({ message: `Successfully updated page ${page_number} of ${username}'s story.` });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
}

/**
 * Handles retrieving a story's basic information.
 * 
 * @param {Request} req - Contains the username of the story.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, returns story details.
 */
export const getStory = async (req: Request, res: Response) => {
    const { username } = req.body;

    try {
        // Query to get story information, author information, save count, and like count
        const q = `
            SELECT u.username, u.first_name, u.last_name, u.dob, u.image AS user_image, 
                   s.title, s.image AS story_image, s.text, s.page_count, u.is_private
            FROM mi_historia.story AS s
            LEFT JOIN mi_historia.user AS u ON u.username = s.username
            WHERE s.username = $1
        `;
        const result = await db.query(q, [username]);

        const story = result.rows[0];

        // Get the public URLs for the images
        if (story.user_image) {
            const { data: userImageUrlData } = supabase.storage
                .from('uploads')
                .getPublicUrl(story.user_image);
            if (userImageUrlData?.publicUrl) {
                story.user_image = userImageUrlData.publicUrl;
            }
        }

        if (story.story_image) {
            const { data: storyImageUrlData } = supabase.storage
                .from('uploads')
                .getPublicUrl(story.story_image);
            if (storyImageUrlData?.publicUrl) {
                story.story_image = storyImageUrlData.publicUrl;
            }
        }

        return res.status(200).json({ message: "Successfully fetched story information.", data: story });
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
}

/**
 * Handles creating or updating a story.
 * 
 * @param {Request} req - Contains the information of the story and the user.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, saves or creates a story.
 */
export const saveStory = async (req: Request, res: Response) => {
    const { title, text } = req.body;

    const client = await db.connect();
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Start a transaction
        await client.query('BEGIN');
    
        // Check if story already exists
        const q = `SELECT page_count FROM mi_historia.story WHERE username = $1`;
        const result = await client.query(q, [username]);

        // Split the story into pages of 900 words or less
        const pages = splitToPages(text, 900);
    
        if (result.rows.length > 0) {
            // If the story already exists, update its content
            const updateQuery = `
                UPDATE mi_historia.story 
                SET title = $1, text = $2, page_count = $3
                WHERE username = $4
            `;
            await client.query(updateQuery, [title, text, pages.length, username]);

            // Update or insert pages
            for (let i = 0; i < pages.length; i++) {
                await pageQuery(client, pages[i], username, i + 1);
            }

            // Delete unnecessary pages if the new page count is less than the previous one
            if (result.rows[0].page_count > pages.length) {
                for (let i = pages.length + 1; i <= result.rows[0].page_count; i++) {
                    await deletePageQuery(client, username, i);
                }
            }
        } else {
            // If the story does not exist, insert it into the appropriate tables
            const insertStoryQuery = `
                INSERT INTO mi_historia.story (username, title, page_count, text)
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(insertStoryQuery, [username, title, pages.length, text]);

            // Insert pages
            for (let i = 0; i < pages.length; i++) {
                await client.query(`
                    INSERT INTO mi_historia.page (page_number, username, text)
                    VALUES ($1, $2, $3)
                `, [i + 1, username, pages[i]]);
            }
        }

        // Commit the transaction
        await client.query('COMMIT');
        res.status(201).json({ message: "Story successfully created or updated." });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: "An error occurred while saving the story." });
    } finally {
        client.release();
    }
}

/**
 * Handles saving a story's image banner to the database.
 * 
 * @param {Request} req - Contains the user's JWT and the file name for the story banner image.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, sends the story text for the appropriate page.
 */
export const saveBanner = async (req: Request, res: Response) => {
    const { image } = req.body;

    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to get the current image URL from the database
        const getImageQuery = `SELECT image FROM mi_historia.story WHERE username = $1`;
        const result = await db.query(getImageQuery, [username]);

        const currentImageUrl = result.rows[0]?.image;
        if (currentImageUrl) {
            // Extract the file path from the current image URL
            const currentFilePath = currentImageUrl.split('/').pop();

            // Delete the current image from Supabase storage
            const { error: deleteError } = await supabase.storage
                .from('uploads')
                .remove([currentFilePath]);

            if (deleteError) {
                throw deleteError;
            }
        }

        // Generate a unique filename using UUID
        const uniqueFilename = `${uuidv4()}-${image.originalname}`;

        // Upload the new image to Supabase storage
        const { data, error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(uniqueFilename, image.buffer, {
                contentType: image.mimetype,
            });

        if (uploadError) {
            throw uploadError;
        }

        // Generate a public URL for the uploaded image
        const publicUrlData = supabase.storage
            .from('uploads')
            .getPublicUrl(uniqueFilename);

        if (!publicUrlData.data || !publicUrlData.data.publicUrl) {
            throw new Error("Failed to generate public URL for the image.");
        }

        const imageUrl = publicUrlData.data.publicUrl;

        // Update the story's banner image in the database with the new public URL
        const updateQuery = `UPDATE mi_historia.story SET image = $1 WHERE username = $2`;
        await db.query(updateQuery, [imageUrl, username]);

        return res.status(200).json({ message: "Successfully updated story banner image." });
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
}

/**
 * Handles deleting a story's image banner from the database.
 * 
 * @param {Request} req - Contains the user's JWT.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, deletes the story's image banner.
 */
export const deleteBanner = async (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to get the current image URL from the database
        const getImageQuery = `SELECT image FROM mi_historia.story WHERE username = $1`;
        const result = await db.query(getImageQuery, [username]);

        const imageUrl = result.rows[0]?.image;
        if (!imageUrl) {
            return res.status(404).json({ error: "No image found for this story." });
        }

        // Extract the file path from the image URL
        const filePath = imageUrl.split('/').pop();

        // Delete the file from Supabase storage
        const { error: supabaseError } = await supabase.storage
            .from('uploads')
            .remove([filePath]);

        if (supabaseError) {
            throw supabaseError;
        }

        // Query to delete the story's banner image reference in the database
        const updateQuery = `UPDATE mi_historia.story SET image = NULL WHERE username = $1`;
        await db.query(updateQuery, [username]);

        return res.status(200).json({ message: "Successfully deleted story banner image." });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}

/**
 * Handles deleting a story and its associated data.
 * 
 * @param {Request} req - Contains the user's JWT.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, deletes the story.
 */
export const deleteStory = async (req: Request, res: Response) => {
    const { story_username } = req.body;

    const client = await db.connect();
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Check if user's username and story username don't match
        if (username !== story_username) return res.status(401).json({ error: "Unauthorized request. User cannot delete this story." });

        // Start a transaction
        await client.query('BEGIN');

        // Query to get the current banner image URL from the database
        const getImageQuery = `SELECT image FROM mi_historia.story WHERE username = $1`;
        const result = await client.query(getImageQuery, [username]);

        const currentImageUrl = result.rows[0]?.image;
        if (currentImageUrl) {
            // Extract the file path from the current image URL
            const currentFilePath = currentImageUrl.split('/').pop();

            // Delete the banner image from Supabase storage
            const { error: deleteError } = await supabase.storage
                .from('uploads')
                .remove([currentFilePath]);

            if (deleteError) {
                throw deleteError;
            }
        }

        // Delete associated data and the story
        await client.query(`DELETE FROM mi_historia.page WHERE username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.comment WHERE story_username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.likes WHERE story_username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.saves WHERE story_username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.story WHERE username = $1`, [username]);

        // Commit the transaction
        await client.query('COMMIT');
        return res.status(200).json({ message: "Successfully deleted story, its pages, and its banner image." });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: "An error occurred while deleting the story." });
    } finally {
        client.release();
    }
}

/**
 * Splits HTML content into pages, ensuring that each HTML element stays intact.
 * 
 * @param {string} htmlString - The HTML content as a string.
 * @param {number} maxWordsPerPage - The maximum number of words per page.
 * @returns {string[]} An array of strings, each string is the HTML content of a page.
 */
function splitToPages(htmlString: string, maxWordsPerPage: number): string[] {
    const pages: string[] = [];
    const dom = new JSDOM(htmlString);
    const body = dom.window.document.body;
    let currentPage: string[] = [];
    let currentWordCount = 0;

    body.childNodes.forEach(node => {
        if (node.nodeType === dom.window.Node.ELEMENT_NODE) {
            const element = node as Element;
            const textContent = element.textContent || '';
            const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

            if (currentWordCount + wordCount > maxWordsPerPage && currentPage.length > 0) {
                pages.push(currentPage.join(''));
                currentPage = [];
                currentWordCount = 0;
            }

            currentPage.push(element.outerHTML);
            currentWordCount += wordCount;
        }
    });

    if (currentPage.length > 0) {
        pages.push(currentPage.join(''));
    }

    return pages;
}

/**
 * Handles inserting or updating a story's page in the database.
 * 
 * @param {PoolClient} client - The PostgreSQL client.
 * @param {string} page - The HTML text content of the page.
 * @param {string} username - The story's username.
 * @param {number} page_number - The page number.
 */
const pageQuery = async (client: PoolClient, page: string, username: string, page_number: number) => {
    const q = `SELECT * FROM mi_historia.page WHERE username = $1 AND page_number = $2`;
    const result = await client.query(q, [username, page_number]);

    if (result.rows.length > 0) {
        // Update case
        const updateQuery = `
            UPDATE mi_historia.page 
            SET text = $1 
            WHERE username = $2 AND page_number = $3
        `;
        await client.query(updateQuery, [page, username, page_number]);
    } else {
        // Insert case
        const insertQuery = `
            INSERT INTO mi_historia.page (page_number, username, text)
            VALUES ($1, $2, $3)
        `;
        await client.query(insertQuery, [page_number, username, page]);
    }
}

/**
 * Handles deleting a story's page from the database.
 * 
 * @param {PoolClient} client - The PostgreSQL client.
 * @param {string} username - The story's username.
 * @param {number} page_number - The page number.
 */
const deletePageQuery = async (client: PoolClient, username: string, page_number: number) => {
    const q = `DELETE FROM mi_historia.page WHERE username = $1 AND page_number = $2`;
    await client.query(q, [username, page_number]);
}
