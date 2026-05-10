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
const updateQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz bulunamadı.",
      });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Bu quiz üzerinde işlem yapma yetkiniz yok.",
      });
    }

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.questions = questions || quiz.questions;

    const updatedQuiz = await quiz.save();

    res.status(200).json({
      message: "Quiz başarıyla güncellendi.",
      quiz: updatedQuiz,
    });
  } catch (error) {
    res.status(500).json({
      message: "Quiz güncellenirken hata oluştu.",
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz bulunamadı.",
      });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Bu quiz üzerinde işlem yapma yetkiniz yok.",
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      message: "Quiz başarıyla silindi.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Quiz silinirken hata oluştu.",
    });
  }
};
const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({
      message: "Kullanıcı quizleri getirilirken hata oluştu.",
    });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getMyQuizzes,
};