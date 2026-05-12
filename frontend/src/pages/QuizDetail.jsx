import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { saveQuizResult } from "../services/resultService";
import { getQuizById } from "../services/quizService";

function QuizDetail() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(id);
        setQuiz(data);
      } catch {
        toast.error("Quiz detayı alınamadı.");
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
    if (Object.keys(selectedAnswers).length !== quiz.questions.length) {
      toast.error("Lütfen tüm soruları cevaplayınız.");
      return;
    }

    setShowResult(true);

    if (user && token) {
      try {
        await saveQuizResult(
          {
            quizId: quiz._id,
            selectedAnswers,
          },
          token
        );

        toast.success("Quiz sonucu kaydedildi.");
      } catch {
        toast.error("Quiz sonucu kaydedilemedi.");
      }
    }
  };

  if (!quiz) {
    return <Loading />;
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = quiz.questions.length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const score = showResult ? calculateScore() : 0;

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

      {showResult && (
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
      )}

      <div className="question-list">
        {quiz.questions.map((question, index) => (
          <div key={question._id} className="question-card">
            <div className="question-topline">
              <span>Soru {index + 1}</span>
              <small>{selectedAnswers[index] ? "✓ Cevaplandı" : "Bekliyor"}</small>
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

      {!showResult && (
        <div className="submit-area">
          <button type="button" className="btn btn-primary btn-lg" onClick={handleSubmit}>
            Quiz'i Bitir
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizDetail;
