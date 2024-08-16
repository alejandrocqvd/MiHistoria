/**
 * User Module
 * 
 * This module provides the necessary functions for users and their profiles.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { Request, Response } from "express";
import { db } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabase } from "../supabaseClient";

/**
 * Handles fetching the user's profile information.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, all the user's information to display on their profile.
 */
export const getProfile = async (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to get all the user's information
        const q = `SELECT username, first_name, last_name, dob, email, image, is_private 
                    FROM mi_historia.user 
                    WHERE username = $1`;
        const { rows } = await db.query(q, [username]);
        return res.status(200).json({ message: "Successfully fetched user profile information", data: rows[0] });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles updating the user's profile information.
 * 
 * @param {Request} req - Contains form data submitted from client.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, updates the user's profile information.
 */
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, dob, is_private } = req.body;

        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;
    
        // Query to update user's information
        const q = `UPDATE mi_historia.user 
                    SET first_name = $1, last_name = $2, dob = $3, email = $4, is_private = $5 
                    WHERE username = $6`;
        await db.query(q, [first_name, last_name, dob, email, is_private, username]);
        return res.status(200).json({ message: "Successfully updated user profile information" });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles updating the user's password.
 * 
 * @param {Request} req - Contains form data submitted from client.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, updates the user's password.
 */
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;

        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Password hashing
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
    
        // Query to update user's information
        const q = `UPDATE mi_historia.user 
                    SET password = $1
                    WHERE username = $2`;
        await db.query(q, [hash, username]);
        return res.status(200).json({ message: "Successfully updated user password." });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles updating the user's profile picture in the database.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, updates the user's profile picture.
 */
export const updatePicture = async (req: Request, res: Response) => {
    const { image } = req.body;

    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to update the user's profile picture
        const q = `UPDATE mi_historia.user SET image = $1 WHERE username = $2`;
        await db.query(q, [image, username]);
        return res.status(200).json({ message: "Successfully updated user's profile picture." });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles deleting the user's profile picture from the database.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, deletes the user's profile picture.
 */
export const deletePicture = async (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to get the current image URL from the database
        const getImageQuery = `SELECT image FROM mi_historia.user WHERE username = $1`;
        const result = await db.query(getImageQuery, [username]);
        
        const imageUrl = result.rows[0]?.image;
        if (!imageUrl) {
            return res.status(404).json({ error: "No image found for this user." });
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

        // Query to delete the user's profile picture reference in the database
        const updateQuery = `UPDATE mi_historia.user SET image = NULL WHERE username = $1`;
        await db.query(updateQuery, [username]);

        return res.status(200).json({ message: "Successfully deleted user's profile picture." });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}


/**
 * Handles deleting the user's account.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, deletes the user's account.
 */
export const deleteProfile = async (req: Request, res: Response) => {
    const client = await db.connect();
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Start transaction
        await client.query('BEGIN');

        // Delete related data
        await client.query(`DELETE FROM mi_historia.comment WHERE comment_username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.likes WHERE like_username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.saves WHERE save_username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.page WHERE username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.comment WHERE story_username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.likes WHERE story_username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.saves WHERE story_username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.story WHERE username = $1`, [username]);
        await client.query(`DELETE FROM mi_historia.user WHERE username = $1`, [username]);

        // Commit transaction
        await client.query('COMMIT');
        return res.status(200).json({ message: "Successfully deleted user." });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: "Invalid token." });
    } finally {
        client.release();
    }
}

/**
 * Handles fetching the user's username.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, returns the user's username.
 */
export const getUsername = (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        return res.status(200).json({ message: "Successfully fetched user username", data: username });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Fetches the stories the user has liked.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, returns the stories liked by the user.
 */
export const getLiked = async (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to get the stories the user has liked
        const q = `SELECT story_username FROM mi_historia.likes WHERE like_username = $1`;
        const { rows } = await db.query(q, [username]);
        return res.status(200).json({ message: "Successfully fetched user's liked stories.", data: rows });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles either liking or unliking a story based on the fact if it is already liked or not.
 * 
 * @param {Request} req - Contains cookies with the JWT token, and the story's username.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, returns a message indicating whether the story was liked or unliked.
 */
export const updateLiked = async (req: Request, res: Response) => {
    const { liked, story_username } = req.body.data;

    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        if (liked) {
            // Unlike the story
            const q = `DELETE FROM mi_historia.likes WHERE like_username = $1 AND story_username = $2`;
            await db.query(q, [username, story_username]);
            return res.status(200).json({ message: "Successfully unliked story." });
        } else {
            // Like the story
            const q = `INSERT INTO mi_historia.likes (like_username, story_username)
                        VALUES ($1, $2)`;
            await db.query(q, [username, story_username]);
            return res.status(201).json({ message: "Successfully liked story." });
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Fetches the user's saved stories.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, returns the user's saved stories.
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

        // Query to get the stories the user has saved
        const q = `SELECT story_username FROM mi_historia.saves WHERE save_username = $1`;
        const { rows } = await db.query(q, [username]);
        return res.status(200).json({ message: "Successfully fetched user's saved stories.", data: rows });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles either saving or unsaving based on the fact that if it is saved or not.
 * 
 * @param {Request} req - Contains cookies with the JWT token, and the story's username.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, returns a message indicating whether the story was saved or unsaved.
 */
export const updateSaved = async (req: Request, res: Response) => {
    const { saved, story_username } = req.body.data;

    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        if (saved) {
            // Unsave the story
            const q = `DELETE FROM mi_historia.saves WHERE save_username = $1 AND story_username = $2`;
            await db.query(q, [username, story_username]);
            return res.status(200).json({ message: "Successfully unsaved story." });
        } else {
            // Save the story
            const q = `INSERT INTO mi_historia.saves (save_username, story_username)
                        VALUES ($1, $2)`;
            await db.query(q, [username, story_username]);
            return res.status(201).json({ message: "Successfully saved story." });
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}
