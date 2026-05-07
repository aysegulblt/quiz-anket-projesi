const express = require("express");
const { createQuiz } = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createQuiz);

module.exports = router;