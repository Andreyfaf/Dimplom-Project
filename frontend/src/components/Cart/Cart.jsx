import "./Cart.css";
import { useEffect, useState } from "react";
import { apiRequest, cleanPriceDisplay, getToken } from "../../api";

const Cart = ({ currentUser, openAuthModal, onShowPopup }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    address: "",
  });

  const showMessage = (title, message) => {
    if (onShowPopup) {
      onShowPopup(title, message);
    }
  };

  const loadCart = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    setError("");

    try {
      const items = await apiRequest("/cart/");
      setCartItems(items || []);
    } catch (err) {
      console.error(err);
      setError(`Не удалось загрузить корзину: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="cart-auth-page">
        <div className="container">
          <h2>
            Корзина доступна только авторизованным пользователям
          </h2>

          <p>
            Войдите или зарегистрируйтесь, чтобы оформлять заказы
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

  const removeItem = async (cartItemId) => {
    setError("");

    try {
      await apiRequest(`/cart/items/${cartItemId}/`, {
        method: "DELETE",
      });

      setCartItems((items) =>
        items.filter((item) => item.id !== cartItemId)
      );
    } catch (err) {
      console.error(err);
      setError(`Не удалось удалить товар: ${err.message}`);
    }
  };

  const clearCart = async () => {
    setError("");

    try {
      await apiRequest("/cart/clear/", {
        method: "DELETE",
      });

      setCartItems([]);
    } catch (err) {
      console.error(err);
      setError(`Не удалось очистить корзину: ${err.message}`);
    }
  };

  const totalSum = cartItems.reduce((sum, item) => {
    return sum + (item.line_total || 0);
  }, 0);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!getToken()) {
      const message = "Не удалось отправить заказ: нет токена авторизации. Войдите заново.";
      setError(message);
      showMessage("Требуется вход", message);
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await apiRequest("/orders/", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      setCartItems([]);
      setShowOrderForm(false);

      showMessage(
        "Спасибо за заказ!",
        `Сумма: ${(order.total_amount || totalSum).toLocaleString()} ₽`
      );
    } catch (err) {
      console.error(err);
      const message = err.message || "Не удалось отправить заказ.";
      setError(message);
      showMessage("Ошибка", `Не удалось отправить заказ: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
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
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

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
              <label>Телефон *</label>

              <input
                type="tel"
                required
                value={orderData.phone}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    phone: e.target.value,
                  })
                }
                placeholder="+7 (700) 123-45-67"
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
                onClick={() => setShowOrderForm(false)}
                className="cancel-btn"
              >
                Назад
              </button>

              <button
                type="submit"
                className="submit-order-btn"
                disabled={isSubmitting}
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

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="empty-cart">
            <h2>Загрузка корзины...</h2>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Корзина пуста</h2>
            <p>Добавьте товары в корзину</p>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="cart-item-modern"
                >
                  <div className="cart-item-left">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="cart-item-image"
                    />

                    <div>
                      <h3>{item.product?.name}</h3>

                      <p className="cart-price">
                        {cleanPriceDisplay(item.product?.price_display)}
                      </p>

                      <p>
                        Количество: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-total-modern">
              <h3>
                Итого: {totalSum.toLocaleString()} ₽
              </h3>

              <div className="cart-buttons">
                <button
                  onClick={clearCart}
                  className="clear-btn"
                >
                  Очистить
                </button>

                <button
                  onClick={() => setShowOrderForm(true)}
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
