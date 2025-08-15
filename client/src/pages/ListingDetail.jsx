import React from "react";
import "../styles/ListingDetail.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageCarousel from "../components/ImageCarasoul"; 
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3030";

export const numberToCurrency = (num) => {
  if (num > 9999999) {
    return `₹${(num / 10000000).toFixed(2)} Crore`;
  }else if (num > 99999) {
    return `₹${(num / 100000).toFixed(2)} Lakhs`;
  }
}


const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const navigate=useNavigate()

  useEffect(() => {
    axios.get(`${API_URL}/api/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => console.error("Error loading detail:", err));
  }, [id]);

  if (!listing) return <p>Loading...</p>;
  return (
    <div className="page-wrapper">
        <Navbar />
        <div className="listing-top-view">
        <h1 className="detail-title">{listing.title}</h1>

      {/* Carousel */}
      
      <ImageCarousel media={listing.images} />
        </div>
    <div className="listing-detail-container">
      
      {/* Description */}
      

      {/* Stats: sqft / price / land area */}
      <div className="detail-cards">
       <div className="info-box">
  <strong>
    {listing.area} {listing.type === "plot" ? "Cent" : "Sq.ft"}
    <br />
    Area
  </strong>
</div>

        <div className="info-box"><strong>{numberToCurrency(listing.price)}</strong><br />Price</div>
        <div className="info-box"><strong>{listing.location}</strong><br />Location</div>
      </div>
      
      {/* Features and Map Side by Side */}
      <div className="features-map-wrapper">
        <ul className="feature-list">
          <h3>Features</h3>
          {listing.features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
<p className="detail-description">{listing.longDescription}</p>
        <div className="map-box">
          <iframe
            title="listing-location"
           src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.location)}&z=15&output=embed`}

            allowFullScreen
            loading="lazy"
          />
          <p className="map-location">Location: {listing.location}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="contact-section">
        <p>For More Details</p>
        <button className="contact-btn" onClick={()=>{navigate('/contact')}}>Contact Us</button>
        <button
          className="contact-btn whatsapp"
          onClick={() => window.open("https://wa.me/917012791781", "_blank")}
        >
          Chat on WhatsApp
        </button>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default ListingDetail;
