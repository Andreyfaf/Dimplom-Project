import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import Cart from "./components/Cart";

import "./App.css";

function App() {
 const [page, setPage] = useState("home");

  return (
    <div>
      {/* Шапка */}
      <Header setPage={setPage} />

      {/* Главная страница */}
      {page === "home" && (
        <>
          <Hero />
          <Catalog />
          <Contacts />
        </>
      )}

      {/* Корзина */}
      {page === "cart" && <Cart />}

      {/* Подвал */}
      <Footer />
    </div>
  );
}

export default App;