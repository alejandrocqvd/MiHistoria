/**
 * User Routes
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import express from "express";
import { 
  deletePicture,
  deleteProfile, 
  getLiked, 
  getProfile, 
  getSaved, 
  getUsername, 
  updateLiked, 
  updatePassword, 
  updatePicture, 
  updateProfile, 
  updateSaved 
} from "../controllers/user";

const router = express.Router();

// Routes
router.get("/profile", getProfile);
router.get("/username", getUsername);
router.get("/liked", getLiked);
router.get("/saved", getSaved);
router.post("/like", updateLiked);
router.post("/save", updateSaved);
router.post("/edit", updateProfile);
router.post("/password", updatePassword);
router.post("/upload", updatePicture);
router.delete("/upload/delete", deletePicture);
router.delete("/delete", deleteProfile);

export default router;