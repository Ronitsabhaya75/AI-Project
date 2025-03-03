import express from "express";
import interviewController from "../controller/interviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", authMiddleware,  interviewController.startInterview);
router.post("/submit", authMiddleware, interviewController.submitCode);

export default router;
