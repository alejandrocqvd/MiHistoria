/**
 * Express Server Configuration
 *
 * This file sets up an Express server for the application. It configures middleware for parsing JSON 
 * and cookies, handles file uploads, and sets up various routes for different functionalities.
 * 
 * Server Initialization:
 * - The server listens on port 8800.
 * - Upon successful connection, a message is logged to the console.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */
import dotenv from 'dotenv';

dotenv.config();

import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import storyRoutes from "./routes/stories";
import commentRoutes from "./routes/comments";
import searchRoutes from "./routes/searches";
import cookieParser from "cookie-parser";
import multer from "multer";
import { supabase } from "./supabaseClient";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", upload.single("file"), async function (req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        // Create a unique filename using UUID
        const uniqueFilename = `${uuidv4()}-${file.originalname}`;

        // Upload file to Supabase storage
        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(uniqueFilename, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) {
            throw error;
        }

        // Generate a public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage
            .from('uploads')
            .getPublicUrl(uniqueFilename);

        res.status(201).json({ data: publicUrlData.publicUrl });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/searches", searchRoutes);

const port = process.env.PORT || 8800;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
