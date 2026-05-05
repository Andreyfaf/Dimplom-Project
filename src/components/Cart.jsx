import { useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <div style={{ padding: "50px" }}>
      <h1>Корзина</h1>

      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index}>
            <h3>{item.name}</h3>
            <p>{item.price}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;