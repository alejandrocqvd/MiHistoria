import express from "express";
import { getPage, updatePage } from "../controllers/story";

const router = express.Router();

router.post("/page", getPage);
router.post("/edit", updatePage);

export default router;