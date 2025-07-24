import React, { useState } from "react";
import "../styles/ImageCarouselSecond.css";

const ImageCaraouselSecond = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Get visible slides (previous, current, next)
  const getSlide = (i) => {
    const index = (i + images.length) % images.length;
    return images[index];
  };

  return (
    <div className="carousel-wrapper-second">
      <button onClick={prevSlide} className="nav-button-imageee">‹</button>

      <div className="carousel-second">
        <img
          src={getSlide(currentIndex - 1)}
          alt="Previous"
          className="carousel-img-second faded"
        />
        <img
          src={getSlide(currentIndex)}
          alt="Current"
          className="carousel-img-second active"
        />
        <img
          src={getSlide(currentIndex + 1)}
          alt="Next"
          className="carousel-img-second faded"
        />
      </div>

      <button onClick={nextSlide} className="nav-button-imageee">›</button>
    </div>
  );
};

export default ImageCaraouselSecond;
