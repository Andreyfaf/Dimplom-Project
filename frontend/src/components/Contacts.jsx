import React from "react";

const Contacts = ({ contactInfo, team = [] }) => {
  return (
    <section id="contacts" className="contacts">
      <div className="container">
        <h2>Контакты</h2>

        <p>Телефон: {contactInfo?.phone || "+7 (900) 123-45-67"}</p>
        <p>Email: {contactInfo?.email || "info@gidrobas.ru"}</p>
        <p>{contactInfo?.entrepreneur_name || "Бутенко.М"}</p>

        <h3>Руководство</h3>

        <div className="contacts-grid">
          {team.length === 0 ? (
            <p>Контакты руководства пока не добавлены</p>
          ) : (
            team.map((person) => (
              <div className="contact-person" key={person.id}>
                <p>
                  <strong>{person.role}:</strong> {person.name}
                </p>
                <p>Тел: {person.phone}</p>
                <p>Email: {person.email}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Contacts;
