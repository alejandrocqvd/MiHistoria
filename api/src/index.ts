import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import storyRoutes from "./routes/stories";
import searchRoutes from "./routes/searches";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";

const app = express();

app.use(express.json());
app.use(cookieParser());

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
app.use("/api/searches", searchRoutes);

app.listen(8800, () => {
    console.log("Connected to backend\n");
});