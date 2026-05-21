import React from "react";
import "./Header.css";

import logo from "../assets/emblem.jpg";

const Header = ({
  setPage,
  currentUser,
  openAuthModal,
  onLogout,
}) => {
  return (
    <header className="header">
      <div className="header-container">

        <div
          className="logo-block"
          onClick={() => setPage("home")}
        >
          <img
            src={logo}
            alt="logo"
            className="logo-image"
          />

          <div className="logo-text">
            Gidrobas
          </div>
        </div>

        <div className="nav-menu">

          <div
            className="nav-link"
            onClick={() => setPage("home")}
          >
            Главная
          </div>

          <div
            className="nav-link"
            onClick={() => setPage("catalog")}
          >
            Каталог
          </div>

          <div
            className="nav-link"
            onClick={() => setPage("repair")}
          >
            Ремонт
          </div>

          {currentUser && (
            <>

              <div
                className="nav-link"
                onClick={() => setPage("cart")}
              >
                Корзина
              </div>
            </>
          )}
        </div>

        <div className="user-block">

          {currentUser ? (
            <>
              <button
                className="user-name"
                onClick={() => setPage("profile")}
              >
                {currentUser.name}
              </button>

              <button
                className="logout-btn"
                onClick={onLogout}
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              className="user-name"
              onClick={openAuthModal}
            >
              Войти
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

export default Header;