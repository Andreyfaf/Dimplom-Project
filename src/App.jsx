import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import CatalogPage from "./components/CatalogPage";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import AuthModal from "./components/AuthModal";
import ProductPage from "./components/ProductPage";
import RepairService from "./components/RepairService";

import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setPage("product");
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
    setPage("catalog");
  };

  const addToCart = (product) => {
    if (!currentUser) {
      alert("⚠️ Для добавления в корзину необходимо войти в аккаунт!");
      openAuthModal();
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
    alert(`✓ ${product.name} добавлен в корзину!`);
  };

  return (
    <div>
      <Header 
        setPage={setPage} 
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        openAuthModal={openAuthModal}
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onLogin={handleLogin}
      />
      
      {/* ГЛАВНАЯ СТРАНИЦА (без каталога) */}
      {page === "home" && (
        <>
          <Hero setPage={setPage} />  {/* ← ИЗМЕНЕНО: передаём setPage */}
          <Contacts />
        </>
      )}

      {/* СТРАНИЦА КАТАЛОГА */}
      {page === "catalog" && (
        <CatalogPage 
          currentUser={currentUser}
          onProductClick={handleProductClick}
        />
      )}

      {/* СТРАНИЦА ТОВАРА */}
      {page === "product" && (
        <ProductPage 
          product={selectedProduct}
          onAddToCart={addToCart}
          onBack={handleBackToCatalog}
          currentUser={currentUser}
        />
      )}

      {/* СТРАНИЦА РЕМОНТА */}
      {page === "repair" && (
        <RepairService currentUser={currentUser} />
      )}

      {/* СТРАНИЦА КОРЗИНЫ */}
      {page === "cart" && (
        <Cart 
          currentUser={currentUser} 
          openAuthModal={openAuthModal}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;