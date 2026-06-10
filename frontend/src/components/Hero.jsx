import React from "react";
import workProcess from "../assets/work-process.jpg";

const Hero = ({ setPage }) => {
  const goToCatalog = () => {
    setPage("catalog");
  };

  return (
    <section className="hero" style={{ backgroundImage: `url(${workProcess})` }}>
      <div className="hero-text">
        <h2>Продажа и ремонт гидроцилиндров</h2>
        <p>Быстро, надёжно, с гарантией!</p>
        <button onClick={goToCatalog} className="btn-primary">
          Смотреть каталог
        </button>
      </div>
    </section>
  );
};

export default Hero;
