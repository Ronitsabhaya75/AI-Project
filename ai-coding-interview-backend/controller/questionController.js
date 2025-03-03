import db from "../config/database.js";

const questionController = {
  addQuestion: async (req, res) => {
    const { question_text, difficulty, company_tag } = req.body;

    if (!question_text || !difficulty || !company_tag) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      await db.none(
        "INSERT INTO questions (question_text, difficulty, company_tag) VALUES ($1, $2, $3)",
        [question_text, difficulty, company_tag]
      );
      res.status(201).json({ message: "Question added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error adding question", details: error.message });
    }
  },

  getAllQuestions: async (req, res) => {
    try {
      const questions = await db.any("SELECT * FROM questions");
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: "Error fetching questions", details: error.message });
    }
  },

  getQuestionsByDifficulty: async (req, res) => {
    const { level } = req.params;
    try {
      const questions = await db.any(
        "SELECT * FROM questions WHERE difficulty = $1",
        [level]
      );
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: "Error fetching questions", details: error.message });
    }
  },

  getQuestionsByCompany: async (req, res) => {
    const { tag } = req.params;
    try {
      const questions = await db.any(
        "SELECT * FROM questions WHERE company_tag = $1",
        [tag]
      );
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: "Error fetching questions", details: error.message });
    }
  }
};

export default questionController;
