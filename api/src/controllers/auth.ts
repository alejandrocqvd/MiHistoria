import { Request, Response } from "express";
import { db } from "../db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Handles user registration.
 * This function checks if the user is older than 16 and whether a user already exists in the database.
 * If validation passes, it creates a new user in the database with the provided information.
 * 
 * @param {Request} req - Contains the user's registration data.
 * @param {Response} res - Object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const register = (req: Request, res: Response) => {
    const { email, password, username, first_name, last_name, dob } = req.body;

    // Birthday calculation.
    const birthday = new Date(dob);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    // Check if user is older than 16 years.
    if (age < 16) return res.status(422).json({ error: "User must be at least 16 years old to register." });

    // Query to check if the user already exists.
    const q = `SELECT * FROM user WHERE email = ? OR username = ?`;

    db.query(q, [email, username], (error, data) => {
        // Error checking.
        if (error) return res.status(500).json({ error: error });
        const typedData = data as RowDataPacket[];
        if (typedData.length) return res.status(409).json({ error: "User already exists." });

        // Password hashing.
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Query for inserting new user into the database.
        const q = `INSERT INTO user (username, first_name, last_name, dob, email, password, image, is_private) 
                    VALUES (?)`;
        const v = [
            username,
            first_name,
            last_name,
            dob,
            email,
            hash,
            null,
            false,
        ];
        db.query(q, [v], (error, data) => {
            if (error) return res.json(error);
            return res.status(201).json({ message: "User successfully created." });
        });
    });
}

/**
 * Handles user login.
 * Checks if the user's email and password match existing entry in the database.
 * 
 * @param {Request} req - The HTTP request object, containing the user's registration data.
 * @param {Response} res - The HTTP response object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const login = (req: Request, res: Response) => {
    const { email } = req.body;

    // Query to check if user already exists.
    const q = `SELECT * FROM user WHERE email = ?`;

    db.query(q, [email], (error, data) => {
        // Error checking.
        if (error) return res.json({ error: "An unexpected error has occurred." });
        const typedData = data as RowDataPacket[];
        if (typedData.length === 0) return res.status(404).json({ error: "User does not exist." });

        // Check if hashed password matches database hashed password for corresponding email.
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, typedData[0].password);
        if (!isPasswordCorrect) return res.status(401).json({ error: "Incorrect email or password." });

        // Create JSON Web Token.
        const token = jwt.sign({ username: typedData[0].username }, "jwtkey");
        const {password, ...other} = typedData[0];

        // Create cookie.
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json({ user_info: other});
    });
}

/**
 * Handles the user logging out. Clears the cookie from the browser.
 * 
 * @param {Request} req - The HTTP request object, containing the user's registration data.
 * @param {Response} res - The HTTP response object used to send back the appropriate response to the client.
 * @returns {Response} A response to the client with either a success or error message.
 */
export const logout = (req: Request, res: Response) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true,
    }).status(200).json("User has been logged out.");
}
