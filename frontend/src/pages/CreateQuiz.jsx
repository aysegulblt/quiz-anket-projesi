import { FileText, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createQuiz } from "../services/quizService";
import {
  createEmptyQuestion,
  MIN_OPTION_COUNT,
  validateQuizPayload,
} from "../utils/quizValidation";

function CreateQuiz() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuestionChange = (index, value) => {
    setError("");
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, questionIndex) =>
        questionIndex === index
          ? { ...question, questionText: value }
          : question
      )
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setError("");
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) {
          return question;
        }

        const nextOptions = [...question.options];
        nextOptions[optionIndex] = value;

        return {
          ...question,
          options: nextOptions,
          correctAnswer: nextOptions.includes(question.correctAnswer)
            ? question.correctAnswer
            : "",
        };
      })
    );
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    setError("");
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, currentQuestionIndex) =>
        currentQuestionIndex === questionIndex
          ? { ...question, correctAnswer: value }
          : question
      )
    );
  };

  const addQuestion = () => {
    setError("");
    setQuestions((currentQuestions) => [...currentQuestions, createEmptyQuestion()]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      setError("Quiz için en az bir soru bırakmalısınız.");
      return;
    }

    setError("");
    setQuestions((currentQuestions) =>
      currentQuestions.filter((_, questionIndex) => questionIndex !== index)
    );
  };

  const handleAddOption = (questionIndex) => {
    setError("");
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) {
          return question;
        }
        return {
          ...question,
          options: [...question.options, ""],
        };
      })
    );
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    setError("");
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) {
          return question;
        }

        if (question.options.length <= MIN_OPTION_COUNT) {
          setError(`Her soru için en az ${MIN_OPTION_COUNT} seçenek olmalıdır.`);
          return question;
        }

        const removedOption = question.options[optionIndex];
        const nextOptions = question.options.filter((_, i) => i !== optionIndex);

        return {
          ...question,
          options: nextOptions,
          correctAnswer:
            question.correctAnswer === removedOption ? "" : question.correctAnswer,
        };
      })
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validation = validateQuizPayload({ title, questions });

    if (validation.error) {
      setError(validation.error);
      return;
    }

    try {
      setIsSubmitting(true);

      await createQuiz(
        {
          title: validation.title,
          description: description.trim(),
          questions: validation.questions,
        },
        token
      );

      toast.success("Quiz başarıyla oluşturuldu.");
      navigate("/my-quizzes");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Quiz oluşturulurken bir sorun oluştu."
      );
    } finally {
      setIsSubmitting(false);
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
        {error ? <div className="error-message">{error}</div> : null}

        <div className="form-card">
          <h3>Quiz Bilgileri</h3>

          <label htmlFor="quiz-title">Quiz Başlığı</label>
          <input
            id="quiz-title"
            type="text"
            placeholder="Örn: Web Programlama Temel Quiz"
            value={title}
            onChange={(event) => {
              setError("");
              setTitle(event.target.value);
            }}
            disabled={isSubmitting}
          />

          <label htmlFor="quiz-description">Açıklama</label>
          <textarea
            id="quiz-description"
            placeholder="Quiz hakkında kısa bir açıklama yazın."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="question-editor-list">
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question-editor-card">
              <div className="question-editor-header">
                <div>
                  <span className="badge badge-small">
                    Soru {questionIndex + 1}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-small btn-danger"
                  onClick={() => removeQuestion(questionIndex)}
                  disabled={isSubmitting}
                >
                  Sil
                </button>
              </div>

              <label>Soru Metni</label>
              <input
                type="text"
                placeholder="Soru metnini yazın"
                value={question.questionText}
                onChange={(event) =>
                  handleQuestionChange(questionIndex, event.target.value)
                }
                disabled={isSubmitting}
              />

              <label>Seçenekler</label>
              <div className="options-grid">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-input-row">
                    <input
                      type="text"
                      placeholder={`Seçenek ${optionIndex + 1}`}
                      value={option}
                      onChange={(event) =>
                        handleOptionChange(
                          questionIndex,
                          optionIndex,
                          event.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                    {question.options.length > MIN_OPTION_COUNT ? (
                      <button
                        type="button"
                        className="option-remove-btn"
                        onClick={() =>
                          handleRemoveOption(questionIndex, optionIndex)
                        }
                        disabled={isSubmitting}
                        title="Seçeneği sil"
                        aria-label={`Seçenek ${optionIndex + 1} sil`}
                      >
                        <Trash2 size={14} strokeWidth={1.9} />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-small btn-secondary option-add-btn"
                onClick={() => handleAddOption(questionIndex)}
                disabled={isSubmitting}
              >
                <PlusCircle size={14} strokeWidth={1.9} aria-hidden="true" />
                Seçenek Ekle
              </button>

              <label>Doğru Cevap</label>
              <select
                value={question.correctAnswer}
                onChange={(event) =>
                  handleCorrectAnswerChange(questionIndex, event.target.value)
                }
                disabled={isSubmitting}
              >
                <option value="">Doğru cevabı seçin</option>

                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option} disabled={!option.trim()}>
                    {option || `Seçenek ${optionIndex + 1}`}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="sticky-actions">
          <div className="sticky-actions-note">
            Tüm seçenekleri doldurup doğru cevabı işaretlediğinizden emin olun.
          </div>

          <div className="sticky-actions-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addQuestion}
              disabled={isSubmitting}
            >
              <PlusCircle size={16} strokeWidth={1.9} aria-hidden="true" />
              Yeni Soru Ekle
            </button>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Quiz kaydediliyor..." : "Quiz Kaydet"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateQuiz;
