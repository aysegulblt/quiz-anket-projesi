import { FileText, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { getQuizById, updateQuiz } from "../services/quizService";
import {
  createEmptyQuestion,
  QUESTION_OPTION_COUNT,
  validateQuizPayload,
} from "../utils/quizValidation";

const mapQuestionToFormState = (question) => {
  const options = Array.isArray(question.options) ? [...question.options] : [];

  while (options.length < QUESTION_OPTION_COUNT) {
    options.push("");
  }

  return {
    questionText: question.questionText || "",
    options: options.slice(0, QUESTION_OPTION_COUNT),
    correctAnswer: question.correctAnswer || "",
  };
};

function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoadingQuiz(true);
        setLoadError("");
        const quiz = await getQuizById(id);
        const ownerId = quiz.createdBy?._id || quiz.createdBy;

        if (ownerId && user?.id && ownerId !== user.id) {
          setLoadError("Bu quizi düzenleme yetkiniz bulunmuyor.");
          return;
        }

        setTitle(quiz.title || "");
        setDescription(quiz.description || "");
        setQuestions(
          Array.isArray(quiz.questions) && quiz.questions.length > 0
            ? quiz.questions.map(mapQuestionToFormState)
            : [createEmptyQuestion()]
        );
      } catch (fetchError) {
        const message =
          fetchError.response?.data?.message ||
          "Quiz bilgileri şu anda alınamadı.";
        setLoadError(message);
        toast.error(message);
      } finally {
        setIsLoadingQuiz(false);
      }
    };

    fetchQuiz();
  }, [id, user?.id]);

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

      await updateQuiz(
        id,
        {
          title: validation.title,
          description: description.trim(),
          questions: validation.questions,
        },
        token
      );

      toast.success("Quiz başarıyla güncellendi.");
      navigate("/my-quizzes");
    } catch (submitError) {
      toast.error(
        submitError.response?.data?.message ||
          "Quiz güncellenirken bir sorun oluştu."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingQuiz) {
    return <Loading message="Quiz bilgileri yükleniyor..." />;
  }

  if (loadError) {
    return (
      <EmptyState
        title="Quiz düzenlenemedi"
        description={loadError}
        actionLabel="Quizlerime Dön"
        actionTo="/my-quizzes"
      />
    );
  }

  return (
    <div className="page-layout">
      <div className="page-header">
        <div>
          <span className="badge badge-with-icon">
            <FileText size={14} strokeWidth={1.9} aria-hidden="true" />
            Quiz Düzenleyici
          </span>
          <h1>Quiz Bilgilerini Güncelle</h1>
          <p>
            Başlık, açıklama ve soru yapısını tek ekrandan güncelleyebilirsin.
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

          <label htmlFor="edit-quiz-title">Quiz Başlığı</label>
          <input
            id="edit-quiz-title"
            type="text"
            value={title}
            onChange={(event) => {
              setError("");
              setTitle(event.target.value);
            }}
            disabled={isSubmitting}
          />

          <label htmlFor="edit-quiz-description">Açıklama</label>
          <textarea
            id="edit-quiz-description"
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
                value={question.questionText}
                onChange={(event) =>
                  handleQuestionChange(questionIndex, event.target.value)
                }
                disabled={isSubmitting}
              />

              <label>Seçenekler</label>
              <div className="options-grid">
                {question.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
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
                ))}
              </div>

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
            Kaydetmeden önce soru ve seçenek yapısını son kez kontrol edin.
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

            <div className="inline-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/my-quizzes")}
                disabled={isSubmitting}
              >
                Vazgeç
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Degisiklikler kaydediliyor..." : "Degisiklikleri Kaydet"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditQuiz;
