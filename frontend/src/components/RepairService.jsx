import { useState } from "react";
import { createRepairRequest } from "../lib/api";
import { validateName, validatePhone, validateProblemDescription } from "../lib/validation";

const emptyRepairForm = {
  name: "",
  phone: "",
  city: "Актау",
  problem: "",
};

const emptyErrors = {
  name: "",
  phone: "",
  problem: "",
};

const RepairService = ({ authToken, currentUser, openAuthModal, repairServices }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState(emptyRepairForm);
  const [fieldErrors, setFieldErrors] = useState(emptyErrors);

  const validateForm = () => {
    const nextErrors = {
      name: validateName(formData.name, "Имя"),
      phone: validatePhone(formData.phone),
      problem: validateProblemDescription(formData.problem),
    };

    setFieldErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleChange = (field, value) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);
    setFieldErrors((prev) => ({
      ...prev,
      [field]:
        field === "name"
          ? validateName(value, "Имя")
          : field === "phone"
            ? validatePhone(value)
            : field === "problem"
              ? validateProblemDescription(value)
              : "",
    }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Для отправки заявки необходимо войти в аккаунт.");
      openAuthModal();
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      await createRepairRequest(authToken, {
        service_id: selectedService.id,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        city: formData.city,
        problem: formData.problem.trim(),
      });
      alert(`Заявка отправлена.\nГород: ${formData.city}\nМы свяжемся с вами.`);
      setSelectedService(null);
      setFormData(emptyRepairForm);
      setFieldErrors(emptyErrors);
    } catch (error) {
      alert(error.message);
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

            <form onSubmit={handleSubmitRequest} noValidate>
              <div className="form-group">
                <label htmlFor="repair-name">Ваше имя *</label>
                <input
                  id="repair-name"
                  type="text"
                  required
                  autoComplete="name"
                  minLength={2}
                  maxLength={80}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Иванов Иван"
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && <p style={{ color: "crimson" }}>{fieldErrors.name}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="repair-phone">Телефон *</label>
                <input
                  id="repair-phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+7 (700) 123-45-67"
                  aria-invalid={Boolean(fieldErrors.phone)}
                />
                {fieldErrors.phone && <p style={{ color: "crimson" }}>{fieldErrors.phone}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="repair-city">Город *</label>
                <select
                  id="repair-city"
                  required
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                >
                  <option value="Актау">Актау</option>
                  <option value="Атырау">Атырау</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="repair-problem">Описание проблемы</label>
                <textarea
                  id="repair-problem"
                  rows="3"
                  maxLength={500}
                  value={formData.problem}
                  onChange={(e) => handleChange("problem", e.target.value)}
                  placeholder="Опишите неисправность"
                  aria-invalid={Boolean(fieldErrors.problem)}
                />
                {fieldErrors.problem && <p style={{ color: "crimson" }}>{fieldErrors.problem}</p>}
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
        <p className="repair-subtitle">Профессиональный ремонт с гарантией 12 месяцев</p>

        <div className="cities-block">
          <div className="cities-title">Работаем в городах:</div>
          <div className="cities-tags">
            <span className="city-tag">Актау</span>
            <span className="city-tag">Атырау</span>
          </div>
        </div>

        <div className="repair-grid">
          {repairServices.map((service) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default RepairService;
