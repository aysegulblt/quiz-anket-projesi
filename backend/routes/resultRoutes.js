const express = require("express");
const {
  saveQuizResult,
  getMyResults,
} = require("../controllers/resultController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, saveQuizResult);
router.get("/my-results", protect, getMyResults);

module.exports = router;