import React, { useEffect, useState } from "react";
import "../styles/Listing.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { numberToCurrency } from "../pages/ListingDetail.jsx";
import Pagination from "../components/Pagination.jsx";
import MyRangeSlider from "../components/Slider.jsx";

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
  const [showNoListings, setShowNoListings] = useState(false); 
  const [activeType, setActiveType] = useState("house");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // House filter states
  const [houseBedrooms, setHouseBedrooms] = useState("");
  const [houseBathrooms, setHouseBathrooms] = useState("");
  const [houseFloors, setHouseFloors] = useState("");
  const [houseCarParking, setHouseCarParking] = useState("");
  const [housePrice, setHousePrice] = useState([0, 0]);
  const [houseArea, setHouseArea] = useState([0, 0]);

  // Plot filter states
  const [plotPrice, setPlotPrice] = useState([0, 0]);
  const [plotArea, setPlotArea] = useState([0, 0]);

  const [priceRange, setPriceRange] = useState({ min: 0, max: 25000000 });
  const [plotFilters, setPlotFilters] = useState({
    area: { min: 0, max: 10000 },
    price: { min: 0, max: 250000000 },
  });
  const [buttonState, setButtonState] = useState(false);

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

        const params = new URLSearchParams({
          type: activeType,
          page,
          limit,
        });

        // ✅ Different states for house vs plot
        if (activeType === "house") {
          if (houseBedrooms) params.append("bedrooms", houseBedrooms);
          if (houseBathrooms) params.append("bathrooms", houseBathrooms);
          if (houseFloors) params.append("floors", houseFloors);
          if (houseCarParking) params.append("carParking", houseCarParking);
          if (housePrice.length === 2)
            params.append("priceRange", JSON.stringify(housePrice));
          if (houseArea.length === 2)
            params.append("areaRange", JSON.stringify(houseArea));
        } else if (activeType === "plot") {
          if (plotPrice.length === 2)
            params.append("priceRange", JSON.stringify(plotPrice));
          if (plotArea.length === 2)
            params.append("areaRange", JSON.stringify(plotArea));
        }

        const res = await axios.get(
          `${API_URL}/api/listings/filtered/value?${params.toString()}`
        );

        setListings(res.data.items);
        setTotalPages(res.data.totalPages);
        setPage(res.data.currentPage);

        setLoading(false);

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

    return () => {
      if (noListingsTimeout) clearTimeout(noListingsTimeout);
    };
  }, [
    activeType,
    houseBedrooms,
    houseBathrooms,
    houseFloors,
    houseCarParking,
    housePrice,
    houseArea,
    plotPrice,
    plotArea,
    page,
  ]);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  const filterOpen = () => {
    setButtonState(!buttonState);
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
                value={houseBedrooms}
                onChange={(e) => {
                  setHouseBedrooms(e.target.value);
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
                value={houseBathrooms}
                onChange={(e) => {
                  setHouseBathrooms(e.target.value);
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
                value={houseFloors}
                onChange={(e) => {
                  setHouseFloors(e.target.value);
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
                value={houseCarParking}
                onChange={(e) => {
                  setHouseCarParking(e.target.value);
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

              {buttonState && (
                <>
                  <div>
                    <p id="sliderRange">
                      Price Range :{" "}
                      {Array.isArray(housePrice)
                        ? `${numberToCurrency(housePrice[0])} - ${numberToCurrency(housePrice[1])}`
                        : "Select a Price range"}
                    </p>
                  </div>
                  <div>
                    <MyRangeSlider
                      start={100000}
                      end={25000000}
                      min={priceRange.min}
                      max={priceRange.max}
                      value={housePrice}
                      onChange={(values)=>{
                        //write your function here
                        console.log(`the value changed: ${values},${typeof(values[0])}`)
                        setHousePrice(values)}}
                      step={100000}
                    />
                  </div>
                  <div>
                    <p id="sliderRange">
                      Select Area :{" "}
                      {Array.isArray(houseArea)
                        ? `${houseArea[0]} - ${houseArea[1]}`
                        : "Select a Area range"}
                    </p>
                  </div>
                  <div>
                    <MyRangeSlider
                      start={0}
                      end={25000}
                      min={plotFilters.area.min}
                      max={plotFilters.area.max}
                      value={houseArea}
                      onChange={setHouseArea}
                      step={100}
                    />
                  </div>
                </>
              )}
              <div className="filters-arrow">
                <button id="filterButton" onClick={filterOpen}>
                  {buttonState ? "View Less" : "View More"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p id="sliderRange">
                  Price Range :{" "}
                  {Array.isArray(plotPrice)
                    ? `${numberToCurrency(plotPrice[0])} - ${numberToCurrency(plotPrice[1])}`
                    : "Select a Price range"}
                </p>
              </div>
              <div>
                <MyRangeSlider
                  start={100000}
                  end={25000000}
                  min={priceRange.min}
                  max={priceRange.max}
                  value={plotPrice}
                  onChange={setPlotPrice}
                  step={100000}
                />
              </div>
              <div>
                <p id="sliderRange">
                  Select Area :{" "}
                  {Array.isArray(plotArea)
                    ? `${plotArea[0]} - ${plotArea[1]}`
                    : "Select a Area range"}
                </p>
              </div>
              <div>
                <MyRangeSlider
                  start={0}
                  end={25000}
                  min={plotFilters.area.min}
                  max={plotFilters.area.max}
                  value={plotArea}
                  onChange={setPlotArea}
                  step={100}
                />
              </div>
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
