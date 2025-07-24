// src/pages/AdminPanel.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/AdminPanel.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [listingId, setListingId] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const handleUpdate = () => {
    if (listingId.trim()) {
      navigate(`/update-listing/${listingId}`);
    } else {
      alert("Please enter a valid ID.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId.trim()) {
      alert("Please enter a valid ID.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${API_URL}/api/listings/${deleteId}`);
      alert("Listing deleted successfully!");
      setDeleteId("");
      console.log("Delete response:", res.data);
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing.");
    }
  };

  return (
    <div className="admin-wrapper">
      <Navbar />
      <div className="admin-container">
        <h1 className="admin-title">Admin Panel</h1>
        <div className="admin-buttons">
          <button onClick={() => navigate("/register")}>Register User</button>
          <button onClick={() => navigate("/add-listing")}>Add Listing</button>

          <div className="update-section">
            <input
              type="text"
              placeholder="Enter Listing ID"
              value={listingId}
              onChange={(e) => setListingId(e.target.value)}
            />
            <button onClick={handleUpdate}>Update Listing</button>
          </div>

          <div className="update-section">
            <input
              type="text"
              placeholder="Enter Listing ID to Delete"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
            />
            <button onClick={handleDelete} className="delete-btn">Delete Listing</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
