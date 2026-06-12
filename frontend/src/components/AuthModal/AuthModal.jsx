import "./AuthModal.css";
import { useState } from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

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
        ? "/api/auth/login/"
        : "/api/auth/register/";

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
          data.error ||
          "Ошибка авторизации"
        );

        return;
      }

      if (!data.token) {
        setError("Сервер не вернул токен. Перезапустите Django и войдите заново.");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );

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

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="auth-modal"
      overlayClassName="modal-overlay"
      contentLabel={isLogin ? "Вход в аккаунт" : "Регистрация"}
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

    </ReactModal>
  );
};

export default AuthModal;
