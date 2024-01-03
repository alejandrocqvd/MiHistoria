import express from "express";
import { searchAll, searchStories, searchUsers } from "../controllers/search";

const router = express.Router();

router.post("/all", searchAll);
router.post("/story", searchStories);
router.post("/user", searchUsers);

export default router;