import React, { useState, useEffect } from "react";
import Profile from "./components/Profile/Profile";
import Header from "./components/Header/Header";
import Hero from "./components/Hero";
import CatalogPage from "./components/CatalogPage";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer/Footer";
import Cart from "./components/Cart/Cart";
import AuthModal from "./components/AuthModal/AuthModal";
import ProductPage from "./components/ProductPage/ProductPage";
import RepairService from "./components/RepairService";

import "./App.css";

const API_URL = "/api";

function App() {
  const [page, setPage] = useState("home");

  const [currentUser, setCurrentUser] = useState(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([]);

  const [contactInfo, setContactInfo] = useState(null);

  const [repairServices, setRepairServices] = useState([]);

  const [team, setTeam] = useState([]);

  // =========================
// Загрузка пользователя
// =========================

useEffect(() => {

  const savedUser = localStorage.getItem("currentUser");

  if (
    savedUser &&
    savedUser !== "undefined" &&
    savedUser !== "null"
  ) {
    try {
      setCurrentUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Ошибка чтения currentUser:", error);

      localStorage.removeItem("currentUser");
    }
  }

}, []);
  // =========================
  // Загрузка данных из Django
  // =========================

  useEffect(() => {
    fetch(`${API_URL}/bootstrap/`)
      .then((res) => res.json())
      .then((data) => {
        console.log("BOOTSTRAP:", data);

        setProducts(data.products || []);

        setContactInfo(data.contact_info || null);

        setRepairServices(data.repair_services || []);

        setTeam(data.team || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки API:", err);
      });
  }, []);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (data) => {
    setCurrentUser(data.user);

    localStorage.setItem(
      "currentUser",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "token",
      data.token
    );

    closeAuthModal();
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("currentUser");

    localStorage.removeItem("token");

    setCurrentUser(null);

    setPage("home");
  };

  // =========================
  // AUTH MODAL
  // =========================

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // =========================
  // PRODUCT PAGE
  // =========================

  const handleProductClick = (product) => {
    setSelectedProduct(product);

    setPage("product");
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);

    setPage("catalog");
  };

  // =========================
  // ADD TO CART
  // =========================

const addToCart = (product) => {

  if (!currentUser) {
    alert("Для добавления в корзину необходимо войти!");

    openAuthModal();

    return;
  }

  const cartKey = `cart_${currentUser.id}`;

  const existingCart = JSON.parse(
    localStorage.getItem(cartKey) || "[]"
  );

  existingCart.push(product);

  localStorage.setItem(
    cartKey,
    JSON.stringify(existingCart)
  );

  alert(`${product.name} добавлен в корзину!`);
};

  return (
    <div>
      <Header
        setPage={setPage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        openAuthModal={openAuthModal}
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onLogin={handleLogin}
      />

      {/* HOME */}

      {page === "home" && (
        <>
          <Hero setPage={setPage} />

          <Contacts
            contactInfo={contactInfo}
            team={team}
          />
        </>
      )}

      {/* CATALOG */}

      {page === "catalog" && (
        <CatalogPage
          products={products}
          currentUser={currentUser}
          onProductClick={handleProductClick}
          onAddToCart={addToCart}
/>
      )}

      {/* PRODUCT */}

      {page === "product" && (
        <ProductPage
          product={selectedProduct}
          onAddToCart={addToCart}
          onBack={handleBackToCatalog}
          currentUser={currentUser}
        />
      )}

      {/* REPAIR */}

      {page === "repair" && (
        <RepairService
          currentUser={currentUser}
          services={repairServices}
        />
      )}

      {page === "cart" && (
        <Cart
          currentUser={currentUser}
          openAuthModal={openAuthModal}
        />
      )}

      {page === "profile" && (
        <Profile
          currentUser={currentUser}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;