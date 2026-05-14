import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
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
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    if (!payload.name || !payload.email || !payload.password.trim()) {
      toast.error("Tüm alanları doldurun.");
      return;
    }

    if (payload.password.trim().length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    try {
      setIsSubmitting(true);
      await registerUser(payload);

      toast.success("Kayıt başarılı. Şimdi giriş yapabilirsiniz.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Kayıt işlemi sırasında bir sorun oluştu."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-info-panel">
        <span className="hero-badge">Quizora</span>

        <h1>Yeni hesabını oluştur ve quiz dünyasına katıl.</h1>

        <p>
          Kendi quizlerini oluşturabilir, farklı quizleri çözebilir ve
          gelişimini sonuç ekranından takip edebilirsin.
        </p>

        <div className="auth-mini-card">
          <strong>Hızlı başlangıç</strong>
          <span>Hesap oluştur, quiz keşfet ve sonuçlarını görüntüle.</span>
        </div>
      </div>

      <div className="auth-container">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Kayıt Ol</h2>
          <p>Yeni hesabını oluşturarak platforma katıl.</p>

          <label htmlFor="register-name">Ad Soyad</label>
          <input
            id="register-name"
            type="text"
            name="name"
            placeholder="Adınızı girin"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            disabled={isSubmitting}
          />

          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="ornek@mail.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={isSubmitting}
          />

          <label htmlFor="register-password">Şifre</label>
          <input
            id="register-password"
            type="password"
            name="password"
            placeholder="Şifrenizi oluşturun"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={isSubmitting}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
          </button>

          <div className="auth-footer-text">
            Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
