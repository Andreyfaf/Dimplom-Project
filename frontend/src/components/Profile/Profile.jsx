import React, { useEffect, useState } from "react";

import "./Profile.css";

const Profile = ({ currentUser }) => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    if (!currentUser) return;

    const savedOrders = JSON.parse(
      localStorage.getItem(`orders_${currentUser.id}`) || "[]"
    );

    setOrders(savedOrders);

  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Вы не авторизованы</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        <h1 className="profile-title">
          Личный кабинет
        </h1>

        <div className="profile-card">

          <h2>Информация о пользователе</h2>

          <div className="profile-info">
            <p>
              <strong>Имя:</strong> {currentUser.name}
            </p>

            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
          </div>

        </div>

        <div className="profile-card">

          <h2>История заказов</h2>

          {orders.length === 0 ? (

            <p className="no-orders">
              У вас пока нет заказов
            </p>

          ) : (

            <div className="orders-list">

              {orders.map((order) => (

                <div
                  key={order.id}
                  className="order-card"
                >

                  <div className="order-header">

                    <h3>
                      Заказ №{order.id}
                    </h3>

                    <span className="order-status">
                      {order.status}
                    </span>

                  </div>

                  <p className="order-date">
                    {order.date}
                  </p>

                  <div className="order-products">

                    {order.items.map((item, index) => (

                      <div
                        key={index}
                        className="order-product"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                        />

                        <div>
                          <h4>{item.name}</h4>

                          <p>
                            {item.price_display}
                          </p>
                        </div>

                      </div>

                    ))}

                  </div>

                  <div className="order-total">
                    Итого: {order.total.toLocaleString()} ₽
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;