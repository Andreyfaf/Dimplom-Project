import "./AuthModal.css";
import { useState } from "react";

const AuthModal = ({ isOpen, onClose, onLogin }) => {

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const transferGuestCart = (userId) => {
    const guestCart = localStorage.getItem("cart_guest");

    if (guestCart) {
      const guestItems = JSON.parse(guestCart);

      if (guestItems.length > 0) {
        localStorage.setItem(
          `cart_${userId}`,
          JSON.stringify(guestItems)
        );

        localStorage.removeItem("cart_guest");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Проверка регистрации
    if (!isLogin) {

      if (formData.password !== formData.confirmPassword) {
        setError("Пароли не совпадают");
        return;
      }

      if (formData.password.length < 8) {
        setError("Пароль должен содержать минимум 8 символов");
        return;
      }

      if (!formData.name.trim()) {
        setError("Введите имя");
        return;
      }
    }

    try {

      const url = isLogin
        ? "http://127.0.0.1:8000/api/auth/login/"
        : "http://127.0.0.1:8000/api/auth/register/";

      const bodyData = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword,
            name: formData.name,
          };

      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {

        console.log(data);

        setError(
          data.detail ||
          data.email?.[0] ||
          data.password?.[0] ||
          data.non_field_errors?.[0] ||
          "Ошибка авторизации"
        );

        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );

      transferGuestCart(data.user.id);

      onLogin(data);

      onClose();

      setFormData({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
      });

    } catch (err) {

      console.error(err);

      setError("Ошибка подключения к серверу");

    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="auth-modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="auth-modal-header">

          <h2>
            {isLogin
              ? "Вход в аккаунт"
              : "Регистрация"}
          </h2>

          <p>
            {isLogin
              ? "Введите email и пароль"
              : "Создайте новый аккаунт"}
          </p>

        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <div className="auth-form-group">

              <label>Ваше имя</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Иван Петров"
              />

            </div>
          )}

          <div className="auth-form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@mail.com"
            />

          </div>

          <div className="auth-form-group">

            <label>Пароль</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Минимум 8 символов"
            />

          </div>

          {!isLogin && (
            <div className="auth-form-group">

              <label>
                Подтверждение пароля
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Повторите пароль"
              />

            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
          >
            {isLogin
              ? "Войти"
              : "Зарегистрироваться"}
          </button>

        </form>

        <div className="auth-footer">

          <p>

            {isLogin
              ? "Нет аккаунта?"
              : "Уже есть аккаунт?"}

            <button
              type="button"
              className="auth-toggle-btn"
              onClick={() => {

                setIsLogin(!isLogin);

                setError("");

                setFormData({
                  email: "",
                  password: "",
                  name: "",
                  confirmPassword: "",
                });

              }}
            >
              {isLogin
                ? "Регистрация"
                : "Войти"}
            </button>

          </p>

        </div>

      </div>

    </div>
  );
};

export default AuthModal;