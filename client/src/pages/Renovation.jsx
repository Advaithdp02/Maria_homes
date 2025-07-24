// src/pages/Renovation.jsx
import React from "react";
import "../styles/Renovation.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import ImageCaraouselSecond from "../components/ImageCaraouselSecond";
import { useNavigate } from "react-router-dom";
const images = [
  "/assets/img1.jpg",
  "/assets/img2.jpg",
  "/assets/img3.jpg",
];
const renovationSteps = [
  {
    title: "Consultation & Site Evaluation",
    description: "We visit your space, understand your ideas, and assess structural feasibility.",
  },
  {
    title: "Design Proposal & Material Selection",
    description: "Our designers plan layouts, finishes, and fixtures — with your vision in mind.",
  },
  {
    title: "Quote & Timeline Finalization",
    description: "We prepare the space safely and begin transformation.",
  },
  {
    title: "Demolition & Structural Work",
    description: "We prepare the space safely and begin transformation.",
  },
  {
    title: "Installation & Finishing Touches",
    description: "Plumbing, electrical, carpentry, painting — we bring it all together.",
  },
  {
    title: "Walkthrough & Completion",
    description: "Final quality check with you to ensure everything meets expectations.",
  },
];

const Renovation = () => {
    const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="construction-content">
        <section className="construction-hero">
          <h1>Renovation</h1>
          <p>
            Whether it’s a kitchen upgrade, a bathroom remodel, or a complete home makeover — Maria Homes delivers thoughtful, stylish, and functional renovations tailored to your lifestyle.
With an experienced team and an eye for detail, we focus on making the old feel brand new — efficiently, affordably, and beautifully.</p>
        </section>

        <section className="process-section">
          <h2>Our Renovation Process</h2>
          <div className="process-cards">
            {renovationSteps.map((step, index) => (
              <div key={index} className="process-step">
                <div className="step-card">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < renovationSteps.length - 1 && (
                 <div className="vertical-line" />
                )}

              </div>
            ))}
          </div>
        </section>
        <div className="carousel-container">
    <div>
      
      <ImageCaraouselSecond images={images} />
    </div>
    
  </div>
    <section className="dream-home-section">
  <h2 className="dream-home-heading">Want To Reimagine Your Home?</h2>
  <div className="dream-home-container">
    {/* Column 1: Buttons */}
    <div className="dream-home-left">
      <button className="dream-btn" onClick={() => navigate('/contact')}>Contact Us</button>
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

export default Renovation;
