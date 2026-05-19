import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CatalogPage from "./components/CatalogPage";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import AuthModal from "./components/AuthModal";
import ProductPage from "./components/ProductPage";
import RepairService from "./components/RepairService";
import { addCartItem, fetchBootstrap, fetchProfile, logoutUser } from "./lib/api";
import { resolveProductImage } from "./lib/productMedia";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bootstrapData, setBootstrapData] = useState({
    contactInfo: null,
    team: [],
    products: [],
    repairServices: [],
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [bootstrapError, setBootstrapError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBootstrapData = async () => {
      try {
        const data = await fetchBootstrap();
        if (!isMounted) {
          return;
        }

        setBootstrapData({
          contactInfo: data.contact_info,
          team: data.team,
          products: data.products.map((product) => ({
            ...product,
            img: resolveProductImage(product.image_key),
          })),
          repairServices: data.repair_services,
        });
      } catch (error) {
        if (isMounted) {
          setBootstrapError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    loadBootstrapData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("currentUser");

    if (!savedToken) {
      if (savedUser) {
        localStorage.removeItem("currentUser");
      }
      return;
    }

    setAuthToken(savedToken);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    fetchProfile(savedToken)
      .then((user) => {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        setAuthToken("");
        setCurrentUser(null);
      });
  }, []);

  const handleLogin = ({ user, token }) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = async () => {
    const activeToken = authToken || localStorage.getItem("authToken");
    if (activeToken) {
      await logoutUser(activeToken).catch(() => null);
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setAuthToken("");
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
      alert("Для добавления в корзину необходимо войти в аккаунт.");
      openAuthModal();
      return;
    }

    try {
      await addCartItem(authToken, product.id, 1);
      alert(`${product.name} добавлен в корзину.`);
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoadingData) {
    return <div className="container" style={{ padding: "80px 0" }}>Загрузка данных...</div>;
  }

  if (bootstrapError) {
    return <div className="container" style={{ padding: "80px 0" }}>Ошибка API: {bootstrapError}</div>;
  }

  return (
    <div>
      <Header
        setPage={setPage}
        currentUser={currentUser}
        onLogout={handleLogout}
        openAuthModal={openAuthModal}
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
            contactInfo={bootstrapData.contactInfo}
            team={bootstrapData.team}
          />
        </>
      )}

      {page === "catalog" && (
        <CatalogPage
          products={bootstrapData.products}
          currentUser={currentUser}
          onAddToCart={addToCart}
          onProductClick={handleProductClick}
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
          authToken={authToken}
          currentUser={currentUser}
          openAuthModal={openAuthModal}
          repairServices={bootstrapData.repairServices}
        />
      )}

      {page === "cart" && (
        <Cart
          authToken={authToken}
          currentUser={currentUser}
          openAuthModal={openAuthModal}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
