import { BarChart3, BookOpen, CheckCircle2, PenSquare, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";

const featureItems = [
  {
    icon: PenSquare,
    title: "Quiz Oluştur",
    description: "Kendi sorularını hazırlayarak özel quizler oluştur ve paylaş.",
  },
  {
    icon: BarChart3,
    title: "Sonuçlarını Takip Et",
    description: "Çözdüğün quizlerin sonuçlarını detaylı şekilde görüntüle.",
  },
  {
    icon: Target,
    title: "Bilgini Geliştir",
    description: "Farklı kategorilerde quizler çözerek kendini test et.",
  },
];

const statItems = [
  { icon: BookOpen, value: "100+", label: "Quiz" },
  { icon: Users, value: "50+", label: "Kullanıcı" },
  { icon: CheckCircle2, value: "300+", label: "Çözüm" },
];

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Quiz Platformu</span>

          <h1>
            Bilgini test et,
            <br />
            kendi quizlerini oluştur.
          </h1>

          <p>
            Farklı kategorilerde quizler çöz, kendi sorularını hazırla ve
            sonuçlarını detaylı şekilde takip et.
          </p>

          <div className="hero-buttons">
            <Link to="/quizzes" className="btn btn-primary">
              Quizleri Keşfet
            </Link>

            <Link to="/create-quiz" className="btn btn-outline">
              Quiz Oluştur
            </Link>
          </div>

          <div className="hero-stats">
            {statItems.map(({ icon: Icon, value, label }) => (
              <div key={label} className="stat-card">
                <div className="stat-card-top">
                  <span className="stat-icon" aria-hidden="true">
                    <Icon size={16} strokeWidth={1.9} />
                  </span>
                  <span>{label}</span>
                </div>
                <h3>{value}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle"></div>

          <div className="hero-card">
            <div className="hero-card-badge">Örnek Quiz</div>
            <h3>Frontend Geliştirme</h3>
            <p>HTML, CSS, React ve JavaScript konularında bilgini test et.</p>
            <span className="hero-card-tag">12 Soru</span>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-section-header">
          <span className="hero-badge">Özellikler</span>
          <h2>Neler Yapabilirsin?</h2>
        </div>

        <div className="feature-grid">
          {featureItems.map(({ icon: Icon, title, description }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <Icon size={20} strokeWidth={1.9} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Hemen başla, ilk quizini oluştur.</h2>
        <p>Ücretsiz hesap oluştur ve quiz dünyasına katıl.</p>
        <Link to="/register" className="btn btn-primary">
          Ücretsiz Başla
        </Link>
      </section>
    </div>
  );
}

export default Home;
