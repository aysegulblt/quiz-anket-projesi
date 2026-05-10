import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Giriş Yap</h2>
        <p>Hesabına giriş yaparak quiz oluşturabilir ve çözebilirsin.</p>

        {error && <div className="error-message">{error}</div>}

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
      </form>
    </div>
  );
}

export default Login;