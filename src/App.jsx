import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div>
      <Header />
      <Hero />
      <Catalog />
      <Contacts />
      <Footer />
    </div>
  );
}

export default App;