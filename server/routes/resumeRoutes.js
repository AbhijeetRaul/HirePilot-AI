import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadResume } from "../controllers/resumeController.js";
import { matchJobDescription } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/upload", upload.single("resume"), uploadResume);
router.post("/match-job", matchJobDescription);

export default router;