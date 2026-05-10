const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");

const saveQuizResult = async (req, res) => {
  try {
    const { quizId, selectedAnswers } = req.body;

    if (!quizId || !selectedAnswers) {
      return res.status(400).json({
        message: "Quiz ID ve cevaplar zorunludur.",
      });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz bulunamadı.",
      });
    }

    let score = 0;

    const answers = quiz.questions.map((question, index) => {
      const selectedAnswer = selectedAnswers[index];
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score++;
      }

      return {
        questionText: question.questionText,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    const result = await QuizResult.create({
      user: req.user._id,
      quiz: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
      answers,
    });

    res.status(201).json({
      message: "Quiz sonucu kaydedildi.",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Quiz sonucu kaydedilirken hata oluştu.",
    });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user._id })
      .populate("quiz", "title description")
      .sort({ createdAt: -1 });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Sonuçlar getirilirken hata oluştu.",
    });
  }
};

module.exports = {
  saveQuizResult,
  getMyResults,
};