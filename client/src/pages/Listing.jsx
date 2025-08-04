import React, { useEffect, useState } from "react";
import "../styles/Listing.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { numberToCurrency } from "../pages/ListingDetail.jsx";
import ReactSlider from "react-slider";
import "../styles/RangeSlider.css"; // 🔁 Add this for styling

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3030";

const Listing = () => {
  const [listings, setListings] = useState([]);
  const [activeType, setActiveType] = useState("house");

  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [selectedBathrooms, setSelectedBathrooms] = useState("");
  const [selectedFloors, setSelectedFloors] = useState("");
  const [carParking, setCarParking] = useState("");

  const [selectedPrice, setSelectedPrice] = useState([0, 25000000]);
  const [selectedArea, setSelectedArea] = useState([0, 10000]);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 25000000 });
  const [plotFilters, setPlotFilters] = useState({
    area: { min: 0, max: 10000 },
    price: { min: 0, max: 250000000 },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/listings`);
        setListings(res.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    const fetchFilterData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/listings/filters/range`);
        const data = res.data;

        setPriceRange(data.price);
        setPlotFilters({ area: data.area, price: data.price });

        setSelectedPrice([data.price.min, data.price.max]);
        setSelectedArea([data.area.min, data.area.max]);
      } catch (err) {
        console.error("Error fetching filter values:", err);
      }
    };

    fetchListings();
    fetchFilterData();
  }, []);

  const filteredListings = listings.filter((item) => {
    if (item.type !== activeType) return false;

    if (activeType === "house") {
      if (
        selectedBedrooms &&
        !(
          (selectedBedrooms === "5+" && Number(item.bedrooms) >= 5) ||
          Number(item.bedrooms) === Number(selectedBedrooms)
        )
      )
        return false;

      if (
        selectedBathrooms &&
        !(
          (selectedBathrooms === "5+" && Number(item.bathrooms) >= 5) ||
          Number(item.bathrooms) === Number(selectedBathrooms)
        )
      )
        return false;

      if (
        selectedFloors &&
        !(
          (selectedFloors === "5+" && Number(item.floors) >= 5) ||
          Number(item.floors) === Number(selectedFloors)
        )
      )
        return false;

      if (
        carParking &&
        !(
          (carParking === "5+" && Number(item.carParking) >= 5) ||
          Number(item.carParking) === Number(carParking)
        )
      )
        return false;

      if (Number(item.price) < selectedPrice[0] || Number(item.price) > selectedPrice[1]) return false;
      if (Number(item.area) < selectedArea[0] || Number(item.area) > selectedArea[1]) return false;
    }

    if (activeType === "plot") {
      if (Number(item.area) < selectedArea[0] || Number(item.area) > selectedArea[1]) return false;
      if (Number(item.price) < selectedPrice[0] || Number(item.price) > selectedPrice[1]) return false;
    }

    return true;
  });

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="listings-content">
        <h1 className="listings-heading">Listings</h1>

        {/* Toggle Buttons */}
        <div className="toggle-buttons">
          <button
            className={`toggle-btn ${activeType === "house" ? "active" : ""}`}
            onClick={() => setActiveType("house")}
          >
            House
          </button>
          <button
            className={`toggle-btn ${activeType === "plot" ? "active" : ""}`}
            onClick={() => setActiveType("plot")}
          >
            Plot
          </button>
        </div>

        {/* Filters */}
        <div className="filters-row">
          {activeType === "house" && (
            <>
              <select value={selectedBedrooms} onChange={(e) => setSelectedBedrooms(e.target.value)}>
                <option value="">Bedrooms</option>
                {[1, 2, 3, 4].map((b) => (
                  <option key={b} value={b}>{b} BHK</option>
                ))}
                <option value="5+">5+ BHK</option>
              </select>

              <select value={selectedBathrooms} onChange={(e) => setSelectedBathrooms(e.target.value)}>
                <option value="">Bathrooms</option>
                {[1, 2, 3, 4].map((b) => (
                  <option key={b} value={b}>{b} Baths</option>
                ))}
                <option value="5+">5+ Baths</option>
              </select>

              <select value={selectedFloors} onChange={(e) => setSelectedFloors(e.target.value)}>
                <option value="">Floors</option>
                {[1, 2, 3, 4].map((f) => (
                  <option key={f} value={f}>
                    {f} {f === 1 ? "floor" : "floors"}
                  </option>
                ))}
                <option value="5+">5+ floors</option>
              </select>

              <select value={carParking} onChange={(e) => setCarParking(e.target.value)}>
                <option value="">Car Parking</option>
                {[1, 2, 3, 4].map((p) => (
                  <option key={p} value={p}>{p} Car Parking</option>
                ))}
                <option value="5+">5+ Car Parking</option>
              </select>
            </>
          )}

          {/* Area Slider */}
          <div className="range-slider-group">
            <label className="range-heading">Area (sq.ft):</label>
            <ReactSlider
              className="range-slider"
              thumbClassName="thumb"
              trackClassName="track"
              min={plotFilters.area.min}
              max={plotFilters.area.max}
              value={selectedArea}
              onChange={(value) => setSelectedArea(value)}
              ariaLabel={["Min area", "Max area"]}
              pearling
              minDistance={10}
            />
            <div className="range-values">
              {selectedArea[0]} - {selectedArea[1]} sq.ft
            </div>
          </div>

          {/* Price Slider */}
          <div className="range-slider-group">
            <label className="range-heading">Price (₹):</label>
            <ReactSlider
              className="range-slider"
              thumbClassName="thumb"
              trackClassName="track"
              min={priceRange.min}
              max={priceRange.max}
              value={selectedPrice}
              onChange={(value) => setSelectedPrice(value)}
              ariaLabel={["Min price", "Max price"]}
              pearling
              minDistance={10000}
            />
            <div className="range-values">
              {numberToCurrency(selectedPrice[0])} - {numberToCurrency(selectedPrice[1])}
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="listings-grid">
          <AnimatePresence mode="wait">
            {filteredListings.map((item) => (
              <div className="listing-card-wrapper" key={item._id}>
                <Link to={`/listing/${item._id}`} className="card-link">
                  <motion.div
                    className="listing-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <img src={item.images[0]} alt={item.title} className="listing-img" />
                    <div className="listing-details">
                      <h3>{item.title}</h3>
                      <p className="desc">{item.shortDescription}</p>
                      <div className="card-bottom">
                        <span className="location">{item.location}</span>
                        <button
                          className="view-btn"
                          onClick={() => navigate(`/listing/${item._id}`)}
                        >
                          View More
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Listing;
