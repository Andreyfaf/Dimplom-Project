import React from "react";
import emblem from "../assets/emblem.jpg";

const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">

        {/* Левая часть: логотип + название */}
        <div className="header-left">
          <img src={emblem} alt="Логотип" className="emblem" />
          <h1>Gidrobas</h1>
        </div>

        {/* Правая часть: навигация */}
        <nav>
          <a href="#catalog">Каталог</a>
          <a href="#contacts">Контакты</a>
        </nav>

      </div>
    </header>
  );
};

export default Header;