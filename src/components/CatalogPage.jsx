import React from "react";
import Catalog from "./Catalog";

const CatalogPage = ({ currentUser, onAddToCart, onProductClick, products }) => {
  return (
    <div style={{ padding: "50px 0" }}>
      <div className="container">
        <h1>Каталог гидроцилиндров</h1>
        <p style={{ marginBottom: "30px", color: "#666" }}>
          Широкий выбор гидроцилиндров для экскаваторов, прессов и спецтехники.
        </p>
        <Catalog
          products={products}
          currentUser={currentUser}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
        />
      </div>
    </div>
  );
};

export default CatalogPage;
