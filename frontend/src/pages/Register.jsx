import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      toast.error("Tüm alanları doldurunuz.");
      return;
    }

    try {
      await registerUser(formData);

      toast.success("Kayıt başarılı.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Kayıt işlemi sırasında hata oluştu."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-info-panel">
        <span className="hero-badge">Quizora</span>

        <h1>Yeni hesabını oluştur ve quiz dünyasına katıl.</h1>

        <p>
          Kendi quizlerini oluşturabilir, farklı quizleri çözebilir
          ve gelişimini sonuç ekranından takip edebilirsin.
        </p>

        <div className="auth-mini-card">
          <strong>Hızlı başlangıç</strong>
          <span>Hesap oluştur → Quiz keşfet → Sonuçlarını görüntüle</span>
        </div>
      </div>

      <div className="auth-container">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Kayıt Ol</h2>

          <p>Yeni hesabını oluşturarak platforma katıl.</p>

          <label>Ad Soyad</label>
          <input
            type="text"
            name="name"
            placeholder="Adınızı giriniz"
            value={formData.name}
            onChange={handleChange}
          />

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
            placeholder="Şifrenizi oluşturunuz"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">Kayıt Ol</button>

          <div className="auth-footer-text">
            Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;