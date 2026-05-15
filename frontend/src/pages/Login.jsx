import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    if (!payload.email || !payload.password.trim()) {
      toast.error("Email ve şifre alanlarını doldurun.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await loginUser(payload);

      login(data.user, data.token);
      toast.success("Giriş başarılı.");
      navigate("/quizzes");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Giriş yapılırken bir sorun oluştu."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-info-panel">
        <span className="hero-badge">Quizora</span>

        <h1>Quizlerini oluştur, sonuçlarını takip et.</h1>

        <p>
          Hesabına giriş yaparak quiz oluşturabilir, çözebilir ve geçmiş
          sonuçlarını tek ekrandan takip edebilirsin.
        </p>

        <div className="auth-mini-card">
          <strong>3 adımda başla</strong>
          <span>Giriş yap, quiz seç ve sonucunu görüntüle.</span>
        </div>
      </div>

      <div className="auth-container">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Giriş Yap</h2>
          <p>Hesabına giriş yaparak devam et.</p>

          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="ornek@mail.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={isSubmitting}
          />

          <label htmlFor="login-password">Şifre</label>
          <div className="password-input-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Şifrenizi girin"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff size={16} strokeWidth={1.9} />
              ) : (
                <Eye size={16} strokeWidth={1.9} />
              )}
            </button>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

          <div className="auth-footer-text">
            Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
