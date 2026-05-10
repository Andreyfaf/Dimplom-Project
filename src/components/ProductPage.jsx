import { useState } from "react";

const ProductPage = ({ product, onAddToCart, onBack, currentUser }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!product) return null;

  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));

  const recommendations = {
    1: {
      purpose: "Используется для подъема и перемещения тяжелых грузов на экскаваторах",
      tips: "Рекомендуется проводить техническое обслуживание каждые 500 часов работы",
      warranty: "Гарантия 12 месяцев",
      care: "Хранить при температуре от -20°C до +40°C"
    },
    2: {
      purpose: "Применяется в гидравлических прессах для обработки металла",
      tips: "Регулярно проверяйте состояние уплотнительных колец",
      warranty: "Гарантия 18 месяцев",
      care: "Избегайте попадания грязи на шток"
    },
    3: {
      purpose: "Комплектующие для ремонта гидроцилиндров различных моделей",
      tips: "Перед покупкой сверьтесь с каталогом совместимости",
      warranty: "Гарантия 6 месяцев",
      care: "Хранить в сухом месте"
    },
    4: {
      purpose: "Для герметизации гидроцилиндров разных моделей",
      tips: "Рекомендуется менять при каждом ремонте",
      warranty: "Гарантия 3 месяца",
      care: "Беречь от прямых солнечных лучей"
    }
  };

  const rec = recommendations[product.id] || recommendations[1];

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
              Добавлен в каталог: {createdDate.toLocaleDateString('ru-RU')}
            </div>

            <div className="product-page-price">{product.price}</div>

            <div className="product-purpose">
              <h3>Для чего нужен:</h3>
              <p>{rec.purpose}</p>
            </div>

            <div className="product-description">
              <h3>Описание:</h3>
              <p>
                {showFullDescription 
                  ? `${product.description} ${rec.tips} ${rec.care}` 
                  : `${product.description}...`}
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
                <li>{rec.tips}</li>
                <li>{rec.warranty}</li>
                <li>{rec.care}</li>
              </ul>
            </div>

            <button 
              className="add-to-cart-page-btn"
              onClick={() => onAddToCart(product)}
            >
              Добавить в корзину - {product.price}
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
                <td>{product.name}</td>
              </tr>
              <tr>
                <td>Тип:</td>
                <td>Гидроцилиндр</td>
              </tr>
              <tr>
                <td>Производитель:</td>
                <td>Gidrobas</td>
              </tr>
              <tr>
                <td>Гарантия:</td>
                <td>{rec.warranty}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;