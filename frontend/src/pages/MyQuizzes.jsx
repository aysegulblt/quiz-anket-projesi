import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteQuiz } from "../services/quizService";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/quizzes/my/quizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setQuizzes(response.data);
      } catch (error) {
        console.log("Quizler alınamadı:", error);
        toast.error("Quizler alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyQuizzes();
  }, [token]);

  const handleDeleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm(
      "Bu quizi silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) return;

    try {
      await deleteQuiz(quizId, token);

      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
      toast.success("Quiz başarıyla silindi.");
    } catch (error) {
      console.log("Quiz silinemedi:", error);
      toast.error("Quiz silinemedi.");
    }
  };

  return (
    <div>
      <h1 className="page-title">Benim Quizlerim</h1>

      {loading ? (
        <Loading />
      ) : quizzes.length === 0 ? (
        <EmptyState
          title="Henüz quiz oluşturmadınız"
          description="Yeni bir quiz oluşturduğunuzda burada görünecek."
        />
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <Link
              key={quiz._id}
              to={`/quizzes/${quiz._id}`}
              className="quiz-link"
            >
              <div className="quiz-card">
                <h3>{quiz.title}</h3>

                <p>{quiz.description}</p>

                <span>{quiz.questions.length} soru</span>

                <div className="quiz-card-actions">
                  <Link
                    to={`/edit-quiz/${quiz._id}`}
                    className="edit-button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Düzenle
                  </Link>

                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteQuiz(quiz._id);
                    }}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyQuizzes;