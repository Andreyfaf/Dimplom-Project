import React from "react";
import cilender from "../assets/cilender-escalator.jpg";
import press from "../assets/gidrocilindr_press.jpg";
import complect from "../assets/complect-manjet.jpg";
import cuffs from "../assets/cuffs.jpg";

const products = [
  {
    id: 1,
    name: "Гидроцилиндр экскаватора",
    img: cilender,
    description: "Ход штока: 1200 мм",
    price: "25 000 ₽"
  },
  {
    id: 2,
    name: "Гидроцилиндр пресса",
    img: press,
    description: "Ход штока: 800 мм",
    price: "18 000 ₽"
  },
  {
    id: 3,
    name: "Комплектующие",
    img: complect,
    description: "Разные детали для гидроцилиндров",
    price: "от 5 000 ₽"
  },
  {
    id: 4,
    name: "Манжеты и уплотнения",
    img: cuffs,
    description: "Для гидроцилиндров разных моделей",
    price: "от 500 ₽"
  }
];

const Catalog = () => {
  return (
    <section id="catalog" className="catalog">
      <div className="container">
        <h2>Популярные гидроцилиндры</h2>
        <div className="products-grid">
          {products.map(product => (
            <div className="product-card" key={product.id}>
              <img src={product.img} alt={product.name} />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catalog;