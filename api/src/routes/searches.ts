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
  getYearlyCount, 
  getYearlyTop, 
  searchAll, 
  searchStories, 
  searchUsers 
} from "../controllers/search";

const router = express.Router();

router.post("/all", searchAll);
router.post("/story", searchStories);
router.post("/user", searchUsers);

router.post("/saved", getSaved);
router.get("/saved/5", get5Saved);

router.post("/new", getNew);
router.get("/new/5", get5New);

router.post("/top", getAllTimeTop);
router.get("/top/5", get5AllTimeTop);
router.get("/top/count", getAllCount);

router.post("/top/monthly", getMonthlyTop);
router.get("/top/monthly/5", get5MonthlyTop);
router.get("/top/monthly/count", getMonthlyCount);

router.post("/top/yearly", getYearlyTop);
router.get("/top/yearly/5", get5YearlyTop);
router.get("/top/yearly/count", getYearlyCount);

router.get("/stories/count", getAllCount);

export default router;