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
import { API_URL, apiRequest } from "./api";

import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [repairServices, setRepairServices] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedToken = localStorage.getItem("token");
    const hasToken =
      savedToken &&
      savedToken !== "undefined" &&
      savedToken !== "null";

    if (
      savedUser &&
      savedUser !== "undefined" &&
      savedUser !== "null"
    ) {
      if (!hasToken) {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        setIsAuthModalOpen(true);
        return;
      }

      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Ошибка чтения currentUser:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/bootstrap/`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setContactInfo(data.contact_info || null);
        setRepairServices(data.repair_services || []);
        setTeam(data.team || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки API:", err);
      });
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setCurrentUser(null);
    setPage("home");
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

  const addToCart = async (product) => {
    if (!currentUser) {
      alert("Для добавления в корзину необходимо войти!");
      openAuthModal();
      return;
    }

    try {
      await apiRequest("/cart/items/", {
        method: "POST",
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      alert(`${product.name} добавлен в корзину!`);
    } catch (err) {
      console.error(err);
      alert(`Не удалось добавить товар: ${err.message}`);
    }
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

      {page === "home" && (
        <>
          <Hero setPage={setPage} />

          <Contacts
            contactInfo={contactInfo}
            team={team}
          />
        </>
      )}

      {page === "catalog" && (
        <CatalogPage
          products={products}
          currentUser={currentUser}
          onProductClick={handleProductClick}
          onAddToCart={addToCart}
        />
      )}

      {page === "product" && (
        <ProductPage
          product={selectedProduct}
          onAddToCart={addToCart}
          onBack={handleBackToCatalog}
          currentUser={currentUser}
        />
      )}

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
