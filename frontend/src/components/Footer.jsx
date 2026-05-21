import "./Footer.css"
import React from "react";
import video from "../assets/Video.mp4";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <p>© 2026 Gidrobas. Все права защищены.</p>
        <div className="footer-video">
          <video controls width="400" muted>
            <source src={video} type="video/mp4" />
          </video>
        </div>
      </div>
    </footer>
  );
};

export default Footer;