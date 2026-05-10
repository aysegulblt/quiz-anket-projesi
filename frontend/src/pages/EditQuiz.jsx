import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuizById, updateQuiz } from "../services/quizService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quiz = await getQuizById(id);
        setTitle(quiz.title);
        setDescription(quiz.description);
      } catch (error) {
        console.log("Quiz bilgileri alınamadı:", error);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Quiz başlığı boş bırakılamaz.");
      return;
    }

    try {
      await updateQuiz(
        id,
        {
          title,
          description,
        },
        token
      );

      navigate("/my-quizzes");
      toast.success("Quiz başarıyla güncellendi.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Quiz güncellenirken hata oluştu."
      );
    }
  };

  return (
    <div>
      <h1 className="page-title">Quiz Düzenle</h1>

      <form className="quiz-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-section">
          <label>Quiz Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={() => navigate("/my-quizzes")}>
            Vazgeç
          </button>

          <button type="submit" className="primary-button">
            Güncelle
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditQuiz;