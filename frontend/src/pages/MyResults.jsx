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
    <div>
      <h1 className="page-title">Sonuç Geçmişim</h1>

      {loading ? (
        <Loading />
      ) : results.length === 0 ? (
        <EmptyState
          title="Henüz sonuç bulunmuyor"
          description="Bir quiz çözdüğünüzde sonuçlarınız burada listelenecek."
        />
      ) : (
        <div className="result-list">
          {results.map((result) => (
            <div key={result._id} className="result-history-card">
              <div>
                <h3>{result.quiz?.title || "Quiz bilgisi yok"}</h3>

                <p>{result.quiz?.description}</p>
              </div>

              <div className="result-score">
                {result.score} / {result.totalQuestions}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyResults;