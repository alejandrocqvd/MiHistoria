import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import storyRoutes from "./routes/stories";

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);

app.listen(8800, () => {
    console.log("Connected to backend\n");
});