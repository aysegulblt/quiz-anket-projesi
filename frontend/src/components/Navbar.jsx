import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((current) => !current);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        <span className="logo-icon" aria-hidden="true">
          <BookOpen size={16} strokeWidth={1.9} />
        </span>
        <span>Quizora</span>
      </Link>

      <button
        type="button"
        className="menu-button"
        onClick={toggleMenu}
        aria-controls="primary-navigation"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Mobil menüyü kapat" : "Mobil menüyü aç"}
      >
        {menuOpen ? (
          <X size={20} strokeWidth={1.9} />
        ) : (
          <Menu size={20} strokeWidth={1.9} />
        )}
      </button>

      <div
        id="primary-navigation"
        className={menuOpen ? "nav-links active" : "nav-links"}
      >
        <Link
          to="/"
          className={isActive("/") ? "nav-link nav-link-active" : "nav-link"}
          onClick={closeMenu}
        >
          Ana Sayfa
        </Link>

        <Link
          to="/quizzes"
          className={isActive("/quizzes") ? "nav-link nav-link-active" : "nav-link"}
          onClick={closeMenu}
        >
          Quizler
        </Link>

        {user ? (
          <>
            <Link
              to="/create-quiz"
              className={isActive("/create-quiz") ? "nav-link nav-link-active" : "nav-link"}
              onClick={closeMenu}
            >
              Quiz Oluştur
            </Link>

            <Link
              to="/my-quizzes"
              className={isActive("/my-quizzes") ? "nav-link nav-link-active" : "nav-link"}
              onClick={closeMenu}
            >
              Quizlerim
            </Link>

            <Link
              to="/my-results"
              className={isActive("/my-results") ? "nav-link nav-link-active" : "nav-link"}
              onClick={closeMenu}
            >
              Sonuçlarım
            </Link>

            <div className="nav-user-area">
              <Link to="/profile" className="nav-user" onClick={closeMenu}>{user.name}</Link>
              <button
                type="button"
                className="logout-button"
                onClick={() => {
                  closeMenu();
                  logout();
                  navigate("/");
                }}
              >
                Çıkış
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" onClick={closeMenu}>
              Giriş
            </Link>

            <Link to="/register" className="nav-button" onClick={closeMenu}>
              Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
