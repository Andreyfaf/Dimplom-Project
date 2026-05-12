import React from "react";

const Catalog = ({ currentUser, onAddToCart, onProductClick, products }) => {
  const addToCart = (product, e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="products-grid">
      {products.map((product) => (
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
            <p className="product-description">{product.short_description}</p>
            <p className="price">{product.price_display}</p>
            <button
              className="add-to-cart-btn"
              onClick={(e) => addToCart(product, e)}
            >
              {currentUser ? "В корзину" : "Войти и купить"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Catalog;
