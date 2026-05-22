import "./Catalog.css";
import React from "react";

const Catalog = ({
  products,
  currentUser,
  onProductClick,
  onAddToCart
}) => {

  const handleAddToCart = (product, e) => {
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  if (!products || products.length === 0) {
    return (
      <div
        className="products-grid"
        style={{
          padding: "50px",
          textAlign: "center"
        }}
      >
        Товаров пока нет
      </div>
    );
  }

  return (
    <div className="products-grid">

      {products.map((product) => (

        <div
          className="product-card"
          key={product.id}
          onClick={() => onProductClick(product)}
          style={{ cursor: "pointer" }}
        >

          {/* IMAGE */}
          <div className="product-image">

            {product.image ? (

              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.target.style.display = "none";

                  e.target.parentElement.innerHTML =
                    "<span style='color:#999'>Нет фото</span>";
                }}
              />

            ) : (

              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                }}
              >
                Нет фото
              </div>

            )}

          </div>

          {/* CONTENT */}
          <div className="product-content">

            <h3>{product.name}</h3>

            <p className="product-description">
              {product.short_description}
            </p>

            <div className="price">
              {product.price_display}
            </div>

            <button
              className="add-to-cart-btn"
              onClick={(e) =>
                handleAddToCart(product, e)
              }
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