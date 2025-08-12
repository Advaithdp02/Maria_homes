import React, { useEffect, useState } from "react";
import "../styles/Listing.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { numberToCurrency } from "../pages/ListingDetail.jsx";
import Pagination from "../components/Pagination.jsx";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3030";

const SkeletonCard = () => (
  <div className="listing-card-wrapper">
    <div className="listing-card skeleton">
      <div className="listing-img skeleton-img"></div>
      <div className="listing-details">
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="card-bottom">
          <div className="skeleton-text" style={{ width: "40%" }}></div>
          <div className="skeleton-text" style={{ width: "30%" }}></div>
        </div>
      </div>
    </div>
  </div>
);

const Listing = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoListings, setShowNoListings] = useState(false); // For delayed no listings message
  const [activeType, setActiveType] = useState("house");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // Items per page

  // Filter states
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [selectedBathrooms, setSelectedBathrooms] = useState("");
  const [selectedFloors, setSelectedFloors] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedArea, setSelectedArea] = useState(0);
  const [carParking, setCarParking] = useState("");

  const [priceRange, setPriceRange] = useState({ min: 0, max: 25000000 });
  const [plotFilters, setPlotFilters] = useState({
    area: { min: 0, max: 10000 },
    price: { min: 0, max: 250000000 },
  });

  const navigate = useNavigate();

  // Fetch filter ranges on mount
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/listings/filters/range`);
        const data = res.data;
        setPriceRange(data.price);
        setPlotFilters({ area: data.area, price: data.price });
      } catch (err) {
        console.error("Error fetching filter values:", err);
      }
    };
    fetchFilterData();
  }, []);

  // Fetch listings on page, activeType or filters change
  useEffect(() => {
    let noListingsTimeout;

    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowNoListings(false);

        // Build query params string with filters & pagination
        const params = new URLSearchParams({
          type: activeType,
          page,
          limit,
        });

        if (selectedBedrooms) params.append("bedrooms", selectedBedrooms);
        if (selectedBathrooms) params.append("bathrooms", selectedBathrooms);
        if (selectedFloors) params.append("floors", selectedFloors);
        if (carParking) params.append("carParking", carParking);
        if (selectedPrice) params.append("maxPrice", selectedPrice);
        if (selectedArea) params.append("maxArea", selectedArea);

        const res = await axios.get(
          `${API_URL}/api/listings/filtered/value?${params.toString()}`
        );
        console.log(res.data.items)
        setListings(res.data.items);
        setTotalPages(res.data.totalPages);
        setPage(res.data.currentPage);

        setLoading(false);

        // If no listings, wait 1 second before showing message for smoother UI
        if (res.data.items.length === 0) {
          noListingsTimeout = setTimeout(() => {
            setShowNoListings(true);
          }, 1000);
        } else {
          setShowNoListings(false);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
        setLoading(false);
        setShowNoListings(true);
      }
    };

    fetchListings();

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (noListingsTimeout) clearTimeout(noListingsTimeout);
    };
  }, [
    activeType,
    selectedBedrooms,
    selectedBathrooms,
    selectedFloors,
    selectedPrice,
    selectedArea,
    carParking,
    page,
  ]);

  // Change page handler
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="listings-content">
        <h1 className="listings-heading">Listings</h1>

        {/* Toggle Buttons */}
        <div className="toggle-buttons">
          <button
            className={`toggle-btn ${activeType === "house" ? "active" : ""}`}
            onClick={() => {
              setActiveType("house");
              setPage(1);
            }}
          >
            House
          </button>
          <button
            className={`toggle-btn ${activeType === "plot" ? "active" : ""}`}
            onClick={() => {
              setActiveType("plot");
              setPage(1);
            }}
          >
            Plot
          </button>
        </div>

        {/* Filter Section */}
        <div className="filters-row">
          {activeType === "house" ? (
            <>
              <select
                value={selectedBedrooms}
                onChange={(e) => {
                  setSelectedBedrooms(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Bedrooms</option>
                {[1, 2, 3, 4].map((b) => (
                  <option key={b} value={b}>
                    {b} BHK
                  </option>
                ))}
                <option value="5+">5+ BHK</option>
              </select>

              <select
                value={selectedBathrooms}
                onChange={(e) => {
                  setSelectedBathrooms(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Bathrooms</option>
                {[1, 2, 3, 4].map((b) => (
                  <option key={b} value={b}>
                    {b} Baths
                  </option>
                ))}
                <option value="5+">5+ Baths</option>
              </select>

              <select
                value={selectedFloors}
                onChange={(e) => {
                  setSelectedFloors(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Floors</option>
                {[1, 2, 3, 4].map((f) => (
                  <option key={f} value={f}>
                    {f} {f === 1 ? "floor" : "floors"}
                  </option>
                ))}
                <option value="5+">5+ floors</option>
              </select>

              <select
                value={carParking}
                onChange={(e) => {
                  setCarParking(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Car Parking</option>
                {[1, 2, 3, 4].map((p) => (
                  <option key={p} value={p}>
                    {p} Car Parking
                  </option>
                ))}
                <option value="5+">5+ Car Parking</option>
              </select>

              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={selectedPrice}
                onChange={(e) => {
                  setSelectedPrice(e.target.value);
                  setPage(1);
                }}
              />
              <span>Up to {numberToCurrency(selectedPrice)}</span>

              <input
                type="range"
                min={plotFilters.area.min}
                max={plotFilters.area.max}
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  setPage(1);
                }}
              />
              <span>Min Area: {selectedArea} sq.ft</span>
            </>
          ) : (
            <>
              <input
                type="range"
                min={plotFilters.area.min}
                max={plotFilters.area.max}
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  setPage(1);
                }}
              />
              <span>Min Area: {selectedArea} cent</span>

              <input
                type="range"
                min={plotFilters.price.min}
                max={plotFilters.price.max}
                value={selectedPrice}
                onChange={(e) => {
                  setSelectedPrice(e.target.value);
                  setPage(1);
                }}
              />
              <span>Max Price: {numberToCurrency(selectedPrice)}</span>
            </>
          )}
        </div>

        {/* Listings Grid or Messages */}
        {loading ? (
          <div className="listings-grid">
            {Array.from({ length: limit }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="listings-grid">
            <AnimatePresence mode="wait">
              {listings.map((item) => (
                <div className="listing-card-wrapper" key={item._id}>
                  <Link to={`/listing/${item._id}`} className="card-link">
                    <motion.div
                      className="listing-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="listing-img"
                      />
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
        ) : (
          showNoListings && (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              No listings found.
            </p>
          )
        )}

        {/* Pagination Controls */}
        <Pagination
  totalPages={totalPages}
  currentPage={page}
  onPageChange={goToPage}
/>
      </main>
      <Footer />
    </div>
  );
};

export default Listing;
