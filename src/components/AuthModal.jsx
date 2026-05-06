import { useState } from "react";

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        onLogin(user);
        onClose();
        setFormData({ email: "", password: "", name: "", confirmPassword: "" });
      } else {
        setError("Неверный email или пароль");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Пароли не совпадают");
        return;
      }
      
      if (formData.password.length < 6) {
        setError("Пароль должен содержать минимум 6 символов");
        return;
      }
      
      if (!formData.name.trim()) {
        setError("Введите ваше имя");
        return;
      }
      
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      if (users.find(u => u.email === formData.email)) {
        setError("Пользователь с таким email уже существует");
        return;
      }
      
      const newUser = {
        id: Date.now(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        registeredAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      onLogin(newUser);
      onClose();
      setFormData({ email: "", password: "", name: "", confirmPassword: "" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <div className="auth-modal-header">
          <div className="auth-modal-icon">🔐</div>
          <h2>{isLogin ? "Вход в аккаунт" : "Регистрация"}</h2>
          <p>{isLogin ? "Войдите в свой аккаунт" : "Создайте новый аккаунт"}</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
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
                placeholder="Например: Иван Петров"
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
              placeholder="ivan@example.com"
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
              placeholder="Минимум 6 символов"
            />
          </div>
          
          {!isLogin && (
            <div className="auth-form-group">
              <label>Подтверждение пароля</label>
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
          
          <button type="submit" className="auth-submit-btn">
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({ email: "", password: "", name: "", confirmPassword: "" });
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