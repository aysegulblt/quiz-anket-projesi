import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-logo">QuizAnket</div>

      <div className="nav-links">
        <Link to="/">Ana Sayfa</Link>
        <Link to="/quizzes">Quizler</Link>
        {user && <Link to="/create-quiz">Quiz Oluştur</Link>}
        {user && <Link to="/my-quizzes">Benim Quizlerim</Link>}

        {!user ? (
          <>
            <Link to="/login">Giriş</Link>
            <Link to="/register" className="nav-button">
              Kayıt Ol
            </Link>
          </>
        ) : (
          <>
            <span className="nav-user">{user.name}</span>
            <button className="logout-button" onClick={logout}>
              Çıkış
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;