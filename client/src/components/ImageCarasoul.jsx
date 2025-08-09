import React, { useState, useRef, useEffect, useCallback } from "react";
import "../styles/ImageCarousel.css";

const ImageCarousel = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const trackRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
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
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : prev));
  }, [pauseCurrentVideo, media.length]);

  const prevSlide = useCallback(() => {
    pauseCurrentVideo();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, [pauseCurrentVideo]);

  const togglePlayPause = () => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      if (video.paused) video.play();
      else video.pause();
    }
  };

  useEffect(() => {
    const slider = trackRef.current;
    if (!slider) return;

    let startX = 0;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;
      if (deltaX > 50) prevSlide();
      else if (deltaX < -50) nextSlide();
    };

    slider.addEventListener("touchstart", onTouchStart);
    slider.addEventListener("touchend", onTouchEnd);

    return () => {
      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchend", onTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  const slideWidth = 900; // fixed slide width as per your example
  const translateX = -currentIndex * slideWidth;

  return (
    <div className="carousel-wrapper" tabIndex={0} role="button">
      <button
        onClick={prevSlide}
        className="carousel-nav-button carousel-nav-prev"
        disabled={currentIndex === 0}
        aria-label="Previous Slide"
      >
        ‹
      </button>

      <div
        className="carousel-track"
        ref={trackRef}
        style={{
          transform: `translate3d(${translateX}px, 0, 0)`,
          width: `${media.length * slideWidth}px`,
        }}
      >
        {media.map((src, i) => (
          <div
            key={i}
            className="carousel-slide"
            tabIndex={-1}
            aria-hidden={currentIndex !== i}
            style={{ width: `${slideWidth}px` }}
          >
            {isVideo(src) ? (
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={src}
                className="carousel-media"
                muted
                loop
                controls={isMobile}
              />
            ) : (
              <img src={src} alt={`Slide-${i}`} className="carousel-media" />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={nextSlide}
        className="carousel-nav-button carousel-nav-next"
        disabled={currentIndex === media.length - 1}
        aria-label="Next Slide"
      >
        ›
      </button>

      {!isMobile && isVideo(media[currentIndex]) && (
        <button
          onClick={togglePlayPause}
          className="carousel-play-pause-button"
          aria-label="Play/Pause Video"
        >
          ▶ / ❚❚
        </button>
      )}

      {/* Thumbnails */}
      <div className="carousel-thumbnails" data-aut-id="gallery-thumbnail">
        {media.map((src, i) => (
          <button
            key={i}
            className={`carousel-thumbnail ${currentIndex === i ? "active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
            onClick={() => {
              pauseCurrentVideo();
              setCurrentIndex(i);
            }}
            aria-label={`Thumbnail ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
