import { useState } from "react";

const RepairService = ({ currentUser }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "Актау",
    problem: ""
  });

  const repairServices = [
    {
      id: 1,
      name: "Диагностика",
      description: "Полная проверка гидроцилиндра, выявление неисправностей",
      price: "1 500 ₽",
      time: "1-2 дня",
      popular: true
    },
    {
      id: 2,
      name: "Замена уплотнений",
      description: "Замена манжет, колец и всех уплотнителей",
      price: "3 000 ₽",
      time: "2-3 дня",
      popular: false
    },
    {
      id: 3,
      name: "Ремонт штока",
      description: "Восстановление хромированного покрытия, шлифовка",
      price: "от 5 000 ₽",
      time: "3-5 дней",
      popular: true
    },
    {
      id: 4,
      name: "Капитальный ремонт",
      description: "Полное восстановление с заменой всех изношенных деталей",
      price: "от 15 000 ₽",
      time: "10-14 дней",
      popular: false
    }
  ];

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
       console.log("⚠️ Для отправки заявки необходимо войти в аккаунт");
      return;
    }
    
    const repairRequest = {
      id: Date.now(),
      userId: currentUser.id,
      service: selectedService.name,
      ...formData,
      status: "новая",
      createdAt: new Date().toLocaleString()
    };
    
    const requests = JSON.parse(localStorage.getItem(`repair_requests_${currentUser.id}`) || "[]");
    requests.push(repairRequest);
    localStorage.setItem(`repair_requests_${currentUser.id}`, JSON.stringify(requests));
    
    console.log(`✓ Заявка отправлена!\nГород: ${formData.city}\nМы свяжемся с вами`);
    
    setSelectedService(null);
    setFormData({ name: "", phone: "", city: "Актау", problem: "" });
  };

  if (selectedService) {
    return (
      <div className="repair-form-page">
        <div className="container">
          <button onClick={() => setSelectedService(null)} className="back-btn">
            ← Назад к услугам
          </button>
          
          <div className="repair-form-container">
            <h2>{selectedService.name}</h2>
            <p className="service-price">Цена: {selectedService.price}</p>
            
            <form onSubmit={handleSubmitRequest}>
              <div className="form-group">
                <label>Ваше имя *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Иванов Иван"
                />
              </div>
              
              <div className="form-group">
                <label>Телефон *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+7 (700) 123-45-67"
                />
              </div>

              <div className="form-group">
                <label>Город *</label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                >
                  <option value="Актау">🇰🇿 Актау</option>
                  <option value="Атырау">🇰🇿 Атырау</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Описание проблемы</label>
                <textarea
                  rows="3"
                  value={formData.problem}
                  onChange={(e) => setFormData({...formData, problem: e.target.value})}
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
        <h2>🔧 Ремонт гидроцилиндров</h2>
        <p className="repair-subtitle">Профессиональный ремонт с гарантией 12 месяцев</p>
        
        {/* Города */}
        <div className="cities-block">
          <div className="cities-title">📍 Работаем в городах:</div>
          <div className="cities-tags">
            <span className="city-tag">Актау</span>
            <span className="city-tag">Атырау</span>
          </div>
        </div>
        
        {/* Услуги */}
        <div className="repair-grid">
          {repairServices.map(service => (
            <div className="repair-card" key={service.id}>
              {service.popular && <div className="popular-tag">Популярный</div>}
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="repair-price">{service.price}</div>
              <div className="repair-time">⏱ {service.time}</div>
              <button 
                className="repair-order-btn"
                onClick={() => setSelectedService(service)}
              >
                Заказать ремонт
              </button>
            </div>
          ))}
        </div>
        
        {/* Преимущества */}
        <div className="advantages-block">
          <div className="advantage-item">
            <span>✅</span>
            <p>Гарантия 12 месяцев</p>
          </div>
          <div className="advantage-item">
            <span>🔧</span>
            <p>Оригинальные запчасти</p>
          </div>
          <div className="advantage-item">
            <span>⚡</span>
            <p>Срочный ремонт</p>
          </div>
          <div className="advantage-item">
            <span>🚚</span>
            <p>Выезд мастера</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RepairService;