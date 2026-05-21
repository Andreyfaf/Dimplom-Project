import React from "react";
import "./ProductPage.css";

const ProductPage = ({ product, onAddToCart, onBack, currentUser }) => {
  if (!product) return null;

  return (
    <div className="product-page">
      <div className="container">

        <button onClick={onBack} className="back-btn">
          ← Назад в каталог
        </button>

        <div className="product-card-page">

          <div className="product-image-block">
            <img
              src={product.image}
              alt={product.name}
              className="product-main-image"
            />
          </div>

          <div className="product-info-block">

            <h1>{product.name}</h1>

            <div className="product-date">
              Добавлен:{" "}
              {new Date(product.created_at).toLocaleDateString("ru-RU")}
            </div>

            <div className="product-price">
              {product.price_display}
            </div>

            <div className="product-section">
              <h3>Назначение</h3>
              <p>{product.purpose}</p>
            </div>

            <div className="product-description">
                <h3>Описание</h3>

                <p>
                  {product.short_description}
                </p>
              </div>

            <div className="product-section">
                <h3>Рекомендации</h3>

                <ul>
                  {product.tips && <li>{product.tips}</li>}
                  {product.warranty && <li>{product.warranty}</li>}
                  {product.care && <li>{product.care}</li>}
                </ul>
              </div>

            <button
              className="add-cart-btn-big"
              onClick={() => onAddToCart(product)}
            >
              Добавить в корзину — {product.price_display}
            </button>

            {!currentUser && (
              <p className="login-warning">
                Войдите в аккаунт для оформления заказа
              </p>
            )}

          </div>
        </div>

        <div className="specs-block">

          <h2>Технические характеристики</h2>

          <table className="specs-table">
            <tbody>

              <tr>
                <td>Модель</td>
                <td>{product.model_name}</td>
              </tr>

              <tr>
                <td>Тип</td>
                <td>{product.product_type}</td>
              </tr>

              <tr>
                <td>Производитель</td>
                <td>{product.manufacturer}</td>
              </tr>

              <tr>
                <td>Совместимость</td>
                <td>{product.fits}</td>
              </tr>

              <tr>
                <td>Гарантия</td>
                <td>{product.warranty}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;