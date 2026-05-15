import { Award } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { getMyResults } from "../services/resultService";

function MyResults() {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const data = await getMyResults(token);
        setResults(data);
      } catch (error) {
        const message =
          error.response?.data?.message || "Sonuçların şu anda getirilemedi.";
        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  const getAttemptCounts = () => {
    const counts = {};
    for (const result of results) {
      const quizId = result.quiz?._id || result.quiz || "unknown";
      counts[quizId] = (counts[quizId] || 0) + 1;
    }
    return counts;
  };

  const getAttemptIndex = (result, index) => {
    const quizId = result.quiz?._id || result.quiz || "unknown";
    let count = 0;
    for (let i = 0; i <= index; i++) {
      const rId = results[i].quiz?._id || results[i].quiz || "unknown";
      if (rId === quizId) {
        count++;
      }
    }
    return count;
  };

  const attemptCounts = results.length > 0 ? getAttemptCounts() : {};

  return (
    <div className="page-layout">
      <div className="page-header">
        <div>
          <span className="badge">Sonuçlarım</span>
          <h1>Quiz Sonuçların</h1>
          <p>Çözdüğün quizlerin sonuçlarını buradan takip edebilirsin.</p>
        </div>
      </div>

      {loading ? <Loading message="Sonuçların yükleniyor..." /> : null}

      {!loading && loadError ? (
        <EmptyState
          title="Sonuçlar yüklenemedi"
          description="Sonuçlarını getirirken bir sorun oluştu. Lütfen tekrar deneyin."
          actionLabel="Tekrar Dene"
          actionOnClick={() => window.location.reload()}
        />
      ) : null}

      {!loading && !loadError && results.length === 0 ? (
        <EmptyState
          title="Henüz sonuç bulunmuyor"
          description="Bir quiz çözdüğünde sonuçların burada listelenecek."
          actionLabel="Quizlere Git"
          actionTo="/quizzes"
        />
      ) : null}

      {!loading && !loadError && results.length > 0 ? (
        <div className="result-list">
          {results.map((result, index) => {
            const percent =
              result.totalQuestions > 0
                ? Math.round((result.score / result.totalQuestions) * 100)
                : 0;

            const quizId = result.quiz?._id || result.quiz || "unknown";
            const totalAttempts = attemptCounts[quizId] || 1;
            const attemptIndex = getAttemptIndex(result, index);

            return (
              <div key={result._id} className="result-card">
                <div className="result-card-info">
                  <h3>
                    {result.quiz?.title || "Silinmiş quiz"}
                    {totalAttempts > 1 ? (
                      <span className="result-attempt-badge">
                        {attemptIndex}. çözüm
                      </span>
                    ) : null}
                  </h3>
                  <p>
                    {result.quiz?.description ||
                      "Bu quiz artık yayında değil, ancak sonucun kaydın içinde duruyor."}
                  </p>
                  {result.createdAt ? (
                    <small className="result-date">
                      {new Date(result.createdAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  ) : null}
                </div>

                <div className="result-card-score">
                  <div className="score-value">
                    <Award size={14} strokeWidth={1.9} aria-hidden="true" />
                    <span>
                      {result.score}/{result.totalQuestions}
                    </span>
                  </div>
                  <div className="score-percent">%{percent}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default MyResults;
