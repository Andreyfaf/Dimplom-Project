import "./Cart.css";
import { useState, useEffect } from "react";

const Cart = ({ currentUser, openAuthModal }) => {

  const [cartItems, setCartItems] = useState([]);

  const [showOrderForm, setShowOrderForm] = useState(false);

  const [orderData, setOrderData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    address: "",
  });

  useEffect(() => {

    if (currentUser) {

      const saved = localStorage.getItem(
        `cart_${currentUser.id}`
      );

      if (saved) {
        setCartItems(JSON.parse(saved));
      }

    }

  }, [currentUser]);

  if (!currentUser) {

    return (
      <div className="cart-auth-page">

        <div className="container">

          <h2>
            Корзина доступна только
            авторизованным пользователям
          </h2>

          <p>
            Войдите или зарегистрируйтесь,
            чтобы оформлять заказы
          </p>

          <button
            onClick={openAuthModal}
            className="auth-btn"
          >
            Войти / Зарегистрироваться
          </button>

        </div>

      </div>
    );

  }

  const removeItem = (index) => {

    const newCart = [...cartItems];

    newCart.splice(index, 1);

    localStorage.setItem(
      `cart_${currentUser.id}`,
      JSON.stringify(newCart)
    );

    setCartItems(newCart);

  };

  const clearCart = () => {

    localStorage.setItem(
      `cart_${currentUser.id}`,
      JSON.stringify([])
    );

    setCartItems([]);

  };

  const totalSum = cartItems.reduce((sum, item) => {

    const price = parseInt(
      (item.price_display || "0")
      .replace(/[^\d]/g, "")
    );

    return sum + price;

  }, 0);

  const handleOrderSubmit = (e) => {

    e.preventDefault();

    const order = {
      id: Date.now(),
      userId: currentUser.id,
      items: cartItems,
      total: totalSum,
      ...orderData,
      date: new Date().toLocaleString(),
      status: "новый",
    };

    const orders = JSON.parse(
      localStorage.getItem(
        `orders_${currentUser.id}`
      ) || "[]"
    );

    orders.push(order);

    localStorage.setItem(
      `orders_${currentUser.id}`,
      JSON.stringify(orders)
    );

    clearCart();

    setShowOrderForm(false);

    alert(
      `Заказ оформлен!\nСумма: ${totalSum} ₽`
    );

  };

  if (showOrderForm) {

    return (
      <div className="cart-page">

        <div className="container">

          <h1 className="cart-title">
            Оформление заказа
          </h1>

          <form
            onSubmit={handleOrderSubmit}
            className="order-form-modern"
          >

            <div className="form-group">

              <label>Ваше имя *</label>

              <input
                type="text"
                required
                value={orderData.name}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    name: e.target.value,
                  })
                }
              />

            </div>

            <div className="form-group">

              <label>Email *</label>

              <input
                type="email"
                required
                value={orderData.email}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    email: e.target.value,
                  })
                }
              />

            </div>

            <div className="form-group">

              <label>Адрес доставки</label>

              <input
                type="text"
                value={orderData.address}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    address: e.target.value,
                  })
                }
                placeholder="Самовывоз — оставьте пустым"
              />

            </div>

            <div className="cart-buttons">

              <button
                type="button"
                onClick={() =>
                  setShowOrderForm(false)
                }
                className="cancel-btn"
              >
                Назад
              </button>

              <button
                type="submit"
                className="submit-order-btn"
              >
                Подтвердить заказ
              </button>

            </div>

          </form>

        </div>

      </div>
    );

  }

  return (
    <div className="cart-page">

      <div className="container">

        <h1 className="cart-title">
          Корзина ({cartItems.length})
        </h1>

        {cartItems.length === 0 ? (

          <div className="empty-cart">

            <h2>Корзина пуста</h2>

            <p>
              Добавьте товары в корзину
            </p>

          </div>

        ) : (

          <>

            <div className="cart-list">

              {cartItems.map((item, index) => (

                <div
                  key={index}
                  className="cart-item-modern"
                >

                  <div className="cart-item-left">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />

                    <div>

                      <h3>{item.name}</h3>

                      <p className="cart-price">
                        {item.price_display}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      removeItem(index)
                    }
                    className="remove-btn"
                  >
                    Удалить
                  </button>

                </div>

              ))}

            </div>

            <div className="cart-total-modern">

              <h3>
                Итого:
                {" "}
                {totalSum.toLocaleString()} ₽
              </h3>

              <div className="cart-buttons">

                <button
                  onClick={clearCart}
                  className="clear-btn"
                >
                  Очистить
                </button>

                <button
                  onClick={() =>
                    setShowOrderForm(true)
                  }
                  className="order-btn"
                >
                  Оформить заказ
                </button>

              </div>

            </div>

          </>

        )}

      </div>

    </div>
  );

};

export default Cart;