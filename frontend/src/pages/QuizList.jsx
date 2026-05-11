import { useEffect, useState } from "react";
import { getAllQuizzes } from "../services/quizService";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.log("Quizler alınamadı:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <h2 className="page-title">Tüm Quizler</h2>
      {loading ? (
        <Loading />
      ) : quizzes.length === 0 ? (
        <EmptyState
          title="Henüz quiz bulunmuyor"
          description="İlk quizi oluşturduğunuzda burada listelenecek."
        />
      ) : (
        <div className="quiz-grid">
          {/* mevcut map kısmı */}
        </div>
      )}
      

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