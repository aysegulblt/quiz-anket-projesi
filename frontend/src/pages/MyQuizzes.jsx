import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { deleteQuiz, getMyQuizzes } from "../services/quizService";

function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const data = await getMyQuizzes(token);
        setQuizzes(data);
      } catch (error) {
        const message =
          error.response?.data?.message || "Quizlerin şu anda alınamadı.";
        setLoadError(message);
        toast.error(message);
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

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteQuiz(quizId, token);
      setQuizzes((currentQuizzes) =>
        currentQuizzes.filter((quiz) => quiz._id !== quizId)
      );
      toast.success("Quiz başarıyla silindi.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Quiz silinirken bir sorun oluştu."
      );
    }
  };

  return (
    <div className="page-layout">
      <div className="page-header">
        <div>
          <span className="badge">Quizlerim</span>
          <h1>Oluşturduğun Quizler</h1>
          <p>Quizlerini buradan yönetebilir, düzenleyebilir veya silebilirsin.</p>
        </div>
      </div>

      {loading ? <Loading message="Quizlerin yükleniyor..." /> : null}

      {!loading && loadError ? (
        <EmptyState
          title="Quizlerin yüklenemedi"
          description="Quizlerini getirirken bir sorun oluştu. Lütfen tekrar deneyin."
          actionLabel="Tekrar Dene"
          actionOnClick={() => window.location.reload()}
        />
      ) : null}

      {!loading && !loadError && quizzes.length === 0 ? (
        <EmptyState
          title="Henüz quiz oluşturmadın"
          description="İlk quizini oluşturduğunda burada listelenecek."
          actionLabel="Yeni Quiz Oluştur"
          actionTo="/create-quiz"
        />
      ) : null}

      {!loading && !loadError && quizzes.length > 0 ? (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <Link to={`/quizzes/${quiz._id}`} className="quiz-link">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <span className="quiz-card-meta">{quiz.questions.length} soru</span>
              </Link>

              <div className="quiz-card-actions">
                <Link
                  to={`/edit-quiz/${quiz._id}`}
                  className="btn btn-small btn-outline"
                  onClick={(event) => event.stopPropagation()}
                >
                  Düzenle
                </Link>

                <button
                  type="button"
                  className="btn btn-small btn-danger"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default MyQuizzes;
