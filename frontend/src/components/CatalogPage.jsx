import React from "react";
import Catalog from "./Catalog/Catalog";

const CatalogPage = ({
  products,
  currentUser,
  onProductClick,
  onAddToCart
}) => {

  return (
    <div
      style={{
        padding: "70px 0",
      }}
    >

      <div className="container">

        <h1
          style={{
            marginBottom: "10px",
            marginLeft: "40px",
            fontSize: "52px",
            color: "#1e2b3a",
          }}
        >
          Каталог гидроцилиндров
        </h1>

        <p
          style={{
            marginBottom: "50px",
            marginLeft: "40px",
            color: "#666",
            fontSize: "22px",
          }}
        >
          Широкий выбор гидроцилиндров
          для экскаваторов,
          прессов и спецтехники
        </p>

        <Catalog
          products={products}
          currentUser={currentUser}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
        />

      </div>

    </div>
  );
};

export default CatalogPage;