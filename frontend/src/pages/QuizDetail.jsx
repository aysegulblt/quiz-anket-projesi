import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { saveQuizResult } from "../services/resultService";
import { getQuizById } from "../services/quizService";

function QuizDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isSubmittingResult, setIsSubmittingResult] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const data = await getQuizById(id);
        setQuiz(data);
        setSelectedAnswers({});
        setShowResult(false);
      } catch (error) {
        const message =
          error.response?.data?.message || "Quiz detayları şu anda alınamadı.";
        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSelectAnswer = (questionIndex, option) => {
    if (showResult) {
      return;
    }

    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionIndex]: option,
    }));
  };

  const calculateScore = () => {
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score += 1;
      }
    });

    return score;
  };

  const handleSubmit = async () => {
    if (!quiz) {
      return;
    }

    if (Object.keys(selectedAnswers).length !== quiz.questions.length) {
      toast.error("Sonucu görmek için önce tüm soruları cevaplayın.");
      return;
    }

    if (isSubmittingResult) {
      return;
    }

    setShowResult(true);

    if (user && token) {
      try {
        setIsSubmittingResult(true);
        await saveQuizResult(
          {
            quizId: quiz._id,
            selectedAnswers,
          },
          token
        );

        toast.success("Quiz sonucu kaydedildi.");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Quiz sonucu kaydedilirken bir sorun oluştu."
        );
      } finally {
        setIsSubmittingResult(false);
      }
    } else {
      toast("Sonucu kaydetmek için giriş yapabilirsiniz.");
    }
  };

  if (loading) {
    return <Loading message="Quiz yükleniyor..." />;
  }

  if (loadError || !quiz) {
    return (
      <EmptyState
        title="Quiz açılamadı"
        description="İstenen quiz bulunamadı veya şu anda görüntülenemiyor."
        actionLabel="Quizlere Dön"
        actionTo="/quizzes"
      />
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = quiz.questions.length;
  const progressPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const score = showResult ? calculateScore() : 0;
  const allQuestionsAnswered = answeredCount === totalQuestions;

  return (
    <div className="page-layout">
      <div className="page-header">
        <div>
          <span className="badge">Quiz Detayı</span>
          <h1>{quiz.title}</h1>
          <p>{quiz.description}</p>
        </div>

        <div className="summary-card">
          <span>Toplam Soru</span>
          <strong>{totalQuestions}</strong>
        </div>
      </div>

      <div className="progress-area">
        <div className="progress-info">
          <span>
            Cevaplanan: {answeredCount} / {totalQuestions}
          </span>
          <span>{progressPercent}%</span>
        </div>

        <div className="progress-bar">
          <div style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {showResult ? (
        <div className="result-highlight">
          <div>
            <h2>Sonuç</h2>
            <p>
              {totalQuestions} sorudan {score} doğru cevap verdin.
            </p>
          </div>

          <div className="result-highlight-score">
            {score} / {totalQuestions}
          </div>
        </div>
      ) : null}

      <div className="question-list">
        {quiz.questions.map((question, index) => (
          <div key={question._id} className="question-card">
            <div className="question-topline">
              <span>Soru {index + 1}</span>
              <small>{selectedAnswers[index] ? "Cevaplandı" : "Bekliyor"}</small>
            </div>

            <h3>{question.questionText}</h3>

            <div className="option-list">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[index] === option;
                const isCorrect = question.correctAnswer === option;

                let optionClass = "option-button";

                if (showResult && isCorrect) {
                  optionClass += " correct-option";
                } else if (showResult && isSelected && !isCorrect) {
                  optionClass += " wrong-option";
                } else if (isSelected) {
                  optionClass += " selected-option";
                }

                return (
                  <button
                    type="button"
                    key={optionIndex}
                    className={optionClass}
                    onClick={() => handleSelectAnswer(index, option)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!showResult ? (
        <div className="submit-area">
          <p className="submit-hint">
            {!allQuestionsAnswered
              ? "Sonucu görmek için önce tüm soruları cevaplayın."
              : user
                ? "Quiz bitirildiğinde sonucunuz hesabınıza kaydedilir."
                : "Misafir olarak sonucu görebilirsiniz. Kaydetmek için giriş yapın."}
          </p>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmittingResult}
          >
            {isSubmittingResult ? "Kaydediliyor..." : "Quizi Bitir"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default QuizDetail;
