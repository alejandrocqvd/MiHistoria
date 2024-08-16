/**
 * Comment Module
 * 
 * This module provides the necessary functions for handling all 
 * comment/commenting functionalities.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { Request, Response } from "express";
import { db } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Fetches the number of comments on a given story.
 * 
 * @param {Request} req - Contains a specified story's username.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getCommentCount = async (req: Request, res: Response) => {
    const { story_username } = req.body;

    try {
        // Query to get the comment count
        const q = `SELECT COUNT(*) AS count FROM mi_historia.comment WHERE story_username = $1`;
        const result = await db.query(q, [story_username]);
        const count = result.rows[0].count;
        
        return res.status(200).json({ message: "Successfully fetched story comment count.", data: { count } });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches comments on a story
 * 
 * @param {Request} req - Contains the story's username, the current comment page, and the limit for each page.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getComments = async (req: Request, res: Response) => {
    const { story_username } = req.body;
    const page = req.body.page ? parseInt(req.body.page as string) : 1;
    const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

    // Offset for the query
    const offset = (page - 1) * limit;

    try {
        // Query to get the comments and their information
        const q = `
            SELECT c.comment_id, c.comment_username AS username, c.text, c.timestamp, u.first_name, u.last_name, u.image 
            FROM mi_historia.comment AS c 
            LEFT JOIN mi_historia.user AS u ON c.comment_username = u.username
            WHERE c.story_username = $1
            ORDER BY c.timestamp DESC
            LIMIT $2 OFFSET $3
        `;
        const result = await db.query(q, [story_username, limit, offset]);
        return res.status(200).json({ message: "Successfully fetched story comments.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Handles comment creation
 * 
 * @param {Request} req - Contains the comment author's JWT, story's username, and comment text content.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const createComment = async (req: Request, res: Response) => {
    const { story_username, text } = req.body.data;

    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to create the comment
        const q = `
            INSERT INTO mi_historia.comment (comment_username, story_username, text)
            VALUES ($1, $2, $3)
        `;
        await db.query(q, [username, story_username, text]);

        return res.status(201).json({ message: "Successfully created comment." });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Handles comment deletion
 * 
 * @param {Request} req - Contains the comment author's JWT, comment's identification number.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const deleteComment = async (req: Request, res: Response) => {
    const { comment_id, comment_username } = req.body;

    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Check if user's username and comment's author don't match
        if (username !== comment_username) return res.status(401).json({ error: "Unauthorized request. User cannot delete this comment." });

        // Query to delete the comment
        const q = `DELETE FROM mi_historia.comment WHERE comment_id = $1`;
        await db.query(q, [comment_id]);

        return res.status(200).json({ message: "Successfully deleted comment." });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
