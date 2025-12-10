import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Icons
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";

// Assets
import saree1 from "../assets/saree1.jpg";
import saree2 from "../assets/saree2.jpg";
import saree3 from "../assets/saree3.jpg";
import saree10 from "../assets/saree10.jpg";
import nightwear from "../assets/nightwear.jpeg";
import jwellery from "../assets/jwellery.jpg";

// Stores & Actions
import { TextileList } from "../store/textile-list-store";
import { addToCart, removeFromCart } from "../store/cartSlice";
import { saveScrollFor } from "../utils/scrollStore";

// ==========================================
// 1. HERO SLIDER (Kept as requested)
// ==========================================
const HeroSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: saree1,
      title: "Stock Volume Low!",
      subtitle: "Grab your favorites before they're gone.",
      btnText: "Shop Now",
      bg: "linear-gradient(to right, #141E30, #243B55)",
    },
    {
      id: 2,
      image: saree2,
      title: "Flat 10% OFF",
      subtitle: "On your first purchase. Use Code: WELCOME10",
      btnText: "Claim Offer",
      bg: "linear-gradient(to right, #cc2b5e, #753a88)",
    },
    {
      id: 3,
      image: saree10,
      title: "Free Shipping",
      subtitle: "On all prepaid orders above ₹499",
      btnText: "Order Now",
      bg: "linear-gradient(to right, #D38312, #A83279)",
    },
  ];

  const delay = 5000;

  useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, isPaused]);

  const nextSlide = () =>
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () =>
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);

  // Swipe Logic
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  return (
    <div
      className="hero-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          style={{ background: slide.bg }}
        >
          <div className="slide-content">
            <div className="slide-text">
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
              <button onClick={() => navigate("/SareeList")}>
                {slide.btnText}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Controls */}
      <button className="slider-btn left" onClick={prevSlide}>
        <FaChevronLeft />
      </button>
      <button className="slider-btn right" onClick={nextSlide}>
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="slider-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN HOMEPAGE
// ==========================================
const HomePage = () => {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const { textileArray } = useContext(TextileList);

  // Redux Logic
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const bestSellers = [...textileArray]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 4);

  const getQty = (itemId) => {
    if (!cartItems || cartItems.length === 0) return 0;
    const item = cartItems.find((c) => {
      const pId = c.productId;
      if (!pId) return false;
      const cartProdId = pId._id || pId;
      return cartProdId.toString() === itemId.toString();
    });
    return item ? item.qty : 0;
  };

  const handleAddToCart = (id) =>
    dispatch(addToCart({ productId: id, qty: 1 }));
  const removeWholeQty = (id) => dispatch(removeFromCart(id));

  // --- TOP 6 CATEGORIES ---
  const topCategories = [
    { name: "Signature Sarees", img: saree1, path: "/SareeList" },
    { name: "Ready-to-Wear", img: saree3, path: "/SareeList" },
    { name: "Kurti Sets", img: saree10, path: "/KurtaList" },
    { name: "Co-ord Sets", img: saree2, path: "/SareeList" }, // Use actual co-ord img if avail
    { name: "Nauvari", img: saree1, path: "/SareeList" },
    { name: "Jewellery", img: jwellery, path: "/SareeList" },
  ];

  return (
    <div className="homepage">
      {/* HERO SLIDER */}
      <HeroSlider />

      {/* ===== TOP CATEGORIES (Clean & Premium) ===== */}
      <div className="container mt-4 category-box">
        <div className="section-header-flex">
          <h2 className="section-title">Shop By Category</h2>
        </div>

        {/* Simple 6-Item Grid */}
        <div className="category-grid-simple">
          {topCategories.map((cat, i) => (
            <div
              key={i}
              className="category-tile-premium"
              onClick={() => navigate(cat.path)}
            >
              <div className="cat-premium-img">
                <img src={cat.img} alt={cat.name} />
              </div>
              <div className="cat-premium-label">{cat.name}</div>
            </div>
          ))}
        </div>

        {/* Explore All Button */}
        <div className="explore-btn-wrapper">
          <button
            className="btn-explore-all"
            onClick={() => navigate("/categories")}
          >
            Explore All Categories <FaArrowRight />
          </button>
        </div>
      </div>

      {/* ===== BEST SELLERS ===== */}
      <h2 className="section-title mt-5">Best Sellers</h2>
      <div className="container mt-4 mb-5">
        <div className="bisen-grid">
          {bestSellers.map((item) => {
            const itemId = item._id || item.id;
            if (!itemId) return null;
            const qty = getQty(itemId);

            return (
              <div key={itemId} className="bisen-card">
                <div
                  className="bisen-img-box"
                  onClick={() => {
                    const key = `${pathname}${hash || ""}`;
                    saveScrollFor(key);
                    navigate(`/product/${itemId}`);
                  }}
                >
                  <img src={item.image} alt={item.title} />
                </div>

                <h5 className="bisen-title">{item.title}</h5>
                <div className="bisen-price-row">
                  <span className="new-price">₹{item.price}</span>
                  <span className="old-price">
                    ₹
                    {Math.round(item.price / (1 - (item.discount || 10) / 100))}
                  </span>
                  <span className="discount">{item.discount || 10}% OFF</span>
                </div>
                <div className="bisen-rating">
                  {"⭐".repeat(item.rating || 4)}{" "}
                  <span className="review-count">({item.reviews || 0})</span>
                </div>

                <div
                  className="d-flex align-items-center gap-2 mt-2"
                  style={{ width: "100%" }}
                >
                  {qty > 0 && (
                    <button
                      className="user_cart_minus show"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWholeQty(itemId);
                      }}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                        background: "white",
                        color: "red",
                        fontSize: "18px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
