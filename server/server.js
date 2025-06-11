const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose"); // Добавляем прямое подключение mongoose
const { log } = console;
require("dotenv").config();
const Appointment = require("./models/Appointment");

// Модель пользователя
const User = require("./models/User");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Функция подключения к БД и создания администратора
async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    log("✅ MongoDB подключен успешно");

    // Use .exec() to properly await the count
    const usersCount = await User.countDocuments().exec();

    if (usersCount === 0) {
      await User.create({
        email: "admin@mail.ru",
        password: await bcrypt.hash("103rts103", 8),
      });
      log("✅ Администратор создан");
    } else {
      log("ℹ️ Администратор уже существует");
    }
  } catch (error) {
    log("❌ Ошибка инициализации БД:", error.message);
    throw error;
  }
}

// Проверка аутентификации
const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send({ error: "Токен не предоставлен" });
    }

    // Добавляем второй аргумент - секретный ключ
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).send({ error: "Пожалуйста, авторизуйтесь" });
  }
};

// Маршруты для проверки авторизации login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //проверяем email и password представлены
    if (!email || !password) {
      res.status(400).send({ error: "Необходимо указать email и пароль" });
    }

    // ищем пользователя в базе данных
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: "Неверные учетные данные" });
    }
    // проверяем пароль
    const isPasswordMath = await bcrypt.compare(password, user.password);
    if (!isPasswordMath) {
      return res.status(401).send({ error: "Неверные учетные данные" });
    }

    // Генерируем токен jwt
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Токен будет действителен 24 часа
    );
    // Отправляем успешный ответ с токеном
    res.send({
      message: "Успешная авторизация",
      token,
      user: { email: user.email },
    });
  } catch (error) {
    console.error("Ошибка при авторизации:", error);
    res.status(500).send({ error: "Ошибка сервера при авторизации" });
  }
});

app.get("/profile", auth, async (req, res) => {
  res.send({ message: "Доступ разрешен", user: req.user });
});

// Добавьте этот маршрут после других маршрутов
app.post("/formdb/appointments", async (req, res) => {
  try {
    const { fullName, phone, problem } = req.body;

    // Проверка наличия всех обязательных полей
    if (!fullName || !phone || !problem) {
      return res
        .status(400)
        .json({ error: "Все поля обязательны для заполнения" });
    }

    // Создание новой записи
    const newAppointment = new Appointment({
      fullName,
      phone,
      problem,
    });

    // Сохранение в базу данных
    await newAppointment.save();

    res.status(201).json({
      message: "Запись успешно создана",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Ошибка при создании записи:", error);
    res.status(500).json({ error: "Ошибка сервера при создании записи" });
  }
});

// Маршрут для получения всех записей
app.get("/formdb/appointments", auth, async (req, res) => {
  try {
    // Получаем все записи из базы данных, сортируем по дате создания (новые сначала)
    const appointments = await Appointment.find().sort({ createdAt: -1 });

    // Отправляем данные клиенту
    res.status(200).json({
      message: "Записи успешно получены",
      appointments,
    });
  } catch (error) {
    console.error("Ошибка при получении записей:", error);
    res.status(500).json({ error: "Ошибка сервера при получении записей" });
  }
});

const PORT = process.env.PORT || 3001;

// Запуск сервера
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      log(`🚀 Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    log("❌ Фатальная ошибка при запуске:", error.message);
    process.exit(1);
  }
}

startServer();
