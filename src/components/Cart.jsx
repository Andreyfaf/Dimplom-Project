import { useState, useEffect } from "react";

const Cart = ({ currentUser }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`cart_${currentUser.id}`);
      if (saved) setCartItems(JSON.parse(saved));
    } else {
      const saved = localStorage.getItem("cart_guest");
      if (saved) setCartItems(JSON.parse(saved));
    }
  }, [currentUser]);

  const removeItem = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    if (currentUser) {
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(newCart));
    } else {
      localStorage.setItem("cart_guest", JSON.stringify(newCart));
    }
    setCartItems(newCart);
  };

  const clearCart = () => {
    if (currentUser) {
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify([]));
    } else {
      localStorage.setItem("cart_guest", JSON.stringify([]));
    }
    setCartItems([]);
  };

  const totalSum = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ""));
    return sum + price;
  }, 0);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    
    const order = {
      id: Date.now(),
      userId: currentUser?.id,
      items: cartItems,
      total: totalSum,
      ...orderData,
      date: new Date().toLocaleString(),
      status: "новый"
    };
    
    // Сохраняем заказ
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser?.id || "guest"}`) || "[]");
    orders.push(order);
    localStorage.setItem(`orders_${currentUser?.id || "guest"}`, JSON.stringify(orders));
    
    // Очищаем корзину
    clearCart();
    setShowOrderForm(false);
    setOrderData({ name: "", phone: "", address: "" });
    
    alert(`Заказ оформлен!\nСумма: ${totalSum} ₽\nНомер заказа: ${order.id}`);
  };

  if (showOrderForm) {
    return (
      <div style={{ padding: "50px 0" }}>
        <div className="container">
          <h2>Оформление заказа</h2>
          <form onSubmit={handleOrderSubmit} className="order-form">
            <div className="form-group">
              <label>Ваше имя *</label>
              <input
                type="text"
                required
                value={orderData.name}
                onChange={(e) => setOrderData({...orderData, name: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Телефон *</label>
              <input
                type="tel"
                required
                value={orderData.phone}
                onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Адрес доставки</label>
              <input
                type="text"
                value={orderData.address}
                onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                placeholder="Самовывоз - оставьте пустым"
              />
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
        
        {!currentUser && cartItems.length > 0 && (
          <div className="warning-message">
            ⚠️ Войдите в аккаунт, чтобы оформить заказ
          </div>
        )}
        
        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                </div>
                <button onClick={() => removeItem(index)} className="remove-btn">
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
                  disabled={!currentUser}
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          </>
        )}
        
        {/* История заказов */}
        {currentUser && (
          <OrderHistory userId={currentUser.id} />
        )}
      </div>
    </div>
  );
};

// Компонент истории заказов
const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem(`orders_${userId}`);
    if (saved) setOrders(JSON.parse(saved));
  }, [userId]);
  
  if (orders.length === 0) return null;
  
  return (
    <div className="order-history">
      <h2>Мои заказы</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <div>
            <strong>Заказ №{order.id}</strong>
            <p>{order.date}</p>
            <p>Товаров: {order.items.length} | Сумма: {order.total} ₽</p>
            <p>Статус: {order.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cart;