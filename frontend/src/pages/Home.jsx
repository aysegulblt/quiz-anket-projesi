import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            Quiz Platformu
          </span>

          <h1>
            Bilgini test et,
            <br />
            kendi quizlerini oluştur.
          </h1>

          <p>
            Farklı kategorilerde quizler çöz, kendi sorularını hazırla
            ve sonuçlarını detaylı şekilde takip et.
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
            <div className="stat-card">
              <h3>100+</h3>
              <span>Quiz</span>
            </div>

            <div className="stat-card">
              <h3>50+</h3>
              <span>Kullanıcı</span>
            </div>

            <div className="stat-card">
              <h3>300+</h3>
              <span>Çözüm</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle"></div>

          <div className="hero-card">
            <div className="hero-card-badge">Örnek Quiz</div>
            <h3>Frontend Geliştirme</h3>
            <p>
              HTML, CSS, React ve JavaScript
              konularında bilgini test et.
            </p>
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
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Quiz Oluştur</h3>
            <p>
              Kendi sorularını hazırlayarak
              özel quizler oluştur ve paylaş.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Sonuçlarını Takip Et</h3>
            <p>
              Çözdüğün quizlerin sonuçlarını
              detaylı şekilde görüntüle.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Bilgini Geliştir</h3>
            <p>
              Farklı kategorilerde quizler
              çözerek kendini test et.
            </p>
          </div>
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