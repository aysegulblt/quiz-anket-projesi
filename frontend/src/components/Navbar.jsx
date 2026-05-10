import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-logo">QuizAnket</div>

      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <div className={menuOpen ? "nav-links active" : "nav-links"}>
        <Link to="/" onClick={closeMenu}>Ana Sayfa</Link>
        <Link to="/quizzes" onClick={closeMenu}>Quizler</Link>

        {user && (
          <>
            <Link to="/create-quiz" onClick={closeMenu}>Quiz Oluştur</Link>
            <Link to="/my-quizzes" onClick={closeMenu}>Benim Quizlerim</Link>
            <Link to="/my-results" onClick={closeMenu}>Sonuçlarım</Link>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login" onClick={closeMenu}>Giriş</Link>
            <Link to="/register" className="nav-button" onClick={closeMenu}>
              Kayıt Ol
            </Link>
          </>
        ) : (
          <>
            <span className="nav-user">{user.name}</span>
            <button
              className="logout-button"
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Çıkış
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;