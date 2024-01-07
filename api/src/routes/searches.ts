/**
 * Searching/Exploring Routes
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import express from "express";
import { 
  get5AllTimeTop,
  get5MonthlyTop,
  get5New,
  get5Saved,
  get5YearlyTop,
  getAllCount,
  getAllTimeTop, 
  getMonthlyCount, 
  getMonthlyTop, 
  getNew, 
  getSaved, 
  getSavedCount, 
  getYearlyCount, 
  getYearlyTop, 
  searchAll, 
  searchStories, 
  searchUsers 
} from "../controllers/search";

const router = express.Router();

// Routes
// General purpose routes
router.post("/all", searchAll);
router.post("/story", searchStories);
router.post("/user", searchUsers);
router.get("/stories/count", getAllCount);

// Saved stories routes
router.post("/saved", getSaved);
router.post("/saved/5", get5Saved);
router.post("/saved/count", getSavedCount);

// New stories routes
router.post("/new", getNew);
router.get("/new/5", get5New);

// Top stories of all time routes
router.post("/top", getAllTimeTop);
router.get("/top/5", get5AllTimeTop);
router.get("/top/count", getAllCount);

// Top stories this month routes
router.post("/top/monthly", getMonthlyTop);
router.get("/top/monthly/5", get5MonthlyTop);
router.get("/top/monthly/count", getMonthlyCount);

// Top stories this year routes
router.post("/top/yearly", getYearlyTop);
router.get("/top/yearly/5", get5YearlyTop);
router.get("/top/yearly/count", getYearlyCount);

export default router;