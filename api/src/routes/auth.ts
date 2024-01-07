/**
 * Authentication Routes
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import express from "express";
import { 
  login, 
  logout, 
  register 
} from "../controllers/auth";

const router = express.Router();

// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;