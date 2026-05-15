import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { getAllQuizzes } from "../services/quizService";
import { getMyResults } from "../services/resultService";

function QuizList() {
  const { user, token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [solvedQuizIds, setSolvedQuizIds] = useState(new Set());

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (error) {
        const message =
          error.response?.data?.message || "Quizler şu anda yüklenemedi.";
        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const fetchSolvedQuizzes = async () => {
      try {
        const results = await getMyResults(token);
        const ids = new Set(
          results
            .map((result) => result.quiz?._id || result.quiz)
            .filter(Boolean)
        );
        setSolvedQuizIds(ids);
      } catch {
        /* solved badge is optional, don't block the page */
      }
    };

    fetchSolvedQuizzes();
  }, [user, token]);

  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(normalizedSearch)
  );

  return (
    <div className="page-layout">
      <div className="page-header">
        <div>
          <span className="badge">Quiz Kütüphanesi</span>
          <h1>Tüm Quizler</h1>
          <p>Farklı konulardaki quizleri keşfet ve bilgini test et.</p>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Quiz ara..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </div>

      {loading ? <Loading message="Quizler yükleniyor..." /> : null}

      {!loading && loadError ? (
        <EmptyState
          title="Quizler yüklenemedi"
          description="Sunucuya bağlanırken bir sorun oluştu. Birkaç saniye sonra tekrar deneyin."
          actionLabel="Tekrar Dene"
          actionOnClick={() => window.location.reload()}
        />
      ) : null}

      {!loading && !loadError && filteredQuizzes.length === 0 ? (
        <EmptyState
          title={normalizedSearch ? "Aramana uygun quiz bulunamadı" : "Henüz quiz yok"}
          description={
            normalizedSearch
              ? "Farklı bir kelime ile tekrar arama yapabilirsin."
              : "Yeni quizler eklendiğinde burada görünecek."
          }
          actionLabel={normalizedSearch ? "" : "Quiz Oluştur"}
          actionTo={normalizedSearch ? undefined : "/create-quiz"}
        />
      ) : null}

      {!loading && !loadError && filteredQuizzes.length > 0 ? (
        <div className="quiz-grid">
          {filteredQuizzes.map((quiz) => (
            <Link
              key={quiz._id}
              to={`/quizzes/${quiz._id}`}
              className="quiz-link"
            >
              <div className="quiz-card">
                <h3>
                  {quiz.title}
                  {solvedQuizIds.has(quiz._id) ? (
                    <span className="badge-solved">✓ Çözüldü</span>
                  ) : null}
                </h3>
                <p>{quiz.description}</p>

                <div className="quiz-card-footer">
                  <span>{quiz.questions.length} soru</span>
                  <span className="quiz-card-action">Çöz</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default QuizList;
