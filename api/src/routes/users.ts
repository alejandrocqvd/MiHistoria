import express from "express";
import { deleteProfile, getProfile, getUsername, updatePassword, updateProfile } from "../controllers/user";

const router = express.Router();

router.get("/profile", getProfile);
router.get("/username", getUsername);
router.post("/edit", updateProfile);
router.post("/password", updatePassword);
router.delete("/delete", deleteProfile);

export default router;