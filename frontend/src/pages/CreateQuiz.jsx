import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../services/quizService";
import { useAuth } from "../context/AuthContext";

function CreateQuiz() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);

  const [error, setError] = useState("");

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      setError("En az bir soru olmalıdır.");
      return;
    }

    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Quiz başlığı zorunludur.");
      return;
    }

    for (const question of questions) {
      if (!question.questionText.trim()) {
        setError("Tüm soru metinleri doldurulmalıdır.");
        return;
      }

      if (question.options.some((option) => !option.trim())) {
        setError("Tüm seçenekler doldurulmalıdır.");
        return;
      }

      if (!question.correctAnswer.trim()) {
        setError("Her soru için doğru cevap seçilmelidir.");
        return;
      }
    }

    try {
      const quizData = {
        title,
        description,
        questions,
      };

      await createQuiz(quizData, token);
      navigate("/my-quizzes");
    } catch (error) {
      setError(
        error.response?.data?.message || "Quiz oluşturulurken hata oluştu."
      );
    }
  };

  return (
    <div>
      <h1 className="page-title">Quiz Oluştur</h1>

      <form className="quiz-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-section">
          <label>Quiz Başlığı</label>
          <input
            type="text"
            placeholder="Örn: Web Programlama Temel Quiz"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Açıklama</label>
          <textarea
            placeholder="Quiz hakkında kısa açıklama yazınız."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="question-editor-card">
            <div className="question-editor-header">
              <h3>Soru {questionIndex + 1}</h3>

              <button
                type="button"
                className="small-danger-button"
                onClick={() => removeQuestion(questionIndex)}
              >
                Soruyu Sil
              </button>
            </div>

            <label>Soru Metni</label>
            <input
              type="text"
              placeholder="Soru metnini yazınız"
              value={question.questionText}
              onChange={(e) =>
                handleQuestionChange(questionIndex, e.target.value)
              }
            />

            <label>Seçenekler</label>
            {question.options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                placeholder={`Seçenek ${optionIndex + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(
                    questionIndex,
                    optionIndex,
                    e.target.value
                  )
                }
              />
            ))}

            <label>Doğru Cevap</label>
            <select
              value={question.correctAnswer}
              onChange={(e) =>
                handleCorrectAnswerChange(questionIndex, e.target.value)
              }
            >
              <option value="">Doğru cevabı seçiniz</option>
              {question.options.map((option, optionIndex) => (
                <option key={optionIndex} value={option}>
                  {option || `Seçenek ${optionIndex + 1}`}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={addQuestion}>
            Yeni Soru Ekle
          </button>

          <button type="submit" className="primary-button">
            Quiz Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuiz;