import { Request, Response } from "express";
import { db, getConnection } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import sanitizeHtml from "sanitize-html";
import { JSDOM } from 'jsdom';

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
            if (error) return res.status(500).json({ error });

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
    const q = `SELECT u.username, u.first_name, u.last_name, u.dob, u.image AS user_image, s.title, s.image AS story_image, s.text, s.page_count, u.is_private
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
export const saveStory = async (req: Request, res: Response) => {
    const { title, text } = req.body;

    getConnection(async (error, connection) => {
        if (error) {
            return res.status(500).json({ error: "Error getting database connection." });
        }

        try {
            // Get JWT.
            const token = req.cookies["access_token"];
            if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
            
            // Verify the token and save username.
            const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
            if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
            const username = decoded.username;

            // Start a transaction.
            await new Promise((resolve, reject) => {
                connection?.beginTransaction(error => {
                    if (error) reject(error);
                    else resolve(null);
                });
            });
    
            // Check if story already exists.
            const q = `SELECT page_count FROM story WHERE username = ?`;
            connection?.query(q, [username], async (error, data) => {
                // Error checking.
                if (error) throw error;
                const typedData = data as RowDataPacket[];
    
                // Split the story into pages of 900 words or less.
                const pages = splitToPages(text, 900);
    
                // If the story already exists, update it's content.
                if (typedData.length) {
                    const q = `UPDATE story 
                                SET title = ?, text = ?, page_count = ?
                                WHERE username = ?`;
                    connection?.query(q, [title, text, pages.length, username], async (error) => {
                        // Error checking.
                        if (error) throw error;
    
                        // Go through each page, and if it already exists -> update it, if it does not -> insert it.
                        let page_number = 1;
                        for (const page of pages) {
                            pageQuery(page, username, page_number);
                            page_number++;
                        }

                        // If the current page count for the story is greater than the new page count, delete the unnecessary pages.
                        if (typedData[0].page_count > page_number) {
                            for (let i = typedData[0].page_count; i > page_number; i--) {
                                deletePageQuery(username, page_number);
                            }
                        }
                    });
                }
    
                // If the story does not exist, insert it into the appropriate tables.
                else {
                    const q = `INSERT INTO story (username, title, page_count, text)
                                VALUES (?, ?, ?, ?)`;
                    connection?.query(q, [username, title, pages.length, text], (error) => {
                        // Error checking,
                        if (error) throw error;
    
                        // Insert each page.
                        const q = `INSERT INTO page (page_number, username, text)
                                    VALUES (?, ?, ?)`;
                        let page_number = 1;
                        for (const page of pages) {
                            connection?.query(q, [page_number, username, page], (error) => {
                                if (error) throw error;
                            });
                            page_number++;
                        }
                    });
                }

                // Commit the transaction.
                await new Promise((resolve, reject) => {
                    connection?.commit(error => {
                        if (error) reject(error);
                        else resolve(null);
                    });
                });
            });
            connection?.release();
            res.status(201).json({ message: "Story successfully created or updated." });
        } catch (error) {
            // Rollback in case of an error.
            await new Promise(resolve => {
                connection?.rollback(() => resolve(null));
            });
            connection?.release();
            res.status(400).json({ error: "Invalid token." });
        }
    });
}

export const saveBanner = async (req: Request, res: Response) => {
    const { image } = req.body;

    try {
        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to update the story's banner image.
        const q = `UPDATE story SET image = ? WHERE username = ?`;
        db.query(q, [image, username], (error) => {
            if (error) return res.status(500).json({ error });

            return res.status(200).json({ message: "Successfully updated story banner image." });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

export const deleteBanner = async (req: Request, res: Response) => {
    try {
        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to delete the story's banner image.
        const q = `UPDATE story SET image = ? WHERE username = ?`;
        db.query(q, [null, username], (error) => {
            if (error) return res.status(500).json({ error });

            return res.status(200).json({ message: "Successfully deleted story banner image." });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles updating a story's page.
 * 
 * @param {Request} req - Contains the text for the page being updated.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, updated the story's page.
 */
export const deleteStory = (req: Request, res: Response) => {
    const { story_username } = req.body;

    try {
        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Check if user's username and story username don't match.
        if ( username !== story_username ) return res.status(401).json({ error: "Unauthorized request. User cannot delete this story." });

        // Query to delete the story.
        const q = `DELETE FROM page WHERE username = ?`;
        db.query(q, [username], (error) => {
            // Error checking.
            if (error) return res.status(500).json({ error });

            const q = `DELETE FROM comment WHERE story_username = ?`;
            db.query(q, [username], (error) => {
                if (error) return res.status(500).json({ error });

                const q = `DELETE FROM likes WHERE story_username = ?`;
                db.query(q, [username], (error) => {
                    if (error) return res.status(500).json({ error });

                    const q = `DELETE FROM saves WHERE story_username = ?`;
                    db.query(q, [username], (error) => {
                        if (error) return res.status(500).json({ error });
    
                        const q = `DELETE FROM story WHERE username = ?`;
                        db.query(q, [username], (error) => {
                            if (error) return res.status(500).json({ error });
        
                            return res.status(200).json({ message: "Successfully deleted story and all its pages." });
                        });                    
                    });                
                });
            });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

export const getCommentCount = (req: Request, res: Response) => {
    const { story_username } = req.body;

    // Query to get the comments and their information.
    const q = `SELECT COUNT(*) AS count
                FROM comment
                WHERE story_username = ?`;
    db.query(q, [story_username], (error, data) => {
        // Error checking
        if (error) return res.status(500).json({ error });

        const typedData = data as RowDataPacket[];
        return res.status(200).json({ message: "Successfully fetched story comment count.", data: typedData[0] });
    });
}

export const getComments = (req: Request, res: Response) => {
    const { story_username } = req.body;
    const page = req.body.page ? parseInt(req.body.page as string) : 1;
    const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

    // Offset for the query
    const offset = (page - 1) * limit;

    // Query to get the comments and their information.
    const q = `SELECT c.comment_id, c.comment_username AS username, c.text, c.timestamp, u.first_name, u.last_name, u.image 
                FROM comment AS c LEFT JOIN user AS u ON comment_username = username
                WHERE story_username = ?
                ORDER BY c.timestamp DESC
                LIMIT ?
                OFFSET ?`;
    db.query(q, [story_username, limit, offset], (error, data) => {
        // Error checking
        if (error) return res.status(500).json({ error });

        const typedData = data as RowDataPacket[];
        return res.status(200).json({ message: "Successfully fetched story comments.", data: typedData });
    });
}

export const createComment = (req: Request, res: Response) => {
    const { story_username, text } = req.body.data;

    try {
        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to create the comment.
        const q = `INSERT INTO comment (comment_username, story_username, text)
                    VALUES (?, ?, ?)`;
        db.query(q, [username, story_username, text], (error) => {
            // Error checking.
            if (error) return res.status(500).json({ error });

            return res.status(201).json({ message: "Successfully created comment." });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

export const deleteComment = (req: Request, res: Response) => {
    const { comment_id, comment_username } = req.body;

    try {
        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Check if user's username and comment's author don't match.
        if ( username !== comment_username ) return res.status(401).json({ error: "Unauthorized request. User cannot delete this comment." });

        // Query to delete the comment.
        const q = `DELETE FROM comment WHERE comment_id = ?`;
        db.query(q, [comment_id], (error) => {
            if (error) throw error;

            return res.status(200).json({ message: "Successfully deleted comment." });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
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

const pageQuery = (page: string, username: string, page_number: number) => {
    const q = `SELECT * FROM page WHERE username = ? AND page_number = ?`;
    
    db.query(q, [username, page_number], (error, data) => {
        // Error checking.
        if (error) return error;

        const typedData = data as RowDataPacket[];

        if (typedData.length) {
            // Update case.
            const q = `UPDATE page SET text = ? WHERE username = ? AND page_number = ?`;
            db.query(q, [page, username, page_number]);
        } else {
            // Insert case.
            const q = `INSERT INTO page (page_number, username, text)
                        VALUES (?, ?, ?)`;
            db.query(q, [page_number, username, page]);
        }
    });
}

const deletePageQuery = (username: string, page_number: number) => {
    const q = `DELETE FROM page WHERE username = ? AND page_number = ?`;
    db.query(q, [username, page_number], (error) => {
        if (error) return error;
    });
}
