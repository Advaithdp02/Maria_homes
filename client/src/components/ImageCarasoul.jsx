import React, { useState, useRef, useEffect, useCallback } from "react";
import "../styles/ImageCarousel.css";

const ImageCarousel = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isVideo = (url) => {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const pauseCurrentVideo = useCallback(() => {
    if (isVideo(media[currentIndex])) {
      const video = videoRefs.current[currentIndex];
      if (video && !video.paused) video.pause();
    }
  }, [currentIndex, media]);

  const nextSlide = useCallback(() => {
    pauseCurrentVideo();
    setCurrentIndex((prev) => Math.min(prev + 1, media.length - 1));
  }, [pauseCurrentVideo, media.length]);

  const prevSlide = useCallback(() => {
    pauseCurrentVideo();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, [pauseCurrentVideo]);

  const togglePlayPause = () => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      if (video.paused) video.play();
      else video.pause();
    }
  };

  useEffect(() => {
    const slider = carouselRef.current;
    if (!slider) return;

    let startX = 0;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;

      if (deltaX > 50) {
        prevSlide();
      } else if (deltaX < -50) {
        nextSlide();
      }
    };

    slider.addEventListener("touchstart", onTouchStart);
    slider.addEventListener("touchend", onTouchEnd);

    return () => {
      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchend", onTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  const currentMedia = media[currentIndex];

  return (
    <div className="carousel-wrapper" ref={carouselRef}>
      <button
  onClick={prevSlide}
  className="nav-button-imagee nav-prev"
  disabled={currentIndex === 0}
>
  ‹
</button>

<div className="carousel-track">
  {isVideo(currentMedia) ? (
    <video
      ref={(el) => (videoRefs.current[currentIndex] = el)}
      src={currentMedia}
      className="carousel-img"
      muted
      loop
      controls={isMobile}
    />
  ) : (
    <img
      src={currentMedia}
      alt={`Slide-${currentIndex}`}
      className="carousel-img"
    />
  )}
</div>

<button
  onClick={nextSlide}
  className="nav-button-imagee nav-next"
  disabled={currentIndex === media.length - 1}
>
  ›
</button>

      {!isMobile && isVideo(currentMedia) && (
        <button onClick={togglePlayPause} className="play-pause-button">
          ▶ / ❚❚
        </button>
      )}
    </div>
  );
};

export default ImageCarousel;
