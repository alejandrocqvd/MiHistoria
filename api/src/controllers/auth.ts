import { Request, Response } from "express";
import { db } from "../db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";

export const register = (req: Request, res: Response) => {
    const { email, password, username, first_name, last_name, dob } = req.body;

    // Check for existing user
    const q = `SELECT * FROM user WHERE email = ? OR username = ?`;

    db.query(q, [email, username], (error, data) => {
        // Error catching
        if (error) return res.json(error);
        const typedData = data as RowDataPacket[];
        if (typedData.length) return res.status(409).json("User already exists.");

        // Password hashing
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Inserting new user into db
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
            return res.status(201).json("User successfully created.");
        });
    });
};

export const login = (req: Request, res: Response) => {
    // Implementation here
};

export const logout = (req: Request, res: Response) => {
    // Implementation here
};
