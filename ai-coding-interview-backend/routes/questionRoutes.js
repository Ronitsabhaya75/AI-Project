// routes/questionRoutes.js
import express from "express";
import questionController from "../controller/questionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a new question (protected by auth)
router.post("/add", authMiddleware, questionController.addQuestion);

// Other routes (GET)
router.get("/all", questionController.getAllQuestions);
router.get("/difficulty/:level", questionController.getQuestionsByDifficulty);
router.get("/company/:tag", questionController.getQuestionsByCompany);

export default router;
