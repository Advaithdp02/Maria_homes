// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/AdminPanel.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

  // Fetch all listings
  useEffect(() => {
    axios
      .get(`${API_URL}/api/listings/full`)
      .then((res) => setListings(res.data || []))
      .catch((err) => console.error("Failed to fetch listings:", err));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/listings/${id}`);
      alert("Listing deleted successfully!");
      setListings((prev) => prev.filter((listing) => listing._id !== id));
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
          <button onClick={()=>{
            localStorage.removeItem('token');
            navigate('/login')
          }}>Logout</button>
        </div>
      </div>

      {/* Table outside the container */}
      <div className="admin-table-wrapper">
        <h2 style={{ textAlign: "center", marginTop: "20px" }}>All Listings</h2>
        <div className="table-scroll">
          <table className="admin-table">
  <thead>
    <tr>
      <th>Image</th>
      <th>Title</th>
      <th>Location</th>
      <th>Short Description</th>
      <th>Update</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>
    {listings.map((listing) => (
      <tr key={listing._id}>
        <td>
          <img
            src={listing.images?.[0] || "/assets/placeholder.png"} // fallback image
            alt={listing.title}
            className="admin-listing-img"
          />
        </td>
        <td>{listing.title}</td>
        <td>{listing.location}</td>
        <td>{listing.shortDescription}</td>
        <td>
          <button onClick={() => navigate(`/update-listing/${listing._id}`)}>Update</button>
        </td>
        <td>
          <button onClick={() => handleDelete(listing._id)} className="delete-btn">
            Delete
          </button>
        </td>
      </tr>
    ))}
    {listings.length === 0 && (
      <tr>
        <td colSpan="6" style={{ textAlign: "center" }}>No listings found.</td>
      </tr>
    )}
  </tbody>
</table>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
