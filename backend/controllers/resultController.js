const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");

const getSelectedAnswer = (selectedAnswers, index) => {
  if (Array.isArray(selectedAnswers)) {
    return selectedAnswers[index];
  }

  if (selectedAnswers && typeof selectedAnswers === "object") {
    return selectedAnswers[index] ?? selectedAnswers[String(index)];
  }

  return undefined;
};

const saveQuizResult = async (req, res) => {
  try {
    const { quizId, selectedAnswers } = req.body;

    if (!quizId || selectedAnswers === undefined) {
      return res.status(400).json({
        message: "Quiz ve cevap bilgileri zorunludur.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(404).json({
        message: "Quiz bulunamadi.",
      });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz bulunamadi.",
      });
    }

    let score = 0;
    const answers = [];

    for (const [index, question] of quiz.questions.entries()) {
      const selectedAnswer = getSelectedAnswer(selectedAnswers, index);

      if (!selectedAnswer) {
        return res.status(400).json({
          message: "Sonucu kaydetmeden once tum sorulari cevaplayin.",
        });
      }

      if (!question.options.includes(selectedAnswer)) {
        return res.status(400).json({
          message: "Gonderilen cevaplardan biri gecersiz.",
        });
      }

      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score += 1;
      }

      answers.push({
        questionText: question.questionText,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    }

    const result = await QuizResult.create({
      user: req.user._id,
      quiz: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
      answers,
    });

    return res.status(201).json({
      message: "Quiz sonucu kaydedildi.",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Quiz sonucu kaydedilirken bir sorun olustu.",
    });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user._id })
      .populate("quiz", "title description")
      .sort({ createdAt: -1 });

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({
      message: "Sonuclar getirilirken bir sorun olustu.",
    });
  }
};

module.exports = {
  saveQuizResult,
  getMyResults,
};
