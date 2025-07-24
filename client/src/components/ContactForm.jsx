import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3030";


const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await axios.post(`${API_URL}/api/mail/send-query`, formData);
      setStatus("Message sent!");
      setFormData({ name: "", phone: "", message: "" });
      console.log(response.data);
    } catch (error) {
      setStatus("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
      <textarea name="message" rows="5" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
      <button type="submit" className="send-btn" disabled={loading}>
        {loading ? "Sending..." : "Send Query"}
      </button>
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </form>
  );
};

export default ContactForm;
