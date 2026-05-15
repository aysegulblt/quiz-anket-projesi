const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");

const MIN_OPTION_COUNT = 2;

const normalizeQuestion = (question = {}) => ({
  questionText: question.questionText?.trim() || "",
  options: Array.isArray(question.options)
    ? question.options.map((option) => option.trim())
    : [],
  correctAnswer: question.correctAnswer?.trim() || "",
});

const validateQuizPayload = ({ title, questions }) => {
  const normalizedTitle = title?.trim() || "";

  if (!normalizedTitle) {
    return { error: "Quiz basligi zorunludur." };
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return { error: "Quiz icin en az bir soru eklemelisiniz." };
  }

  const normalizedQuestions = questions.map(normalizeQuestion);

  for (const [questionIndex, question] of normalizedQuestions.entries()) {
    const label = `${questionIndex + 1}. soru`;

    if (!question.questionText) {
      return { error: `${label} icin soru metni zorunludur.` };
    }

    if (question.options.length < MIN_OPTION_COUNT) {
      return {
        error: `${label} icin en az ${MIN_OPTION_COUNT} secenek girilmelidir.`,
      };
    }

    if (question.options.some((option) => !option)) {
      return { error: `${label} icin tum secenekler doldurulmalidir.` };
    }

    const uniqueOptions = new Set(
      question.options.map((option) => option.toLowerCase())
    );

    if (uniqueOptions.size !== question.options.length) {
      return {
        error: `${label} icindeki secenekler birbirinden farkli olmalidir.`,
      };
    }

    if (!question.correctAnswer) {
      return { error: `${label} icin dogru cevap secilmelidir.` };
    }

    if (!question.options.includes(question.correctAnswer)) {
      return {
        error: `${label} icin dogru cevap seceneklerden biri olmalidir.`,
      };
    }
  }

  return {
    error: null,
    title: normalizedTitle,
    questions: normalizedQuestions,
  };
};

const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const validation = validateQuizPayload({ title, questions });

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const quiz = await Quiz.create({
      title: validation.title,
      description: description?.trim() || "",
      questions: validation.questions,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Quiz basariyla olusturuldu.",
      quiz,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Quiz olusturulurken bir sorun olustu.",
    });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(quizzes);
  } catch (error) {
    return res.status(500).json({
      message: "Quizler listelenirken bir sorun olustu.",
    });
  }
};

const getQuizById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: "Quiz bulunamadi.",
      });
    }

    const quiz = await Quiz.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz bulunamadi.",
      });
    }

    return res.status(200).json(quiz);
  } catch (error) {
    return res.status(500).json({
      message: "Quiz getirilirken bir sorun olustu.",
    });
  }
};

const updateQuiz = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: "Quiz bulunamadi.",
      });
    }

    const { title, description, questions } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz bulunamadi.",
      });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Bu quiz uzerinde islem yapma yetkiniz yok.",
      });
    }

    const nextTitle =
      typeof title === "string" ? title.trim() : quiz.title;
    const nextDescription =
      typeof description === "string" ? description.trim() : quiz.description;
    const nextQuestions =
      questions !== undefined ? questions : quiz.questions;

    const validation = validateQuizPayload({
      title: nextTitle,
      questions: nextQuestions,
    });

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    quiz.title = validation.title;
    quiz.description = nextDescription;
    quiz.questions = validation.questions;

    const updatedQuiz = await quiz.save();

    return res.status(200).json({
      message: "Quiz basariyla guncellendi.",
      quiz: updatedQuiz,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Quiz guncellenirken bir sorun olustu.",
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: "Quiz bulunamadi.",
      });
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz bulunamadi.",
      });
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Bu quiz uzerinde islem yapma yetkiniz yok.",
      });
    }

    await quiz.deleteOne();

    return res.status(200).json({
      message: "Quiz basariyla silindi.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Quiz silinirken bir sorun olustu.",
    });
  }
};

const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(quizzes);
  } catch (error) {
    return res.status(500).json({
      message: "Kullanici quizleri getirilirken bir sorun olustu.",
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
