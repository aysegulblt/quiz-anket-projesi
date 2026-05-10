import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { saveQuizResult } from "../services/resultService";

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
    return <p>Yükleniyor...</p>;
  }

  const score = showResult ? calculateScore() : 0;

  return (
    <div>
      <h1 className="page-title">{quiz.title}</h1>
      <p className="quiz-description">{quiz.description}</p>

      {showResult && (
        <div className="result-box">
          <h2>Sonuç</h2>
          <p>
            {quiz.questions.length} sorudan {score} doğru yaptınız.
          </p>
        </div>
      )}

      <div className="question-list">
        {quiz.questions.map((question, index) => (
          <div key={question._id} className="question-card">
            <h3>
              {index + 1}. {question.questionText}
            </h3>

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
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!showResult && (
        <button className="submit-quiz-button" onClick={handleSubmit}>
          Quiz'i Bitir
        </button>
      )}
    </div>
  );
}

export default QuizDetail;