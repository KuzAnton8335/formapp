import React, { useState } from "react";
import { login } from "../../api/userApi.js"; // путь к вашему api.js
import "./loginpage.scss";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await login(formData.email, formData.password);
      console.log("Login successful:", response);
      
      // Здесь можно перенаправить пользователя или обновить состояние приложения
      window.location.href = "/table"; // например, перенаправление
      
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="loginpage">
      <div className="loginpage__container">
        <h1 className="loginpage__title">Login</h1>
        {error && <div className="loginpage__error">{error}</div>}
        <form className="loginpage__form" onSubmit={handleSubmit}>
          <div className="loginpage__row">
            <label htmlFor="email" className="loginpage__label">
              Электронная почта
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="test@example.com"
              className="loginpage__input"
              required
            />
          </div>
          <div className="loginpage__row">
            <label htmlFor="password" className="loginpage__label">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="loginpage__input"
              required
            />
          </div>
          <button
            type="submit"
            className="loginpage__button"
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>
      </div>
    </section>
  );
};