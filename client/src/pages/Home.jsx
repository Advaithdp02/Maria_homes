import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";


const API_URL = process.env.REACT_APP_API_URL;

// Sample data
const testimonials = [
  { id: 1, name: "Anjali Nair", message: "Maria Homes turned our vision into reality. Professional and timely service!", image: "/assets/profile1.webp", service: "Renovation" },
  { id: 2, name: "Ramesh Menon", message: "Exceptional renovation work! Highly recommend their team.", image: "/assets/profile2.jpeg", service: "Renovation" },
  { id: 3, name: "Sneha Thomas", message: "Very responsive and detailed. Loved our new villa!", image: "/assets/profile3.avif", service: "Construction" },
  { id: 4, name: "Joseph Paul", message: "Excellent craftsmanship and transparency throughout the project.", image: "/assets/profile4.jpg", service: "Construction" },
];

const services = [
  { title: "Construction", img: "/assets/img1.jpg", description: "Build your dream home from the ground up. We offer complete residential and commercial construction services, from planning to handover — built with quality materials and expert supervision.", link: "/construction" },
  { title: "Renovation", img: "/assets/img2.jpg", description: "Transform your existing space. Whether it's a kitchen, a full-home remodel, or exterior face lift, our renovation experts breathe new life into old spaces.", link: "/renovation" },
  { title: "Real Estate", img: "/assets/img3.jpg", description: "Find the right property with confidence. We help clients buy and sell properties with market insight, professional support, and complete transparency.", link: "/listings" },
];

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState([]);

  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.2 });

  const [fRef1, fInView1] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [fRef2, fInView2] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [fRef3, fInView3] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [fRef4, fInView4] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [fRef5, fInView5] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [fRef6, fInView6] = useInView({ triggerOnce: true, threshold: 0.2 });


  const [tRef1, tInView1] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [tRef2, tInView2] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [tRef3, tInView3] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [tRef4, tInView4] = useInView({ triggerOnce: true, threshold: 0.2 });
  

  useEffect(() => {
    const scrollTarget = sessionStorage.getItem("scrollToSection");
    if (scrollTarget) {
      sessionStorage.removeItem("scrollToSection");
      const el = document.getElementById(scrollTarget);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }

    // Fetch only featured listings
    axios
      .get(`${API_URL}/api/listings/featured`)
      .then((res) => setFeaturedListings(res.data.slice(0, 6)))
      .catch((err) => console.error("Failed to fetch featured listings:", err));
  }, []);
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="content">
        <h1 className="hiddenHeading">MARIA HOMES</h1>

        {/* Hero Section */}
        <section className="start-section" id="start">
  <motion.div
    className="start-left"
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <motion.h1 
    
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3,duration: 0.9 ,ease: "easeOut" }}
    >
      “Transforming Spaces.”<br />Building Dreams.”
    </motion.h1>

    <motion.div
      className="button-group"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <Link to="/renovation" className="start-btn">Renovation</Link>
      <Link to="/listings" className="start-btn">Listings</Link>
      <Link to="/construction" className="start-btn">Construction</Link>
    </motion.div>
  </motion.div>

  <motion.img
    src="/assets/startingHouse.png"
    alt="House"
    className="hero-img"
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.8, duration: 0.8 }}
  />
</section>

        {/* About Section */}
        <section className="about-section" id="about">
          <div className="about-top">
            <div className="about-img">
              <img src="/assets/img1.jpg" alt="About Maria Homes" />
            </div>
            <div className="about-text">
              <h2>About Us</h2>
              <p>At Maria Homes, we specialize in transforming spaces from the ground up. With a passion for quality construction, timeless renovation, and smart real estate solutions, we’ve been helping families and businesses turn their dreams into reality for over a decade.</p>
              <ul>
                <li>Expert Craftsmanship</li>
                <li>Complete Solutions</li>
                <li>Experienced Team</li>
                <li>Client-First Approach</li>
              </ul>
            </div>
          </div>
          <div className="about-tags">
            <div className="tag-box"><h3>10+ <br /> Years</h3></div>
            <div className="tag-box"><h3>150+ <br /> Projects</h3></div>
            <div className="tag-box"><h3>50+ <br /> Happy Families</h3></div>
          </div>
        </section>

        {/* Services */}
        <section className="services-section" id="services">
          <h2 className="section-title">Our Services</h2>
          <p className="section-desc">Whether you're building a new home, upgrading your current one, or searching for the perfect property — we’ve got you covered.</p>
          <div className="services-cards">
            <motion.div ref={ref1} className="service-card" initial={{ opacity: 0, y: 40 }} animate={inView1 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              <h3>{services[0].title}</h3>
              <img src={services[0].img} alt={services[0].title} />
              <p>{services[0].description}</p>
              <Link to={services[0].link} className="service-btn">{services[0].title}</Link>
            </motion.div>
            <motion.div ref={ref2} className="service-card" initial={{ opacity: 0, y: 40 }} animate={inView2 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}>
              <h3>{services[1].title}</h3>
              <img src={services[1].img} alt={services[1].title} />
              <p>{services[1].description}</p>
              <Link to={services[1].link} className="service-btn">{services[1].title}</Link>
            </motion.div>
            <motion.div ref={ref3} className="service-card" initial={{ opacity: 0, y: 40 }} animate={inView3 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 }}>
              <h3>{services[2].title}</h3>
              <img src={services[2].img} alt={services[2].title} />
              <p>{services[2].description}</p>
              <Link to={services[2].link} className="service-btn">{services[2].title}</Link>
            </motion.div>
          </div>
        </section>

        {/* Featured */}
        {/* Featured */}
