import { useState } from "react";
import { loginUser, registerUser } from "../lib/api";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirmation,
} from "../lib/validation";

const emptyForm = {
  email: "",
  password: "",
  name: "",
  confirmPassword: "",
};

const emptyErrors = {
  email: "",
  password: "",
  name: "",
  confirmPassword: "",
};

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(emptyErrors);

  const validateField = (name, value, values = formData) => {
    switch (name) {
      case "name":
        return validateName(value, "Имя");
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validatePasswordConfirmation(values.password, value);
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextData);
    setError("");
    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, nextData),
      ...(name === "password"
        ? { confirmPassword: nextData.confirmPassword ? validateField("confirmPassword", nextData.confirmPassword, nextData) : "" }
        : {}),
    }));
  };

  const validateForm = () => {
    const nextErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      name: isLogin ? "" : validateField("name", formData.name),
      confirmPassword: isLogin ? "" : validateField("confirmPassword", formData.confirmPassword),
    };

    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setFieldErrors(emptyErrors);
    setError("");
  };

  const closeModal = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = isLogin
        ? await loginUser({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          })
        : await registerUser({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            name: formData.name.trim(),
            confirm_password: formData.confirmPassword,
          });

      onLogin(payload);
      closeModal();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={closeModal}>×</button>

        <div className="auth-modal-header">
          <h2>{isLogin ? "Вход в аккаунт" : "Регистрация"}</h2>
          <p>{isLogin ? "Войдите в свой аккаунт" : "Создайте новый аккаунт"}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="auth-form-group">
              <label htmlFor="auth-name">Ваше имя</label>
              <input
                id="auth-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                minLength={2}
                maxLength={80}
                placeholder="Например: Иван Петров"
                aria-invalid={Boolean(fieldErrors.name)}
              />
              {fieldErrors.name && <div className="auth-error">{fieldErrors.name}</div>}
            </div>
          )}

          <div className="auth-form-group">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="ivan@example.com"
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email && <div className="auth-error">{fieldErrors.email}</div>}
          </div>

          <div className="auth-form-group">
            <label htmlFor="auth-password">Пароль</label>
            <input
              id="auth-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              minLength={8}
              maxLength={128}
              placeholder="Минимум 8 символов, буквы и цифры"
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password && <div className="auth-error">{fieldErrors.password}</div>}
          </div>

          {!isLogin && (
            <div className="auth-form-group">
              <label htmlFor="auth-confirm-password">Подтверждение пароля</label>
              <input
                id="auth-confirm-password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                placeholder="Повторите пароль"
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
              />
              {fieldErrors.confirmPassword && <div className="auth-error">{fieldErrors.confirmPassword}</div>}
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                resetForm();
              }}
              className="auth-toggle-btn"
            >
              {isLogin ? "Создать аккаунт" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
