import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function QuizDetail() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${id}`
        );

        setQuiz(response.data);
      } catch (error) {
        console.log("Quiz detayı alınamadı:", error);
      }
    };

    fetchQuiz();
  }, [id]);

  if (!quiz) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div>
      <h1 className="page-title">{quiz.title}</h1>

      <p className="quiz-description">
        {quiz.description}
      </p>

      <div className="question-list">
        {quiz.questions.map((question, index) => (
          <div key={question._id} className="question-card">
            <h3>
              {index + 1}. {question.questionText}
            </h3>

            <div className="option-list">
              {question.options.map((option, i) => (
                <button key={i} className="option-button">
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizDetail;