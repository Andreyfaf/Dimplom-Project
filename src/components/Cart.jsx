import { useState, useEffect } from "react";

const Cart = ({ currentUser }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  //  ПРОВЕРКА АВТОРИЗАЦИИ В НАЧАЛЕ
  if (!currentUser) {
    return (
      <div style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="container">
          <h2>🔒 Корзина доступна только авторизованным пользователям</h2>
          <p>Войдите или зарегистрируйтесь, чтобы добавлять товары и оформлять заказы</p>
          <button 
            onClick={() => window.location.reload()}
            className="auth-btn"
            style={{ marginTop: "20px", padding: "12px 24px" }}
          >
            Войти / Зарегистрироваться
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    //  ТОЛЬКО ДЛЯ АВТОРИЗОВАННЫХ
    const saved = localStorage.getItem(`cart_${currentUser.id}`);
    if (saved) setCartItems(JSON.parse(saved));
  }, [currentUser]);

  const removeItem = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(newCart));
    setCartItems(newCart);
  };

  const clearCart = () => {
    localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify([]));
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
      userId: currentUser.id,
      items: cartItems,
      total: totalSum,
      ...orderData,
      date: new Date().toLocaleString(),
      status: "новый"
    };
    
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || "[]");
    orders.push(order);
    localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));
    
    clearCart();
    setShowOrderForm(false);
    setOrderData({ name: "", phone: "", address: "" });
    
    // ✅ alert вместо console.log
    alert(`✅ Заказ оформлен!\n📦 Сумма: ${totalSum} ₽\n🔢 Номер заказа: ${order.id}`);
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
                >
                  Оформить заказ
                </button>
              </div>
            </div>
          </>
        )}
        
        <OrderHistory userId={currentUser.id} />
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
      <h2>📋 Мои заказы</h2>
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