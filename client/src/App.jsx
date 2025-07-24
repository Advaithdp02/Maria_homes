// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Listing from "./pages/Listing";
import ListingDetail from "./pages/ListingDetail";
import Register from "./pages/Register";

import Construction from "./pages/Construction";
import Renovation from "./pages/Renovation";
import ScrollToTop from "./components/ScrollToTop";
import AddListing from "./pages/AddListing";
import UpdateListing from "./pages/UpdateListing";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/listings" element={<Listing />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        {/* Additional routes for construction and renovation */}
        <Route path="/add-listing" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
        <Route path="/update-listing/:id" element={<ProtectedRoute><UpdateListing /></ProtectedRoute>} />
        <Route path="/construction" element={<Construction />} />
        <Route path="/renovation" element={<Renovation />} />
      </Routes>
    </Router>
  );
}

export default App;
