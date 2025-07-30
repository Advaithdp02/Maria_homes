// src/pages/AddListing.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ListingForm.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3030";

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
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...previewUrls]);
  };

  const handleRemovePreview = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previews];

    updatedImages.splice(index, 1);
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);

    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
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

        <input
          type="text"
          name="bedrooms"
          placeholder="Bedrooms"
          value={formData.bedrooms ? `${formData.bedrooms} BHK` : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, bedrooms: value }));
          }}
        />

        <input
          type="text"
          name="bathrooms"
          placeholder="Bathrooms"
          value={formData.bathrooms ? `${formData.bathrooms} Bathroom${formData.bathrooms === "1" ? "" : "s"}` : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, bathrooms: value }));
          }}
        />

        <input
          type="text"
          name="floors"
          placeholder="Floors"
          value={formData.floors ? `${formData.floors} Floor${formData.floors === "1" ? "" : "s"}` : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, floors: value }));
          }}
        />

        <input
          type="text"
          name="carParking"
          placeholder="Car Parking"
          value={formData.carParking ? `${formData.carParking} Car Parking` : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, carParking: value }));
          }}
        />

        <label>
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
          Featured
        </label>

        <input type="file" multiple accept="image/*,video/*" onChange={handleImageChange} />

        {/* Media Preview with Delete Option */}
        <div className="media-preview">
          {previews.map((url, index) => (
            <div key={index} className="preview-item" style={{ position: "relative", marginBottom: "10px" }}>
              {isVideo(url) ? (
                <video src={url} controls width="200" />
              ) : (
                <img src={url} alt={`preview-${index}`} width="200" />
              )}
              <button
                type="button"
                onClick={() => handleRemovePreview(index)}
                className="remove-btn"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

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
