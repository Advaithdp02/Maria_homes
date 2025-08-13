// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3030";
const token=localStorage.getItem('token')
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const { username, email, password } = form;
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
      },{headers: {
    'Authorization': `Bearer ${token}`
  }});
      console.log("Registration successful:", res.data);
      setError(""); // Clear any previous errors

      navigate("/admin"); // Redirect on successful registration
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      console.log(token)
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <form className="login-box" onSubmit={handleRegister}>
          <h2>Register</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
           <button className="back" type="button" onClick={() => navigate(-1)}>Back</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;
