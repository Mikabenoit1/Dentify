import React from 'react';
import "../styles/Contact.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contactez-nous</h1>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Nos Coordonnées</h2>
          <div className="contact-item"><FaPhone /> <p>+1 234 567 890</p></div>
          <div className="contact-item"><FaEnvelope /> <p>contact@monsite.com</p></div>
          <div className="contact-item"><FaMapMarkerAlt /> <p>123 Rue de la Santé, Montréal, QC</p></div>
        </div>

        <div className="contact-form">
          <h2>Envoyez-nous un message</h2>
          <form>
            <input type="text" placeholder="Votre nom" required />
            <input type="email" placeholder="Votre email" required />
            <textarea placeholder="Votre message" required></textarea>
            <button type="submit">Envoyer</button>
          </form>

          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

