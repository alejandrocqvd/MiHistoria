import express from "express";
import { getPage, getStory, saveStory, updatePage } from "../controllers/story";

const router = express.Router();

router.post("/page", getPage);
router.post("/edit", updatePage);
router.post("/story", getStory);
router.post("/save", saveStory);

export default router;