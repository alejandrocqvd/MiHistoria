import express from "express";
import { deleteProfile, getProfile, updatePassword, updateProfile } from "../controllers/user";

const router = express.Router();

router.get("/profile", getProfile);
router.post("/edit", updateProfile);
router.post("/password", updatePassword);
router.delete("/delete", deleteProfile);

export default router;