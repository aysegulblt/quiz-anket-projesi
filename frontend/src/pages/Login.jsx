import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Email ve şifre alanları zorunludur.");
      return;
    }

    try {
      const data = await loginUser(formData);

      login(data.user, data.token);
      toast.success("Giriş başarılı.");
      navigate("/quizzes");
    } catch (error) {
      toast.error(error.response?.data?.message || "Giriş yapılırken hata oluştu.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-info-panel">
        <span className="hero-badge">Quizora</span>

        <h1>Quizlerini oluştur, sonuçlarını takip et.</h1>

        <p>
          Hesabına giriş yaparak quiz oluşturabilir, çözebilir ve
          geçmiş sonuçlarını tek ekrandan takip edebilirsin.
        </p>

        <div className="auth-mini-card">
          <strong>3 adımda başla</strong>
          <span>Giriş yap → Quiz seç → Sonucunu görüntüle</span>
        </div>
      </div>

      <div className="auth-container">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Giriş Yap</h2>

          <p>Hesabına giriş yaparak devam et.</p>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="ornek@mail.com"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Şifre</label>
          <input
            type="password"
            name="password"
            placeholder="Şifrenizi giriniz"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">Giriş Yap</button>

          <div className="auth-footer-text">
            Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;