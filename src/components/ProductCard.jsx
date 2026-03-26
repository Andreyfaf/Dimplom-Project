import React from 'react';

const ProductCard = ({ product, openPopup }) => (
  <div className="product-card">
    <img src={product.img} alt={product.name} />
    <div className="product-info">
      <h3>{product.name}</h3>
      <p>{product.short}</p>
      <p className="price">{product.price}</p>
    </div>
    <button className="btn info-btn" onClick={() => openPopup(product)}>Подробнее</button>
  </div>
);

export default ProductCard;