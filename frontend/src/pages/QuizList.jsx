import { useEffect, useState } from "react";
import { getAllQuizzes } from "../services/quizService";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.log("Quizler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchText.toLowerCase())
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
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {loading ? (
        <Loading />
      ) : filteredQuizzes.length === 0 ? (
        <EmptyState
          title="Quiz bulunamadı"
          description="Arama sonucuna uygun bir quiz bulunmuyor."
        />
      ) : (
        <div className="quiz-grid">
          {filteredQuizzes.map((quiz) => (
            <Link
              key={quiz._id}
              to={`/quizzes/${quiz._id}`}
              className="quiz-link"
            >
              <div className="quiz-card">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>

                <div className="quiz-card-footer">
                  <span>{quiz.questions.length} soru</span>
                  <span className="quiz-card-action">Çöz →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizList;