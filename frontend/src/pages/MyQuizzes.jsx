import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteQuiz } from "../services/quizService";
import toast from "react-hot-toast";

function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");

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
      }
    };

    fetchMyQuizzes();
  }, []);

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

              <span>
                {quiz.questions.length} soru
              </span>

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
    </div>
  );
}

export default MyQuizzes;