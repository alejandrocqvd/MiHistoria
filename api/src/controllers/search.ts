/**
 * Searching Model
 * 
 * This module provides the necessary functions for searches used in the explore page.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { Request, Response } from "express";
import { db } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Handles searching for both story titles and user usernames.
 * 
 * @param {Request} req - Contains the search term.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const searchAll = async (req: Request, res: Response) => {
    const { searchTerm } = req.body;

    try {
        // Query to search
        const q = `
            SELECT DISTINCT title, image, username 
            FROM mi_historia.story
            WHERE title ILIKE $1
            OR username ILIKE $2
        `;
        const v = [`%${searchTerm}%`, `%${searchTerm}%`];
        const result = await db.query(q, v);
        
        return res.status(200).json({ message: "Successfully fetched results.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Handles searching for only story titles.
 * 
 * @param {Request} req - Contains the search term.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const searchStories = async (req: Request, res: Response) => {
    const { searchTerm } = req.body;

    try {
        // Query to search
        const q = `
            SELECT DISTINCT title, image, username 
            FROM mi_historia.story
            WHERE title ILIKE $1
        `;
        const v = [`%${searchTerm}%`];
        const result = await db.query(q, v);
        
        return res.status(200).json({ message: "Successfully fetched story results.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Handles searching for only user usernames
 * 
 * @param {Request} req - Contains the search term.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const searchUsers = async (req: Request, res: Response) => {
    const { searchTerm } = req.body;

    try {
        // Query to search
        const q = `
            SELECT DISTINCT title, image, username 
            FROM mi_historia.story
            WHERE username ILIKE $1
        `;
        const v = [`%${searchTerm}%`];
        const result = await db.query(q, v);
        
        return res.status(200).json({ message: "Successfully fetched user results.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches a user's saved posts.
 * 
 * @param {Request} req - Contains the user's JWT.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getSaved = async (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        const page = req.body.data.page ? parseInt(req.body.data.page as string) : 1;
        const limit = req.body.data.limit ? parseInt(req.body.data.limit as string) : 50;

        // Offset for the query
        const offset = (page - 1) * limit;

        // Query to get the user's saved stories
        const q = `
            SELECT DISTINCT st.title, st.image, st.username, sv.timestamp
            FROM mi_historia.story AS st
            LEFT JOIN mi_historia.saves AS sv ON st.username = sv.story_username
            WHERE sv.save_username = $1 
            ORDER BY sv.timestamp DESC
            LIMIT $2
            OFFSET $3
        `;
        const result = await db.query(q, [username, limit, offset]);
        
        return res.status(200).json({ message: "Successfully fetched saved stories.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches 5 of the user's saved stories.
 * 
 * @param {Request} req - Contains the user's JWT.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const get5Saved = async (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to get 5 of the user's saved stories
        const q = `
            SELECT DISTINCT st.title, st.image, st.username, sv.timestamp
            FROM mi_historia.story AS st
            LEFT JOIN mi_historia.saves AS sv ON st.username = sv.story_username
            WHERE sv.save_username = $1 
            ORDER BY sv.timestamp DESC
            LIMIT 5
        `;
        const result = await db.query(q, [username]);
        
        return res.status(200).json({ message: "Successfully fetched 5 saved stories.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches the number of stories saved by the user.
 * 
 * @param {Request} req - Contains the user's JWT.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getSavedCount = async (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to get the number of posts saved by the user
        const q = `
            SELECT COUNT(*) AS count
            FROM mi_historia.saves
            WHERE save_username = $1
        `;
        const result = await db.query(q, [username]);
        
        return res.status(200).json({ message: "Successfully fetched number of stories saved by user.", data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches the top stories in the past 30 days.
 * 
 * @param {Request} req - Contains the current result page and the limit for each page.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getMonthlyTop = async (req: Request, res: Response) => {
    const page = req.body.page ? parseInt(req.body.page as string) : 1;
    const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

    // Offset for the query
    const offset = (page - 1) * limit;

    try {
        // Query to get top posts in the last 30 days
        const q = `
            SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
            FROM mi_historia.story AS s
            LEFT JOIN mi_historia.likes AS l ON s.username = l.story_username
            WHERE s.timestamp >= NOW() - INTERVAL '30 days'
            GROUP BY s.title, s.image, s.username
            ORDER BY like_count DESC
            LIMIT $1
            OFFSET $2
        `;
        const result = await db.query(q, [limit, offset]);
        
        return res.status(200).json({ message: "Successfully fetched top monthly stories.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches 5 of the top stories in the past 30 days.
 * 
 * @param {Request} req - Contains the request.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const get5MonthlyTop = async (req: Request, res: Response) => {
    try {
        // Query to get 5 top posts in the last 30 days
        const q = `
            SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
            FROM mi_historia.story AS s
            LEFT JOIN mi_historia.likes AS l ON s.username = l.story_username
            WHERE s.timestamp >= NOW() - INTERVAL '30 days'
            GROUP BY s.title, s.image, s.username
            ORDER BY like_count DESC
            LIMIT 5
        `;
        const result = await db.query(q);
        
        return res.status(200).json({ message: "Successfully fetched 5 top monthly stories.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches the number of stories posted in the past 30 days.
 * 
 * @param {Request} req - Contains the request.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getMonthlyCount = async (req: Request, res: Response) => {
    try {
        // Query to get the number of posts made in the past month
        const q = `
            SELECT COUNT(*) AS count
            FROM mi_historia.story AS s
            WHERE s.timestamp >= NOW() - INTERVAL '30 days'
        `;
        const result = await db.query(q);
        
        return res.status(200).json({ message: "Successfully fetched number of stories made in past 30 days.", data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches the top stories in the past year.
 * 
 * @param {Request} req - Contains the current result page and the limit for each page.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getYearlyTop = async (req: Request, res: Response) => {
    const page = req.body.page ? parseInt(req.body.page as string) : 1;
    const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

    // Offset for the query
    const offset = (page - 1) * limit;

    try {
        // Query to get top posts in the last year
        const q = `
            SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
            FROM mi_historia.story AS s
            LEFT JOIN mi_historia.likes AS l ON s.username = l.story_username
            WHERE s.timestamp >= NOW() - INTERVAL '1 year'
            GROUP BY s.title, s.image, s.username
            ORDER BY like_count DESC
            LIMIT $1
            OFFSET $2
        `;
        const result = await db.query(q, [limit, offset]);
        
        return res.status(200).json({ message: "Successfully fetched top yearly stories.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches 5 of the top stories in the past year.
 * 
 * @param {Request} req - Contains the request.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const get5YearlyTop = async (req: Request, res: Response) => {
    try {
        // Query to get 5 top posts in the last year
        const q = `
            SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
            FROM mi_historia.story AS s
            LEFT JOIN mi_historia.likes AS l ON s.username = l.story_username
            WHERE s.timestamp >= NOW() - INTERVAL '1 year'
            GROUP BY s.title, s.image, s.username
            ORDER BY like_count DESC
            LIMIT 5
        `;
        const result = await db.query(q);
        
        return res.status(200).json({ message: "Successfully fetched 5 top yearly stories.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches the number of stories written in total (all time).
 * 
 * @param {Request} req - Contains the request.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getYearlyCount = async (req: Request, res: Response) => {
    try {
        // Query to get the number of posts made in the past year
        const q = `
            SELECT COUNT(*) AS count
            FROM mi_historia.story AS s
            WHERE s.timestamp >= NOW() - INTERVAL '1 year'
        `;
        const result = await db.query(q);
        
        return res.status(200).json({ message: "Successfully fetched number of stories made in past year.", data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches the top stories of all time.
 * 
 * @param {Request} req - Contains the current result page and the limit for each page.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getAllTimeTop = async (req: Request, res: Response) => {
    const page = req.body.page ? parseInt(req.body.page as string) : 1;
    const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

    // Offset for the query
    const offset = (page - 1) * limit;

    try {
        // Query to get top stories of all time
        const q = `
            SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
            FROM mi_historia.story AS s
            LEFT JOIN mi_historia.likes AS l ON s.username = l.story_username
            GROUP BY s.title, s.image, s.username
            ORDER BY like_count DESC
            LIMIT $1
            OFFSET $2
        `;
        const result = await db.query(q, [limit, offset]);
        
        return res.status(200).json({ message: "Successfully fetched top stories of all time.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches 5 of the top stories of all time.
 * 
 * @param {Request} req - Contains the request.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const get5AllTimeTop = async (req: Request, res: Response) => {
    try {
        // Query to get top 5 posts of all time
        const q = `
            SELECT DISTINCT s.title, s.image, s.username, COUNT(l.story_username) AS like_count
            FROM mi_historia.story AS s
            LEFT JOIN mi_historia.likes AS l ON s.username = l.story_username
            GROUP BY s.title, s.image, s.username
            ORDER BY like_count DESC
            LIMIT 5
        `;
        const result = await db.query(q);
        
        return res.status(200).json({ message: "Successfully fetched top 5 stories of all time.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches the total number of stories.
 * 
 * @param {Request} req - Contains the request.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getAllCount = async (req: Request, res: Response) => {
    try {
        // Query to get the number of posts made for all time
        const q = `
            SELECT COUNT(*) AS count
            FROM mi_historia.story AS s
        `;
        const result = await db.query(q);
        
        return res.status(200).json({ message: "Successfully fetched total number of stories made.", data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches stories sorted by newest to oldest.
 * 
 * @param {Request} req - Contains the current result page and the limit for each page.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const getNew = async (req: Request, res: Response) => {
    const page = req.body.page ? parseInt(req.body.page as string) : 1;
    const limit = req.body.limit ? parseInt(req.body.limit as string) : 50;

    // Offset for the query
    const offset = (page - 1) * limit;

    try {
        // Query to get new stories
        const q = `
            SELECT DISTINCT title, image, username, timestamp
            FROM mi_historia.story
            ORDER BY timestamp DESC
            LIMIT $1
            OFFSET $2
        `;
        const result = await db.query(q, [limit, offset]);
        
        return res.status(200).json({ message: "Successfully fetched new stories.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Fetches 5 of the newest stories.
 * 
 * @param {Request} req - Contains the request.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const get5New = async (req: Request, res: Response) => {
    try {
        // Query to get 5 new stories
        const q = `
            SELECT DISTINCT title, image, username, timestamp
            FROM mi_historia.story
            ORDER BY timestamp DESC
            LIMIT 5
        `;
        const result = await db.query(q);
        
        return res.status(200).json({ message: "Successfully fetched 5 newest stories.", data: result.rows });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
