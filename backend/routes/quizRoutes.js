const express = require("express");
const { createQuiz,getQuizById, getAllQuizzes } = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.post("/", protect, createQuiz);
router.get("/:id", getQuizById);

module.exports = router;