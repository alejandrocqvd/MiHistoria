/**
 * Story Routes
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import express from "express";
import { 
  deleteBanner, 
  deleteStory, 
  getPage, 
  getStory, 
  saveBanner, 
  saveStory, 
  updatePage 
} from "../controllers/story";

const router = express.Router();

// Routes
router.post("/page", getPage);
router.post("/edit", updatePage);
router.post("/story", getStory);
router.post("/save", saveStory);
router.post("/upload", saveBanner);
router.delete("/delete", deleteStory);
router.delete("/upload/delete", deleteBanner);

export default router;