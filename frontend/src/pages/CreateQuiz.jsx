import { FileText, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createQuiz } from "../services/quizService";

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
      await createQuiz(
        {
          title,
          description,
          questions,
        },
        token
      );

      navigate("/my-quizzes");
      toast.success("Quiz başarıyla oluşturuldu.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Quiz oluşturulurken hata oluştu.");
    }
  };

  return (
    <div className="page-layout">
      <div className="page-header">
        <div>
          <span className="badge badge-with-icon">
            <FileText size={14} strokeWidth={1.9} aria-hidden="true" />
            Quiz Oluşturucu
          </span>
          <h1>Yeni Quiz Oluştur</h1>
          <p>
            Kendi sorularını hazırlayarak kullanıcıların çözebileceği yeni
            quizler oluştur.
          </p>
        </div>

        <div className="summary-card">
          <span className="summary-card-icon" aria-hidden="true">
            <FileText size={16} strokeWidth={1.9} />
          </span>
          <span>Toplam Soru</span>
          <strong>{questions.length}</strong>
        </div>
      </div>

      <form className="create-quiz-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-card">
          <h3>Quiz Bilgileri</h3>

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

        <div className="question-editor-list">
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question-editor-card">
              <div className="question-editor-header">
                <div>
                  <span className="badge badge-small">Soru {questionIndex + 1}</span>
                </div>

                <button
                  type="button"
                  className="btn btn-small btn-danger"
                  onClick={() => removeQuestion(questionIndex)}
                >
                  Sil
                </button>
              </div>

              <label>Soru Metni</label>
              <input
                type="text"
                placeholder="Soru metnini yazınız"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
              />

              <label>Seçenekler</label>
              <div className="options-grid">
                {question.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    placeholder={`Seçenek ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(questionIndex, optionIndex, e.target.value)
                    }
                  />
                ))}
              </div>

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
        </div>

        <div className="sticky-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addQuestion}
          >
            <PlusCircle size={16} strokeWidth={1.9} aria-hidden="true" />
            Yeni Soru Ekle
          </button>

          <button type="submit" className="btn btn-primary">
            Quiz Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuiz;
