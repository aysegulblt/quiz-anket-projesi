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

module.exports = {
  createQuiz,
};