<section id="featured" className="featured-section">
  <h2 className="section-title">Featured Listings</h2>
  <p className="section-description">
    A glimpse into our most trusted work — beautifully crafted homes, thoughtful renovations, and select real estate listings that reflect our standard of excellence.
  </p>

  {/** Refs for 6 cards */}
  {(() => {
    const featuredRefs = [fRef1, fRef2, fRef3, fRef4, fRef5, fRef6];
    const featuredInViews = [fInView1, fInView2, fInView3, fInView4, fInView5, fInView6];

    return (
      <div className="featured-cards-container">
        {featuredListings.map((listing, index) => (
          <Link to={`/listing/${listing._id}`} key={listing._id} className="featured-card-link">
          <motion.div
            key={listing._id}
            ref={featuredRefs[index]}
            className="featured-card"
            initial={{ opacity: 0, y: 40 }}
            animate={featuredInViews[index] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.3, ease: "easeInOut" } }}
          >
            <img src={listing.images?.[0]} alt={listing.title} />
            <h3 className="featured-title">{listing.title}</h3>
            <p className="featured-location">{listing.location}</p>
            <p>{listing.shortDescription}</p>
            <Link to={`/listing/${listing._id}`} className="featured-btn">View More</Link>
          </motion.div>
          </Link>
        ))}
      </div>
    );
  })()}
</section>



        {/* Testimonials */}
        <section className="testimonial-section" id="reviews">
          <h2 className="section-title">What Our Customers Say About Us</h2>
          <p className="section-description">Real experiences from homeowners and investors who trusted Maria Homes with their dreams.</p>
          <div className="testimonial-grid">
            <motion.div ref={tRef1} className="testimonial-card" initial={{ opacity: 0, y: 40 }} animate={tInView1 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              <div className="testimonial-top">
                <img src={testimonials[0].image} alt={testimonials[0].name} className="testimonial-img" />
                <p className="testimonial-message">{testimonials[0].message}</p>
              </div>
              <div className="testimonial-name">{testimonials[0].name} | {testimonials[0].service}</div>
            </motion.div>

            <motion.div ref={tRef2} className="testimonial-card" initial={{ opacity: 0, y: 40 }} animate={tInView2 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="testimonial-top">
                <img src={testimonials[1].image} alt={testimonials[1].name} className="testimonial-img" />
                <p className="testimonial-message">{testimonials[1].message}</p>
              </div>
              <div className="testimonial-name">{testimonials[1].name} | {testimonials[1].service}</div>
            </motion.div>

            <motion.div ref={tRef3} className="testimonial-card" initial={{ opacity: 0, y: 40 }} animate={tInView3 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 }}>
              <div className="testimonial-top">
                <img src={testimonials[2].image} alt={testimonials[2].name} className="testimonial-img" />
                <p className="testimonial-message">{testimonials[2].message}</p>
              </div>
              <div className="testimonial-name">{testimonials[2].name} | {testimonials[2].service}</div>
            </motion.div>

            <motion.div ref={tRef4} className="testimonial-card" initial={{ opacity: 0, y: 40 }} animate={tInView4 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.6 }}>
              <div className="testimonial-top">
                <img src={testimonials[3].image} alt={testimonials[3].name} className="testimonial-img" />
                <p className="testimonial-message">{testimonials[3].message}</p>
              </div>
              <div className="testimonial-name">{testimonials[3].name} | {testimonials[3].service}</div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
