import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">QuizAnket</div>

      <div className="nav-links">
        <Link to="/">Ana Sayfa</Link>
        <Link to="/quizzes">Quizler</Link>
        <Link to="/create-quiz">Quiz Oluştur</Link>
        <Link to="/login">Giriş</Link>
        <Link to="/register" className="nav-button">
          Kayıt Ol
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;