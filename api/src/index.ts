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

import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import storyRoutes from "./routes/stories";
import commentRoutes from "./routes/comments";
import searchRoutes from "./routes/searches";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";

const app = express();

app.use(express.json());
app.use(cookieParser());

/**
 * Handles file upload storage
 * 
 * The multer.diskStorage function is configured to save files in the '/client/public/uploads' directory.
 * Uploaded files are renamed with the current timestamp and the original file name to avoid naming conflicts.
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../client/public/uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
    const file = req.file;
    res.status(201).json({ data: file?.filename });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/searches", searchRoutes);

app.listen(8800, () => {
    console.log("Connected to backend\n");
});