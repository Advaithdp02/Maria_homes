// src/pages/Construction.jsx
import React from "react";
import "../styles/Construction.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageCaraouselSecond from "../components/ImageCaraouselSecond";

const images = [
  "/assets/img1.jpg",
  "/assets/img2.jpg",
  "/assets/img3.jpg",
];
const constructionSteps = [
  {
    title: "Site Visit & Requirement Gathering",
    description: "We understand your vision, space, and budget before we begin.",
  },
  {
    title: "Planning & Architectural Design",
    description: "Our architects create structural plans tailored to your needs and local compliance.",
  },
  {
    title: "Estimation & Approval",
    description: "We give a clear estimate of time, materials, and cost.",
  },
  {
    title: "Foundation & Structure Work",
    description: "Groundwork begins with durable, certified materials.",
  },
  {
    title: "Plumbing, Electrical & Interiors",
    description: "We integrate modern utilities and design finishes.",
  },
  {
    title: "Final Inspection & Handover",
    description: "Once your home passes all checks, we hand it over — ready to live in.",
  },
];

const Construction = () => {
    

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="construction-content">
        <section className="construction-hero">
          <h1>Construction</h1>
          <p>
            At Maria Homes, we specialize in turning architectural visions into lasting structures. Our construction services combine design precision, high-quality materials, and expert execution to ensure every home is built to perfection.
<br />From residential villas to commercial buildings, we handle every step — from planning and permits to final handover — with transparency and care.</p>
        </section>

        <section className="process-section">
          <h2>Our Construction Process</h2>
          <div className="process-cards">
            {constructionSteps.map((step, index) => (
              <div key={index} className="process-step">
                <div className="step-card">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < constructionSteps.length - 1 && (
                 <div className="vertical-line" />
                )}

              </div>
            ))}
          </div>
        </section>
        <div className="carousel-container">
      <ImageCaraouselSecond images={images} />
    </div>
    <section className="dream-home-section">
  <h2 className="dream-home-heading">Want To Build Your Dream Home?</h2>
  <div className="dream-home-container">
    {/* Column 1: Buttons */}
    <div className="dream-home-left">
      <button className="dream-btn">Contact Us</button>
      <button className="dream-btn whatsapp" onClick={() => window.open("https://wa.me/918075269449", "_blank")}>Chat on Whatsapp</button>
    </div>

    {/* Vertical Line */}
    <div className="vertical-divider"></div>

    {/* Column 2: Map and Text */}
    <div className="dream-home-right">
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
      <p className="visit-text">Come visit us</p>
    </div>
  </div>
</section>

      </main>
      <Footer hidden="hidden"/>
    </div>
  );
};

export default Construction;
