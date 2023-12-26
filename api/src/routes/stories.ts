import express from "express";
import { getPage, getStory, updatePage } from "../controllers/story";

const router = express.Router();

router.post("/page", getPage);
router.post("/edit", updatePage);
router.post("/story", getStory);

export default router;