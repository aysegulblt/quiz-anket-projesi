const Quiz = require("../models/Quiz");

const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        message: "Başlık ve en az bir soru zorunludur.",
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Quiz başarıyla oluşturuldu.",
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      message: "Quiz oluşturulurken hata oluştu.",
    });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({
      message: "Quizler listelenirken hata oluştu.",
    });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz bulunamadı.",
      });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({
      message: "Quiz getirilirken hata oluştu.",
    });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
};