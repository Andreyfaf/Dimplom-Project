import React from "react";
import Catalog from "./Catalog/Catalog";

const CatalogPage = ({
  products,
  currentUser,
  onProductClick,
  onAddToCart
}) => {

  return (
    <div className="catalog-page">

      <div className="container">

        <h1 className="catalog-page-title">
          Каталог гидроцилиндров
        </h1>

        <p className="catalog-page-subtitle">
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
