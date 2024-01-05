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

router.post("/page", getPage);
router.post("/edit", updatePage);
router.post("/story", getStory);
router.post("/save", saveStory);
router.post("/upload", saveBanner);
router.delete("/delete", deleteStory);
router.delete("/upload/delete", deleteBanner);

export default router;