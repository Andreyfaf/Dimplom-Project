import { useState } from "react";

const ProductPage = ({ product, onAddToCart, onBack, currentUser }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!product) return null;

  return (
    <div className="product-page">
      <div className="container">
        <button onClick={onBack} className="back-btn">
          Назад к каталогу
        </button>

        <div className="product-page-content">
          <div className="product-page-image">
            <img src={product.img} alt={product.name} />
          </div>

          <div className="product-page-info">
            <h1>{product.name}</h1>

            <div className="product-date">
              Добавлен в каталог: {new Date(product.created_at).toLocaleDateString("ru-RU")}
            </div>

            <div className="product-page-price">{product.price_display}</div>

            <div className="product-purpose">
              <h3>Для чего нужен:</h3>
              <p>{product.purpose}</p>
            </div>

            <div className="product-description">
              <h3>Описание:</h3>
              <p>
                {showFullDescription
                  ? `${product.short_description} ${product.tips} ${product.care}`
                  : `${product.short_description}...`}
              </p>
              <button
                className="read-more-btn"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Свернуть" : "Читать полностью"}
              </button>
            </div>

            <div className="product-recommendations">
              <h3>Рекомендации:</h3>
              <ul>
                <li>{product.tips}</li>
                <li>{product.warranty}</li>
                <li>{product.care}</li>
              </ul>
            </div>

            <button
              className="add-to-cart-page-btn"
              onClick={() => onAddToCart(product)}
            >
              Добавить в корзину - {product.price_display}
            </button>

            {!currentUser && (
              <p className="login-hint">
                Войдите в аккаунт, чтобы добавить товар в корзину
              </p>
            )}
          </div>
        </div>

        <div className="product-specs">
          <h3>Технические характеристики:</h3>
          <table className="specs-table">
            <tbody>
              <tr>
                <td>Модель:</td>
                <td>{product.model_name || product.name}</td>
              </tr>
              <tr>
                <td>Тип:</td>
                <td>{product.product_type}</td>
              </tr>
              <tr>
                <td>Производитель:</td>
                <td>{product.manufacturer}</td>
              </tr>
              <tr>
                <td>Гарантия:</td>
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
