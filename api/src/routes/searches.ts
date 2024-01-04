import express from "express";
import { 
  get5AllTimeTop,
  get5MonthlyTop,
  get5New,
  get5Saved,
  get5YearlyTop,
  getAllTimeTop, 
  getMonthlyTop, 
  getNew, 
  getSaved, 
  getYearlyTop, 
  searchAll, 
  searchStories, 
  searchUsers 
} from "../controllers/search";

const router = express.Router();

router.post("/all", searchAll);
router.post("/story", searchStories);
router.post("/user", searchUsers);
router.get("/saved", getSaved);
router.get("/saved/5", get5Saved);
router.get("/new", getNew);
router.get("/new/5", get5New);
router.get("/top", getAllTimeTop);
router.get("/top/5", get5AllTimeTop);
router.get("/top/monthly", getMonthlyTop);
router.get("/top/monthly/5", get5MonthlyTop);
router.get("/top/yearly", getYearlyTop);
router.get("/top/yearly/5", get5YearlyTop);

export default router;