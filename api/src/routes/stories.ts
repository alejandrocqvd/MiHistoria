import express from "express";
import { createComment, deleteComment, deleteStory, getCommentCount, getComments, getPage, getStory, saveStory, updatePage } from "../controllers/story";

const router = express.Router();

router.post("/page", getPage);
router.post("/edit", updatePage);
router.post("/story", getStory);
router.post("/save", saveStory);
router.post("/comments", getComments);
router.post("/comments/count", getCommentCount);
router.post("/comment/create", createComment);
router.delete("/comment/delete", deleteComment);
router.delete("/delete", deleteStory);

export default router;