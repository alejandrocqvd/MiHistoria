import express from "express";
import { 
  deleteProfile, 
  getLiked, 
  getProfile, 
  getSaved, 
  getUsername, 
  updateLiked, 
  updatePassword, 
  updateProfile, 
  updateSaved 
} from "../controllers/user";

const router = express.Router();

router.get("/profile", getProfile);
router.get("/username", getUsername);
router.get("/liked", getLiked);
router.get("/saved", getSaved);
router.post("/like", updateLiked);
router.post("/save", updateSaved);
router.post("/edit", updateProfile);
router.post("/password", updatePassword);
router.delete("/delete", deleteProfile);

export default router;