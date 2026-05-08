import { useEffect, useState } from "react";
import { getAllQuizzes } from "../services/quizService";
import { Link } from "react-router-dom";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.log("Quizler alınamadı:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <h2 className="page-title">Tüm Quizler</h2>

      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="quiz-card">
            <Link
                to={`/quizzes/${quiz._id}`}
                className="quiz-link"
                >
                <div className="quiz-card">
                    <h3>{quiz.title}</h3>

                    <p>{quiz.description}</p>

                    <span>
                    {quiz.questions.length} soru
                    </span>
                </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;