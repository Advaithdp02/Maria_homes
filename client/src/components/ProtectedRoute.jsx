// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3030";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null); // null = loading, true/false = decision

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsValid(false);
      return;
    }

    // 1️⃣ Quick frontend expiry check
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // seconds
      if (decoded.exp < now) {
        localStorage.removeItem("token");
        setIsValid(false);
        return;
      }
    } catch {
      localStorage.removeItem("token");
      setIsValid(false);
      return;
    }

    // 2️⃣ Backend validation
    axios
      .get(`${API_URL}/api/auth/validatetoken`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => setIsValid(true))
      .catch(() => {
        localStorage.removeItem("token");
        setIsValid(false);
      });
  }, []);

  if (isValid === null) {
    return <div>Checking token...</div>; // Loader state
  }

  return isValid ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
