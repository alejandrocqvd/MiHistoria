/**
 * Comment Routes
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import express from "express";
import { 
  createComment, 
  deleteComment, 
  getCommentCount, 
  getComments 
} from "../controllers/comment";

const router = express.Router();

// Routes
router.post("/get", getComments);
router.post("/count", getCommentCount);
router.post("/create", createComment);
router.delete("/delete", deleteComment);

export default router;