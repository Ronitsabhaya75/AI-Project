import db from "../config/database.js";
import { analyzeCode } from "../service/geminiService.js";

const interviewController = {
  startInterview: async (req, res) => {
    try {
      console.log("Start interview request received:", req.body);
      const { difficulty } = req.body;

      if (!difficulty) {
        return res.status(400).json({ error: "Difficulty level is required" });
      }

      // Correct usage of db.oneOrNone
      const question = await db.oneOrNone(
        "SELECT * FROM questions WHERE difficulty = $1 ORDER BY RANDOM() LIMIT 1",
        [difficulty]
      );

      if (!question) {
        return res.status(404).json({ error: "No questions found for this difficulty" });
      }

      console.log("Selected question:", question);

      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
      }

      const interview = await db.one(
        "INSERT INTO interviews (user_id, question_id) VALUES ($1, $2) RETURNING id",
        [req.user.userId, question.id]
      );

      console.log("Interview started successfully:", interview.id);

      res.json({
        interviewId: interview.id,
        question: question.question_text,
      });
    } catch (error) {
      console.error("Error starting interview:", error);
      res.status(500).json({ error: "Failed to start interview", details: error.message });
    }
  },

  submitCode: async (req, res) => {
    try {
      console.log("🔹 Received Code Submission Data:", req.body);

      const { code, interviewId } = req.body;

      if (!code || !interviewId) {
        return res.status(400).json({ error: "Missing code or interviewId" });
      }

      const interview = await db.oneOrNone("SELECT * FROM interviews WHERE id = $1", [interviewId]);
      if (!interview) {
        return res.status(404).json({ error: "Interview not found" });
      }

      const question = await db.one("SELECT * FROM questions WHERE id = $1", [interview.question_id]);

      console.log("🔹 Sending code to AI for analysis...");
      
      const aiFeedback = await analyzeCode(code, question.question_text);
      
      if (!aiFeedback) {
        throw new Error("AI analysis returned null or undefined");
      }

      console.log("✅ AI Analysis Result:", aiFeedback);

      await db.none(
        "UPDATE interviews SET code_submission = $1, ai_feedback = $2 WHERE id = $3",
        [code, aiFeedback, interviewId]
      );

      res.json(aiFeedback);
    } catch (error) {
      console.error("❌ Code Submission Error:", error.message);
      res.status(500).json({ error: "Code submission failed", details: error.message });
    }
  },
};

export default interviewController;
