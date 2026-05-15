import { Award, BookOpen, Calendar, Target, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authService";
import { getMyQuizzes } from "../services/quizService";
import { getMyResults } from "../services/resultService";

function Profile() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [createdAt, setCreatedAt] = useState(null);
  const [stats, setStats] = useState({
    quizCount: 0,
    solvedCount: 0,
    averagePercent: 0,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const [quizzes, results, profileData] = await Promise.all([
          getMyQuizzes(token),
          getMyResults(token),
          getProfile(token).catch(() => null),
        ]);

        const quizCount = quizzes.length;
        const solvedCount = results.length;
        const averagePercent =
          solvedCount > 0
            ? Math.round(
                results.reduce((sum, result) => {
                  const percent =
                    result.totalQuestions > 0
                      ? (result.score / result.totalQuestions) * 100
                      : 0;
                  return sum + percent;
                }, 0) / solvedCount
              )
            : 0;

        setStats({ quizCount, solvedCount, averagePercent });

        if (profileData?.user?.createdAt) {
          setCreatedAt(profileData.user.createdAt);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Profil bilgileri yüklenirken bir sorun oluştu."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  return (
    <div className="page-layout">
      <div className="page-header">
        <div>
          <span className="badge badge-with-icon">
            <User size={14} strokeWidth={1.9} aria-hidden="true" />
            Profilim
          </span>
          <h1>Hesap Bilgileri</h1>
          <p>Hesap bilgilerini ve quiz istatistiklerini görüntüle.</p>
        </div>
      </div>

      {loading ? (
        <Loading message="Profil bilgileri yükleniyor..." />
      ) : (
        <>
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="profile-info">
              <h2>{user?.name || "Kullanıcı"}</h2>
              <p>{user?.email || ""}</p>
              {createdAt ? (
                <small className="profile-date">
                  <Calendar size={12} strokeWidth={1.9} aria-hidden="true" />
                  {new Date(createdAt).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} tarihinden beri üye
                </small>
              ) : null}
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="profile-stat-icon" aria-hidden="true">
                <BookOpen size={20} strokeWidth={1.9} />
              </div>
              <div className="profile-stat-value">{stats.quizCount}</div>
              <div className="profile-stat-label">Oluşturulan Quiz</div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-icon" aria-hidden="true">
                <Target size={20} strokeWidth={1.9} />
              </div>
              <div className="profile-stat-value">{stats.solvedCount}</div>
              <div className="profile-stat-label">Çözülen Quiz</div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-icon" aria-hidden="true">
                <Award size={20} strokeWidth={1.9} />
              </div>
              <div className="profile-stat-value">%{stats.averagePercent}</div>
              <div className="profile-stat-label">Ortalama Başarı</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
