import React, { useEffect, useState } from "react";
import { apiRequest, cleanPriceDisplay } from "../../api";

import "./Profile.css";

const Profile = ({ currentUser }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    apiRequest("/orders/")
      .then((data) => {
        setOrders(data || []);
      })
      .catch((err) => {
        console.error(err);
        setError(`Не удалось загрузить заказы: ${err.message}`);
      });
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

          {error && (
            <p className="no-orders">
              {error}
            </p>
          )}

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
                    {new Date(order.created_at).toLocaleString()}
                  </p>

                  <div className="order-products">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="order-product"
                      >
                        <div>
                          <h4>{item.product_name}</h4>

                          <p>
                            {cleanPriceDisplay(item.price_display)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    Итого: {order.total_amount.toLocaleString()} ₽
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
