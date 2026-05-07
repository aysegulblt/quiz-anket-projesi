const express = require("express");
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
} = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.post("/", protect, createQuiz);
router.put("/:id", protect, updateQuiz);

module.exports = router;