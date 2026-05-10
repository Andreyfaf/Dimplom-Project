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
    fits: "Подходит для: ЭО-2621, ЭО-3322, JCB, Hyundai",
    description: "Ход штока: 1200 мм | Усилие: 25 т",
    price: "25 000 ₽"
  },
  {
    id: 2,
    name: "Гидроцилиндр пресса",
    img: press,
    fits: "Для гидравлических прессов П-125, П-250",
    description: "Ход штока: 800 мм | Усилие: 40 т",
    price: "18 000 ₽"
  },
  {
    id: 3,
    name: "Комплектующие для спецтехники",
    img: complect,
    fits: "Кольца, поршни, втулки - любые размеры",
    description: "Для экскаваторов, погрузчиков, бульдозеров",
    price: "от 5 000 ₽"
  },
  {
    id: 4,
    name: "Манжеты и уплотнения",
    img: cuffs,
    fits: "DN 40-200 мм, все типоразмеры",
    description: "Для гидроцилиндров разных моделей",
    price: "от 500 ₽"
  }
];

const Catalog = ({ currentUser, onProductClick }) => {
  const addToCart = (product, e) => {
    e.stopPropagation();
    
    if (!currentUser) {
      alert("Для добавления в корзину необходимо войти в аккаунт!");
      return;
    }

    const cartKey = `cart_${currentUser.id}`;
    const savedCart = localStorage.getItem(cartKey);
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      addedAt: new Date().toISOString()
    });
    
    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert(`${product.name} добавлен в корзину!`);
  };

  return (
    <div className="products-grid">
      {products.map(product => (
        <div 
          className="product-card" 
          key={product.id}
          onClick={() => onProductClick && onProductClick(product)}
          style={{ cursor: "pointer" }}
        >
          <div className="product-image">
            <img src={product.img} alt={product.name} />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="product-fits">{product.fits}</p>
            <p className="product-description">{product.description}</p>
            <p className="price">{product.price}</p>
            <button 
              className="add-to-cart-btn"
              onClick={(e) => addToCart(product, e)}
            >
              В корзину
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Catalog;