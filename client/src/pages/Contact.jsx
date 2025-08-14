// src/pages/ContactUs.jsx
import React from "react";
import "../styles/ContactUs.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";

const ContactUs = () => {
  
  

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="contact-container">
        <h1 className="contact-heading">Contact Us</h1>
        
        <ContactForm />

        <div className="alt-contact-section">
          <div className="alt-left">
            <button
                className="call-now-btn"
                onClick={() => window.open("tel:+918075269449")}
              >
  Call Now
</button>
            <button
              className="whatsapp-btn"
              onClick={() => window.open("https://wa.me/917012791781", "_blank")}
            >
              Chat on WhatsApp
            </button>
          </div>
          <div className="vertical-line-contact"></div>
          <div className="alt-right">
            <iframe
              title="Maria Homes Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.4492737746928!2d76.62711127599039!3d10.062224590046416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e79e12537ab7%3A0xccbc8b5d4c9fb10e!2sMaria%20homes!5e0!3m2!1sen!2sin!4v1752908504232!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
            <p className="visit-text-contact">Come visit us</p>
          </div>
        </div>
      </main>
      <Footer hidden="hidden"/>
    </div>
  );
};

export default ContactUs;
