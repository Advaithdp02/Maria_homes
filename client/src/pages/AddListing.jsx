// src/pages/AddListing.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ListingForm.css";

const API_URL = process.env.REACT_APP_API_URL;

const AddListing = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    type: "house",
    area: "",
    features: "",
    shortDescription: "",
    longDescription: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    featured: false,
    carParking: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // 👈 loading state

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // 👈 prevent double click
    setLoading(true);

    try {
      const listingData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "features") {
          listingData.append(key, JSON.stringify(value.split(",")));
        } else {
          listingData.append(key, value);
        }
      });

      images.forEach((file) => {
        listingData.append("images", file);
      });

      const res = await axios.post(`${API_URL}/api/listings`, listingData);
      console.log("Listing created:", res.data);
      navigate("/admin");
    } catch (err) {
      console.error("Failed to create listing:", err);
      alert("Error adding listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Listing</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
        
        <select name="type" onChange={handleChange} value={formData.type}>
          <option value="house">House</option>
          <option value="plot">Plot</option>
        </select>
        
        <input type="number" name="area" placeholder="Area (sqft)" onChange={handleChange} required />
        <input type="text" name="features" placeholder="Features (comma separated)" onChange={handleChange} />
        <textarea name="shortDescription" placeholder="Short Description" onChange={handleChange}></textarea>
        <textarea name="longDescription" placeholder="Long Description" onChange={handleChange}></textarea>
        <input type="number" name="bedrooms" placeholder="Bedrooms" onChange={handleChange} />
        <input type="number" name="bathrooms" placeholder="Bathrooms" onChange={handleChange} />
        <input type="number" name="floors" placeholder="Floors" onChange={handleChange} />
        <input type="number" name="carParking" placeholder="Car Parking" onChange={handleChange} />
        
        <label>
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
          Featured
        </label>
        
        <input type="file" multiple accept="image/*,video/*" onChange={handleImageChange} />
        
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Listing"}
        </button>
        
        <button className="back" type="button" onClick={() => navigate(-1)}>
          Back
        </button>
      </form>
    </div>
  );
};

export default AddListing;
