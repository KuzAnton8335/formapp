import "./tablepage.scss";
import { useEffect, useState } from "react";
import axios from "axios";

export const TablePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("Требуется авторизация. Пожалуйста, войдите в систему.");
      setLoading(false);
      return;
    }
    
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:3001/formdb/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data.appointments || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Ошибка при загрузке данных");
        setLoading(false);
        setAppointments([]);
      }
    };
    
    fetchAppointments();
  }, []);
  
  if (loading) return <div className="tablepage">Загрузка...</div>;
  if (error) return <div className="tablepage">Ошибка: {error}</div>;
  
  return (
    <section className="tablepage">
      <div className="tablepage__container">
        <h1 className="tablepage__title">Заявки с формы</h1>
        <table className="tablepage__table">
          <thead>
            <tr>
              <th>Дата отправки</th>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Проблема</th>
            </tr>
          </thead>
          <tbody>
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{new Date(appointment.createdAt).toLocaleDateString()}</td>
                  <td>{appointment.fullName}</td>
                  <td>{appointment.phone}</td>
                  <td>{appointment.problem}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Нет данных для отображения</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};