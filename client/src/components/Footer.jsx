import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 720);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 720);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        {/* Icons Section */}
        <div
          className="footer-icons"
          style={{
            justifyContent:
              isMobile || props.hidden === "hidden" ? "center" : "flex-end",
          }}
        >
          <a href="https://www.facebook.com/share/1WZLeqjusw/" target="_blank" rel="noreferrer">
            <img src="/assets/facebook.png" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/maria.homes.kothamangalam?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer">
            <img src="/assets/instagram.png" alt="Instagram" />
          </a>
          <a href="/contact">
            <img src="/assets/gmail.png" alt="Gmail" />
          </a>
          <a href="https://youtube.com/@maria_homes?si=nokr48zFNC80JuHW" target="_blank" rel="noreferrer">
            <img src="/assets/youtube.png" alt="YouTube" />
          </a>
        </div>

        {/* Divider & Map */}
        <hr className={`white-line ${props.hidden}`} />
        <div className={`footer-map ${props.hidden}`}>
          <iframe
            title="Maria Homes Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.4492737746928!2d76.62711127599039!3d10.062224590046416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e79e12537ab7%3A0xccbc8b5d4c9fb10e!2sMaria%20homes!5e0!3m2!1sen!2sin!4v1752908504232!5m2!1sen!2sin"
            width="250"
            height="176"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="footer-links">
        <Link to="/contact">Contact Us</Link> |{" "}
        <span onClick={backToTop}>Back to Top</span> |{" "}
        <Link to="/listings">Listings</Link>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        © 2025 Maria Homes. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
