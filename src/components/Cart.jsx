import { useEffect, useState } from "react";
import { clearCartItems, createOrder, fetchCart, fetchOrders, removeCartItem } from "../lib/api";
import { validateAddress, validateName, validatePhone } from "../lib/validation";

const emptyOrderForm = {
  name: "",
  phone: "",
  address: "",
};

const emptyErrors = {
  name: "",
  phone: "",
  address: "",
};

const Cart = ({ authToken, currentUser, openAuthModal }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState(emptyOrderForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(emptyErrors);

  useEffect(() => {
    if (!currentUser || !authToken) {
      return;
    }

    const loadData = async () => {
      try {
        const [cartData, ordersData] = await Promise.all([
          fetchCart(authToken),
          fetchOrders(authToken),
        ]);
        setCartItems(cartData);
        setOrders(ordersData);
        setError("");
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadData();
  }, [authToken, currentUser]);

  const handleOrderFieldChange = (field, value) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({
      ...prev,
      [field]:
        field === "name"
          ? validateName(value, "Имя")
          : field === "phone"
            ? validatePhone(value)
            : validateAddress(value),
    }));
  };

  const validateOrderForm = () => {
    const nextErrors = {
      name: validateName(orderData.name, "Имя"),
      phone: validatePhone(orderData.phone),
      address: validateAddress(orderData.address),
    };

    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const removeItem = async (id) => {
    try {
      await removeCartItem(authToken, id);
      setCartItems((items) => items.filter((item) => item.id !== id));
    } catch (removeError) {
      setError(removeError.message);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartItems(authToken);
      setCartItems([]);
    } catch (clearError) {
      setError(clearError.message);
    }
  };

  const totalSum = cartItems.reduce((sum, item) => sum + item.line_total, 0);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!validateOrderForm()) {
      return;
    }

    try {
      const order = await createOrder(authToken, {
        name: orderData.name.trim(),
        phone: orderData.phone.trim(),
        address: orderData.address.trim(),
      });
      setOrders((prevOrders) => [order, ...prevOrders]);
      setCartItems([]);
      setShowOrderForm(false);
      setOrderData(emptyOrderForm);
      setFieldErrors(emptyErrors);
      setError("");
      alert(`Заказ оформлен.\nСумма: ${order.total_amount.toLocaleString()} ₽\nНомер заказа: ${order.id}`);
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  if (!currentUser) {
    return (
      <div style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="container">
          <h2>Корзина доступна только авторизованным пользователям</h2>
          <p>Войдите или зарегистрируйтесь, чтобы добавлять товары и оформлять заказы.</p>
          <button
            onClick={openAuthModal}
            className="auth-btn"
            style={{ marginTop: "20px", padding: "12px 24px" }}
          >
            Войти / Зарегистрироваться
          </button>
        </div>
      </div>
    );
  }

  if (showOrderForm) {
    return (
      <div style={{ padding: "50px 0" }}>
        <div className="container">
          <h2>Оформление заказа</h2>
          {error && <p style={{ color: "crimson" }}>{error}</p>}
          <form onSubmit={handleOrderSubmit} className="order-form" noValidate>
            <div className="form-group">
              <label htmlFor="order-name">Ваше имя *</label>
              <input
                id="order-name"
                type="text"
                required
                autoComplete="name"
                minLength={2}
                maxLength={80}
                value={orderData.name}
                onChange={(e) => handleOrderFieldChange("name", e.target.value)}
                aria-invalid={Boolean(fieldErrors.name)}
              />
              {fieldErrors.name && <p style={{ color: "crimson" }}>{fieldErrors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="order-phone">Телефон *</label>
              <input
                id="order-phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                value={orderData.phone}
                onChange={(e) => handleOrderFieldChange("phone", e.target.value)}
                aria-invalid={Boolean(fieldErrors.phone)}
              />
              {fieldErrors.phone && <p style={{ color: "crimson" }}>{fieldErrors.phone}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="order-address">Адрес доставки</label>
              <input
                id="order-address"
                type="text"
                maxLength={255}
                value={orderData.address}
                onChange={(e) => handleOrderFieldChange("address", e.target.value)}
                placeholder="Самовывоз - оставьте пустым"
                aria-invalid={Boolean(fieldErrors.address)}
              />
              {fieldErrors.address && <p style={{ color: "crimson" }}>{fieldErrors.address}</p>}
            </div>

            <div className="cart-buttons">
              <button type="button" onClick={() => setShowOrderForm(false)} className="cancel-btn">
                Назад
              </button>
              <button type="submit" className="submit-order-btn">
                Подтвердить заказ
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "50px 0" }}>
      <div className="container">
        <h1>Корзина ({cartItems.length})</h1>
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <h3>{item.product.name}</h3>
                  <p>{item.product.price_display}</p>
                  <p>Количество: {item.quantity}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="remove-btn">
                  Удалить
                </button>
              </div>
            ))}

            <div className="cart-total">
              <h3>Итого: {totalSum.toLocaleString()} ₽</h3>
              <div className="cart-buttons">
                <button onClick={clearCart} className="clear-btn">
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

        <OrderHistory orders={orders} />
      </div>
    </div>
  );
};

const OrderHistory = ({ orders }) => {
  if (orders.length === 0) return null;

  return (
    <div className="order-history">
      <h2>Мои заказы</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <div>
            <strong>Заказ №{order.id}</strong>
            <p>{new Date(order.created_at).toLocaleString("ru-RU")}</p>
            <p>Товаров: {order.items.length} | Сумма: {order.total_amount.toLocaleString()} ₽</p>
            <p>Статус: {order.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cart;
