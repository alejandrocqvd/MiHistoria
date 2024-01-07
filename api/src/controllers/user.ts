/**
 * User Module
 * 
 * This module provides the necessary functions for user's and their profiles.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { Request, Response } from "express";
import { db } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";

/**
 * Handles fetching the user's profile information.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, all the user's information to display on their profile.
 */
export const getProfile = (req: Request, res: Response) => {
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
                    FROM user 
                    WHERE username = ?`;
        db.query(q, [username], (error, data) => {
            if (error) return res.status(500).json({ error: error });

            const typedData = data as RowDataPacket[];
            return res.status(200).json({ message: "Successfully fetched user profile information", data: typedData[0] });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles updating the user's profile information.
 * 
 * @param {Request} req - Contains form data submitted from client.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, and updates the user's profile information.
 */
export const updateProfile = (req: Request, res: Response) => {
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
        const q = `UPDATE user 
                    SET first_name = ?, last_name = ?, dob = ?, email = ?, is_private = ? 
                    WHERE username = ?`;
        db.query(q, [first_name, last_name, dob, email, is_private, username], (error) => {
            if (error) return res.status(500).json({ error: error });

            return res.status(200).json({ message: "Successfully updated user profile information" });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles updating the user's password.
 * 
 * @param {Request} req - Contains form data submitted from client.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, and updates the user's password.
 */
export const updatePassword = (req: Request, res: Response) => {
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
        const q = `UPDATE user 
                    SET password = ?
                    WHERE username = ?`;
        db.query(q, [hash, username], (error) => {
            if (error) return res.status(500).json({ error: error });

            return res.status(200).json({ message: "Successfully updated user password." });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles updating the user's profile picture in the database.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, all the user's information to display on their profile.
 */
export const updatePicture = (req: Request, res: Response) => {
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
        const q = `UPDATE user SET image = ? WHERE username = ?`;
        db.query(q, [image, username], (error) => {
            if (error) return res.status(500).json({ error });

            return res.status(200).json({ message: "Successfully updated user's profile picture." });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles deleting the user's profile picture from the database.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, all the user's information to display on their profile.
 */
export const deletePicture = (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to delete the user's profile picture
        const q = `UPDATE user SET image = ? WHERE username = ?`;
        db.query(q, [null, username], (error) => {
            if (error) return res.status(500).json({ error });

            return res.status(200).json({ message: "Successfully deleted user's profile picture." });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles deleting the user's account.
 * 
 * @param {Request} req - Contains cookies with the JWT token.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, and deletes the user's account.
 */
export const deleteProfile = (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;
    
        // Query to delete user's account
        /**
         * Note: yeah this one is pretty bad, but once again, if I designed my database
         * schema better and took deletion into account, I would have been able to avoid
         * this nasty looking code.
         * tldr: lesson learned and I will prevent this from ever happening in the future lol
         */
        const q = `DELETE FROM comment WHERE comment_username = ?`;
        db.query(q, [username], (error) => {
            if (error) return res.status(500).json({ error: error });

            const q = `DELETE FROM likes WHERE like_username = ?`;
            db.query(q, [username], (error) => {
                if (error) return res.status(500).json({ error: error });
    
                const q = `DELETE FROM saves WHERE save_username = ?`;
                db.query(q, [username], (error) => {
                    if (error) return res.status(500).json({ error: error });
        
                    const q = `DELETE FROM page WHERE username = ?`;
                    db.query(q, [username], (error) => {
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
                    
                                        const q = `DELETE FROM user WHERE username = ?`;
                                        db.query(q, [username], (error) => {
                                            if (error) return res.status(500).json({ error });
                        
                                            return res.status(200).json({ message: "Successfully deleted user." });
                                        });                                       
                                    });                    
                                });                
                            });
                        });
                    });                
                });               
            });        
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
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
 * @returns A response and if successful, returns the user's username.
 */
export const getLiked = (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to get the stories the user has liked
        const q = `SELECT story_username FROM likes WHERE like_username = ?`;
        db.query(q, [username], (error, data) => {
            if (error) return res.status(500).json({ error });

            const typedData = data as RowDataPacket[];
            return res.status(200).json({ message: "Successfully fetched user's liked stories.", data: typedData });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles either liking or unliking a story based on the fact if it is already liked or not.
 * 
 * @param {Request} req - Contains cookies with the JWT token, and the story's username.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, returns the user's username.
 */
export const updateLiked = (req: Request, res: Response) => {
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
            const q = `DELETE FROM likes WHERE like_username = ? AND story_username = ?`;
            db.query(q, [username, story_username], (error) => {
                if (error) return res.status(500).json({ error });

                return res.status(200).json({ message: "Successfully unliked story." });
            });
        } else {
            // Like the story
            const q = `INSERT INTO likes (like_username, story_username)
                        VALUES (?, ?)`;
            db.query(q, [username, story_username], (error) => {
                if (error) return res.status(500).json({ error });

                return res.status(201).json({ message: "Successfully liked story." });
            });
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
 * @returns A response and if successful, returns the user's username.
 */
export const getSaved = (req: Request, res: Response) => {
    try {
        // Get JWT
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to get the stories the user has saved
        const q = `SELECT story_username FROM saves WHERE save_username = ?`;
        db.query(q, [username], (error, data) => {
            if (error) return res.status(500).json({ error });

            const typedData = data as RowDataPacket[];
            return res.status(200).json({ message: "Successfully fetched user's saved stories.", data: typedData });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}

/**
 * Handles either saving or unsaving based on the fact that if it is saved or not.
 * 
 * @param {Request} req - Contains cookies with the JWT token, and the story's username.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns A response and if successful, returns the user's username.
 */
export const updateSaved = (req: Request, res: Response) => {
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
            const q = `DELETE FROM saves WHERE save_username = ? AND story_username = ?`;
            db.query(q, [username, story_username], (error) => {
                if (error) return res.status(500).json({ error });

                return res.status(200).json({ message: "Successfully unsaved story." });
            });
        } else {
            // Save the story
            const q = `INSERT INTO saves (save_username, story_username)
                        VALUES (?, ?)`;
            db.query(q, [username, story_username], (error) => {
                if (error) return res.status(500).json({ error });

                return res.status(201).json({ message: "Successfully saved story." });
            });
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}
