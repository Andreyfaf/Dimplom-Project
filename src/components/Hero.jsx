import React from "react";
import workProcess from "../assets/work-process.jpg";

const Hero = () => {
  return (
    <section className="hero" style={{ backgroundImage: `url(${workProcess})` }}>
      <div className="hero-text">
        <h2>Продажа и ремонт гидроцилиндров</h2>
        <p>Быстро, надёжно, с гарантией!</p>
        <a href="#catalog" className="btn-primary">Смотреть каталог</a>
      </div>
    </section>
  );
};

export default Hero;