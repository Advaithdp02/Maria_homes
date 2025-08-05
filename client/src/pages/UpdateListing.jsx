import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ListingForm.css";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3030";

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    images: [],
  });

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/listings/${id}`);
        const listing = res.data;

        if (Array.isArray(listing.features)) {
          const cleaned = listing.features.filter((feature) => {
            return !/(Bedroom|Bedrooms|Bathroom|Bathrooms|Car Parking)/i.test(feature);
          });
          listing.features = cleaned.join(",");
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
    if (loading) return;
    setLoading(true);

    const data = new FormData();

    const featureListed = [];

    if (form.bedrooms) {
      featureListed.push(`${form.bedrooms} ${form.bedrooms === "1" ? "Bedroom" : "Bedrooms"}`);
    }
    if (form.bathrooms) {
      featureListed.push(`${form.bathrooms} ${form.bathrooms === "1" ? "Bathroom" : "Bathrooms"}`);
    }
    if (form.carParking) {
      featureListed.push(`${form.carParking} Car Parking`);
    }

    const featuredArray = form.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);

    const featuresArray = [...featuredArray, ...featureListed];

    for (const key in form) {
      if (key === "images") continue;
      data.append(key, key === "features" ? JSON.stringify(featuresArray) : form[key]);
    }

    Array.from(media).forEach((file) => {
      data.append("images", file);
    });

    try {
      await axios.put(`${API_URL}/api/listings/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Listing updated successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating listing.");
    } finally {
      setLoading(false);
    }
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  const handleRemoveMedia = async (index) => {
    const imageUrl = form.images[index];
    try {
      await axios.put(`${API_URL}/api/listings/${id}/delete-image`, { imageUrl });
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("Error deleting image.");
    }
  };

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

        <input type="text" name="features" placeholder="Features (e.g. AC, Pool)" value={form.features} onChange={handleChange} />

        <textarea name="shortDescription" placeholder="Short Description" value={form.shortDescription} onChange={handleChange}></textarea>
        <textarea name="longDescription" placeholder="Long Description" value={form.longDescription} onChange={handleChange}></textarea>

        {/* Updated descriptive inputs */}
        <input
          type="text"
          name="bedrooms"
          placeholder="Bedrooms"
          value={form.bedrooms ? `${form.bedrooms} BHK` : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setForm((prev) => ({ ...prev, bedrooms: value }));
          }}
        />
        <input
  type="text"
  name="floors"
  placeholder="Floors"
  value={form.floors ? `${form.floors} Floor${form.floors === "1" ? "" : "s"}` : ""}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
    setForm((prev) => ({ ...prev, floors: value }));
  }}
/>

        <input
          type="text"
          name="bathrooms"
          placeholder="Bathrooms"
          value={form.bathrooms ? `${form.bathrooms} Bathroom${form.bathrooms === "1" ? "" : "s"}` : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setForm((prev) => ({ ...prev, floors: value }));
          }}
        />
        <input
          type="text"
          name="carParking"
          placeholder="Car Parking"
          value={form.carParking ? `${form.carParking} Car Parking` : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setForm((prev) => ({ ...prev, carParking: value }));
          }}
        />

        <label>
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Featured
        </label>

        {/* Media preview */}
        <div className="media-preview">
          {form.images &&
            form.images.length > 0 &&
            form.images.map((url, index) => (
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

        <input type="file" multiple onChange={handleMediaChange} accept="image/*,video/*" />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Listing"}
        </button>
      </form>
    </div>
  );
};

export default UpdateListing;
