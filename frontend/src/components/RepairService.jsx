import { useState } from "react";
import { apiRequest } from "../api";

const RepairService = ({ currentUser, services = [], onShowPopup }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    city: "Актау",
    problem: "",
  });
  const [error, setError] = useState("");

  const showMessage = (title, message) => {
    if (onShowPopup) {
      onShowPopup(title, message);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentUser) {
      showMessage(
        "Требуется вход",
        "Для отправки заявки необходимо войти в аккаунт."
      );
      return;
    }

    try {
      await apiRequest("/repair-requests/", {
        method: "POST",
        body: JSON.stringify({
          service_id: selectedService.id,
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          problem: formData.problem,
        }),
      });

      showMessage(
        "Заявка отправлена!",
        `Город: ${formData.city}. Мы свяжемся с вами.`
      );

      setSelectedService(null);
      setFormData({
        name: currentUser?.name || "",
        phone: currentUser?.phone || "",
        city: "Актау",
        problem: "",
      });
    } catch (err) {
      console.error(err);
      setError(`Не удалось отправить заявку: ${err.message}`);
    }
  };

  if (selectedService) {
    return (
      <div className="repair-form-page">
        <div className="container">
          <button onClick={() => setSelectedService(null)} className="back-btn">
            Назад к услугам
          </button>

          <div className="repair-form-container">
            <h2>{selectedService.name}</h2>
            <p className="service-price">Цена: {selectedService.price_display}</p>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitRequest}>
              <div className="form-group">
                <label>Ваше имя *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Иванов Иван"
                />
              </div>

              <div className="form-group">
                <label>Телефон *</label>

                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+7 (700) 123-45-67"
                />
              </div>

              <div className="form-group">
                <label>Город *</label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    })
                  }
                >
                  <option value="Актау">Актау</option>
                  <option value="Атырау">Атырау</option>
                </select>
              </div>

              <div className="form-group">
                <label>Описание проблемы</label>
                <textarea
                  rows="3"
                  value={formData.problem}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      problem: e.target.value,
                    })
                  }
                  placeholder="Опишите неисправность"
                />
              </div>

              <button type="submit" className="submit-repair-btn">
                Отправить заявку
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="repair-service">
      <div className="container">
        <h2>Ремонт гидроцилиндров</h2>
        <p className="repair-subtitle">
          Профессиональный ремонт с гарантией 12 месяцев
        </p>

        <div className="cities-block">
          <div className="cities-title">Работаем в городах:</div>
          <div className="cities-tags">
            <span className="city-tag">Актау</span>
            <span className="city-tag">Атырау</span>
          </div>
        </div>

        <div className="repair-grid">
          {services.length === 0 ? (
            <p>Услуги ремонта пока не добавлены</p>
          ) : (
            services.map((service) => (
              <div className="repair-card" key={service.id}>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="repair-price">{service.price_display}</div>
                <div className="repair-time">{service.turnaround}</div>
                <button
                  className="repair-order-btn"
                  onClick={() => setSelectedService(service)}
                >
                  Заказать ремонт
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default RepairService;
