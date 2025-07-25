import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ListingForm.css";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3030";
const UpdateListing = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
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
    carParking: "",
    featured: false,
    images: [], // <-- This holds URLs from backend
  });
  const [media, setMedia] = useState([]); // for new uploads

  // Fetch listing data on mount
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/listings/${id}`);
        const listing = res.data;
        // Convert array to comma string for text input (if needed)
        if (Array.isArray(listing.features)) {
          listing.features = listing.features.join(",");
        }
        setForm(listing);
      } catch (err) {
        console.error("Error fetching listing:", err);
        alert("Error loading listing data.");
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMediaChange = (e) => {
    setMedia(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Ensure features are array (split by comma)
    const featuresArray = form.features.split(",").map((f) => f.trim());

    for (const key in form) {
      if (key === "images") continue; // don't send old images here
      data.append(key, key === "features" ? JSON.stringify(featuresArray) : form[key]);
    }

    Array.from(media).forEach((file) => {
      data.append("images", file); // backend should merge this
    });

    try {
      const res = await axios.put(`${API_URL}/api/listings/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Listing updated successfully!");
      console.log(res.data);
      navigate("/admin");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating listing.");
    }
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };
  const handleRemoveMedia = async (index) => {
  const imageUrl = form.images[index];

  try {
    await axios.put(`http://localhost:3030/api/listings/${id}/delete-image`, { imageUrl });
    
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  } catch (err) {
    console.error("Failed to delete image:", err);
    alert("Error deleting image.");
  }
};

const navigate = useNavigate();

  return (
    <div className="form-container">
      <h2>Update Listing</h2>
      <form onSubmit={handleSubmit} className="listing-form">
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="house">House</option>
          <option value="plot">Plot</option>
        </select>
        <input type="number" name="area" placeholder="Area (sqft)" value={form.area} onChange={handleChange} />
        <input type="text" name="features" placeholder='Features (e.g. AC,Pool)' value={form.features} onChange={handleChange} />
        <textarea name="shortDescription" placeholder="Short Description" value={form.shortDescription} onChange={handleChange}></textarea>
        <textarea name="longDescription" placeholder="Long Description" value={form.longDescription} onChange={handleChange}></textarea>
        <input type="number" name="bedrooms" placeholder="Bedrooms" value={form.bedrooms} onChange={handleChange} />
        <input type="number" name="bathrooms" placeholder="Bathrooms" value={form.bathrooms} onChange={handleChange} />
        <input type="number" name="floors" placeholder="Floors" value={form.floors} onChange={handleChange} />
        <input type="number" name="carParking" placeholder="Car Parking" value={form.carParking} onChange={handleChange} />
        <label>
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Featured
        </label>

        {/* Preview previously uploaded images/videos */}
        <div className="media-preview">
  {form.images && form.images.length > 0 && form.images.map((url, index) => (
    <div key={index} className="preview-item">
      {isVideo(url) ? (
        <video src={url} controls width="200" />
      ) : (
        <img src={url} alt={`media-${index}`} width="200" />
      )}
      <button
        type="button"
        onClick={() => handleRemoveMedia(index)}
        className="remove-btn"
      >
        ✕ 
      </button>
    </div>
  ))}
</div>


        {/* Upload new media */}
        <input type="file" multiple onChange={handleMediaChange} accept="image/*,video/*" />
        <button type="submit">Update Listing</button>
      </form>
    </div>
  );
};

export default UpdateListing;
