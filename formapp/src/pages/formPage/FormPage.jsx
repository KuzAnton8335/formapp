import { useState } from "react";
import "./formpage.scss";
import { NavLink } from "react-router-dom";

export const FormPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    problem: ""
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/formdb/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Ошибка при отправке формы");
      }
      
      const data = await response.json();
      alert("Запись успешно отправлена!");
      setFormData({ fullName: "", phone: "", problem: "" });
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Произошла ошибка при отправке формы");
    }
  };
  
  return (
    <section className="form-page">
      <div className="form-page__container">
        <h1 className="form-page__title">Запись к врачу</h1>
        <form className="form-page__form" onSubmit={handleSubmit}>
          <div className="form-page__row">
            <label className="form-page__label">ФИО</label>
            <input
              className="form-page__input"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-page__row">
            <label className="form-page__label">Номер телефона</label>
            <input
              className="form-page__input"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-page__row">
            <label className="form-page__label">Опишите вашу проблему</label>
            <textarea
              className="form-page__textarea"
              placeholder="Опишите вашу проблему"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button className="form-page__button" type="submit">
            Отправить
          </button>
          <div className="form-page__entrance">
            <NavLink className="form-page__link" to="/login">Вход для администратора</NavLink>
          </div>
        </form>
      </div>
    </section>
  );
};