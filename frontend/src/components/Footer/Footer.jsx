import React from "react";
import "./Footer.css";

const Footer = ({ setPage, contactInfo }) => {
  const goToContacts = () => {
    setPage("home");

    setTimeout(() => {
      document
        .getElementById("contacts")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-columns">
          <div className="footer-column footer-brand">
            <h3>Gidrobas</h3>
            <p>Продажа и ремонт гидроцилиндров</p>
            <p>Актау • Атырау</p>
          </div>

          <div className="footer-column">
            <h4>Навигация</h4>

            <button onClick={() => setPage("home")}>
              Главная
            </button>

            <button onClick={() => setPage("catalog")}>
              Каталог
            </button>

            <button onClick={() => setPage("repair")}>
              Ремонт
            </button>

            <button onClick={goToContacts}>
              Контакты
            </button>
          </div>

          <div className="footer-column">
            <h4>Контакты</h4>
            <p>{contactInfo?.phone || "+7 (900) 123-45-67"}</p>
            <p>{contactInfo?.email || "info@gidrobas.ru"}</p>
            <p>Пн-Сб: 9:00-18:00</p>

            <button
              className="footer-action"
              onClick={() => setPage("repair")}
            >
              Оставить заявку
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Gidrobas. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
