import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { saveQuizResult } from "../services/resultService";
import Loading from "../components/Loading";

function QuizDetail() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
        setQuiz(response.data);
      } catch (error) {
        console.log("Quiz detayı alınamadı:", error);
        toast.error("Quiz detayı alınamadı.");
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSelectAnswer = (questionIndex, option) => {
    if (showResult) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option,
    });
  };

  const calculateScore = () => {
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++;
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
      } catch (error) {
        toast.error("Quiz sonucu kaydedilemedi.");
        console.log("Sonuç kaydetme hatası:", error);
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
              {question.options.map((option, i) => {
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
                    key={i}
                    className={optionClass}
                    onClick={() => handleSelectAnswer(index, option)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!showResult && (
        <div className="submit-area">
          <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
            Quiz'i Bitir
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizDetail;