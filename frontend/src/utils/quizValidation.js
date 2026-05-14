export const QUESTION_OPTION_COUNT = 4;

export const createEmptyQuestion = () => ({
  questionText: "",
  options: Array(QUESTION_OPTION_COUNT).fill(""),
  correctAnswer: "",
});

const normalizeQuestion = (question) => {
  const normalizedOptions = Array.isArray(question.options)
    ? question.options.map((option) => option.trim())
    : [];

  return {
    questionText: question.questionText?.trim() || "",
    options: normalizedOptions,
    correctAnswer: question.correctAnswer?.trim() || "",
  };
};

export const validateQuizPayload = ({ title, questions }) => {
  const normalizedTitle = title.trim();

  if (!normalizedTitle) {
    return { error: "Quiz başlığı zorunludur." };
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return { error: "Quiz için en az bir soru eklemelisiniz." };
  }

  const normalizedQuestions = questions.map(normalizeQuestion);

  for (const [questionIndex, question] of normalizedQuestions.entries()) {
    const label = `${questionIndex + 1}. soru`;

    if (!question.questionText) {
      return { error: `${label} için soru metnini doldurun.` };
    }

    if (question.options.length !== QUESTION_OPTION_COUNT) {
      return { error: `${label} için tam ${QUESTION_OPTION_COUNT} seçenek girilmelidir.` };
    }

    if (question.options.some((option) => !option)) {
      return { error: `${label} için tüm seçenekleri doldurun.` };
    }

    const uniqueOptions = new Set(
      question.options.map((option) => option.toLowerCase())
    );

    if (uniqueOptions.size !== question.options.length) {
      return { error: `${label} içindeki seçenekler birbirinden farklı olmalıdır.` };
    }

    if (!question.correctAnswer) {
      return { error: `${label} için doğru cevabı seçin.` };
    }

    if (!question.options.includes(question.correctAnswer)) {
      return { error: `${label} için seçilen doğru cevap seçeneklerle eşleşmiyor.` };
    }
  }

  return {
    error: null,
    title: normalizedTitle,
    questions: normalizedQuestions,
  };
};
