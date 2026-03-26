import React from "react";

const contacts = [
  { role: "Директор", name: "Фафонов.К", phone: "+7 (900) 111-11-11", email: "director@gidrobas.ru" },
  { role: "Главный инженер", name: "Руденский.А", phone: "+7 (900) 222-22-22", email: "engineer@gidrobas.ru" }
];

const Contacts = () => {
  return (
    <section id="contacts" className="contacts">
      <div className="container">
        <h2>Контакты</h2>
        <p>Телефон: +7 (900) 123-45-67</p>
        <p>Email: info@gidrobas.ru</p>
        <p>ИП: Бутенко.М</p>

        <h3>Руководство</h3>
        <div className="contacts-grid">
          {contacts.map((person, idx) => (
            <div className="contact-person" key={idx}>
              <p><strong>{person.role}:</strong> {person.name}</p>
              <p>Тел: {person.phone}</p>
              <p>Email: {person.email}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contacts;