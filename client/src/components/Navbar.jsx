import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "../styles/Navbar.css";



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const handleSectionClick = (sectionId) => {
  if (window.location.pathname === "/") {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  } else {
    sessionStorage.setItem("scrollToSection", sectionId);
    navigate("/", { replace: false });
  }
  setIsOpen(false);
};

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="nav-left">
        <Link to="/">
          <img src="/assets/MariaHomesLogo.png" onClick={handleLogoClick} alt="Logo" className="logo-img" />
        </Link>
      </div>

      {/* Center: Nav links */}
      <div className={`nav-center ${isOpen ? "open" : ""}`}>
        <a href="#about" onClick={() => handleSectionClick("about")} className="nav-button">About</a>
        <a href="#services" onClick={() => handleSectionClick("services")} className="nav-button">Services</a>
        <a href="#featured" onClick={() => handleSectionClick("featured")} className="nav-button">Featured</a>
        <a href="#reviews" onClick={() => handleSectionClick("reviews")} className="nav-button">Reviews</a>
      </div>

      {/* Right: Contact + Hamburger */}
      <div className="nav-right">
        <Link to="/contact" className="contact-btn-nav">Contact</Link>
        <div className="hamburger" onClick={toggleMenu}>☰</div>
      </div>

      {/* Dropdown for mobile view */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <a href="#about" className="nav-button-mobile">About</a>
        <a href="#services" className="nav-button-mobile">Services</a>
        <a href="#featured" className="nav-button-mobile">Featured</a>
        <a href="#reviews" className="nav-button-mobile">Reviews</a>
        <Link to="/contact" className="contact-btn-mobile">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
