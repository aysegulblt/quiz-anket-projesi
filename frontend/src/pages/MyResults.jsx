import { useEffect, useState } from "react";
import { getMyResults } from "../services/resultService";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";

function MyResults() {
  const { token } = useAuth();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getMyResults(token);
        setResults(data);
      } catch (error) {
        console.log("Sonuçlar alınamadı:", error);
        toast.error("Sonuçlar alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  return (
    <div className="page-layout">
      <div className="page-header">
        <div>
          <span className="badge">Sonuçlarım</span>
          <h1>Quiz Sonuçların</h1>
          <p>Çözdüğün quizlerin sonuçlarını buradan takip edebilirsin.</p>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : results.length === 0 ? (
        <EmptyState
          title="Henüz sonuç bulunmuyor"
          description="Bir quiz çözdüğünüzde sonuçlarınız burada listelenecek."
        />
      ) : (
        <div className="result-list">
          {results.map((result) => {
            const percent = result.totalQuestions > 0
              ? Math.round((result.score / result.totalQuestions) * 100)
              : 0;

            return (
              <div key={result._id} className="result-card">
                <div className="result-card-info">
                  <h3>{result.quiz?.title || "Quiz bilgisi yok"}</h3>
                  <p>{result.quiz?.description}</p>
                  {result.createdAt && (
                    <small className="result-date">
                      {new Date(result.createdAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </small>
                  )}
                </div>

                <div className="result-card-score">
                  <div className="score-value">
                    {result.score}/{result.totalQuestions}
                  </div>
                  <div className="score-percent">%{percent}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyResults;