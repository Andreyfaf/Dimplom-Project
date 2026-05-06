import React from "react";
import emblem from "../assets/emblem.jpg";

const Header = ({ setPage, currentUser, setCurrentUser, openAuthModal }) => {

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setPage("home");
  };

  const goHome = () => setPage("home");

  const goCatalog = () => {
    setPage("home");
    setTimeout(() => {
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const goContacts = () => {
    setPage("home");
    setTimeout(() => {
      document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <header className="header">
      <div className="container header-content">

        {/* Лого */}
        <div className="header-left" onClick={goHome} style={{ cursor: "pointer" }}>
          <img src={emblem} alt="Логотип" className="emblem" />
          <h1>Gidrobas</h1>
        </div>

        {/* Навигация */}
        <nav>
          <button onClick={goCatalog}>Каталог</button>
          <button onClick={() => setPage("repair")}>Ремонт</button>  {/* ← вот сюда добавить */}
          <button onClick={goContacts}>Контакты</button>
          <button onClick={() => setPage("cart")}>Корзина</button>
          
          {currentUser ? (
            <div className="user-info">
              <span className="user-name">👤 {currentUser.name || currentUser.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="logout-btn">Выйти</button>
            </div>
          ) : (
            <button onClick={openAuthModal} className="auth-btn">Вход / Регистрация</button>
          )}
        </nav>

      </div>
    </header>
  );
};

export default Header;