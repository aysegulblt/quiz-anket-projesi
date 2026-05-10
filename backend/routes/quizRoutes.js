const express = require("express");
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getMyQuizzes,
} = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/", getAllQuizzes);
router.get("/my/quizzes", protect, getMyQuizzes);
router.get("/:id", getQuizById);

router.post("/", protect, createQuiz);
router.put("/:id", protect, updateQuiz);
router.delete("/:id", protect, deleteQuiz);

module.exports = router;