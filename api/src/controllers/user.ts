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
        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Query to get all the user's information.
        const q = `SELECT username, first_name, last_name, dob, email, image, is_private 
                    FROM user 
                    WHERE username = ?`;
        db.query(q, [username], (error, data) => {
            // Error checking.
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
        const { first_name, last_name, email, dob, img, is_private } = req.body;

        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;
    
        // Query to update user's information.
        const q = `UPDATE user 
                    SET first_name = ?, last_name = ?, dob = ?, email = ?, image = ?, is_private = ? 
                    WHERE username = ?`;
        db.query(q, [first_name, last_name, dob, email, img, is_private, username], (error) => {
            // Error checking.
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

        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        // Password hashing.
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
    
        // Query to update user's information.
        const q = `UPDATE user 
                    SET password = ?
                    WHERE username = ?`;
        db.query(q, [hash, username], (error) => {
            // Error checking.
            if (error) return res.status(500).json({ error: error });

            return res.status(200).json({ message: "Successfully updated user password." });
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
        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;
    
        // Query to delete user's account.
        const q = `DELETE FROM user WHERE username = ?`;
        db.query(q, [username], (error) => {
            // Error checking.
            if (error) return res.status(500).json({ error: error });

            return res.status(200).json({ message: "Successfully deleted account." });
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
        // Get JWT.
        const token = req.cookies["access_token"];
        if (!token) return res.status(401).json({ error: "Access denied, no token provided." });
        
        // Verify the token and save username.
        const decoded = jwt.verify(token, "jwtkey") as JwtPayload;
        if (!decoded.username) return res.status(401).json({ error: "Invalid token." });
        const username = decoded.username;

        return res.status(200).json({ message: "Successfully fetched user username", data: username });
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
}
