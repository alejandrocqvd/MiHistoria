import express from "express";
import { deleteStory, getPage, getStory, saveStory, updatePage } from "../controllers/story";

const router = express.Router();

router.post("/page", getPage);
router.post("/edit", updatePage);
router.post("/story", getStory);
router.post("/save", saveStory);
router.delete("/delete", deleteStory);

export default router;