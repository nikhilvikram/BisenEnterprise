import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/categories.css";
import "../styles/home-slider-search.css";
import "../styles/product-grid.css";
import "../styles/home-page.css";
import { useDispatch, useSelector } from "react-redux";

// Icons
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";

// Assets (Fallbacks)
import saree1 from "../assets/saree1.jpg";
import saree2 from "../assets/saree2.jpg";
import saree3 from "../assets/saree3.jpg";
import saree10 from "../assets/saree10.jpg";
import nightwear from "../assets/nightwear.jpeg";

// Stores & Actions
import { TextileList } from "../store/textile-list-store";
import { addToCart, removeFromCart } from "../store/cartSlice";
import { saveScrollFor } from "../utils/scrollStore";
import { API_URL } from "../config"; // 🟢 Import Config

// ==========================================
// 1. HERO SLIDER (Unchanged)
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
              <button onClick={() => navigate("/category/Saree")}>
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

  const safeProducts = textileArray || [];

  // Best Sellers (Sort by reviews or just take first 4)
  const bestSellers = [...safeProducts]
    .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
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

  const removeWholeQty = (id) => dispatch(removeFromCart(id));

  // 🟢 HELPER: Fix Image URLs
  const getImgSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = API_URL.replace("/api", "");
    return `${baseUrl}${imagePath}`;
  };

  // 🟢 DYNAMIC CATEGORY IMAGE FINDER
  const getCategoryImage = (path, fallback) => {
    if (!textileArray || textileArray.length === 0) return fallback;

    const catSlug = path.split("/").pop(); // "Saree"
    if (!catSlug) return fallback;

    const cleanCat = catSlug.replace(/_/g, " ").toLowerCase().trim();

    // Find first product in this category
    const product = textileArray.find((p) => {
      const pCat = (p.category || "").replace(/_/g, " ").toLowerCase().trim();
      return pCat === cleanCat || pCat.includes(cleanCat);
    });

    if (product) {
      const rawImg = product.images?.[0] || product.image;
      return getImgSrc(rawImg);
    }

    return fallback;
  };

  // --- TOP 6 CATEGORIES (Updated Paths) ---
  const topCategories = [
    { name: "Signature Sarees", defaultImg: saree1, path: "/category/Saree" },
    {
      name: "Ready-to-Wear",
      defaultImg: saree3,
      path: "/category/Ready-to-wear_Saree",
    },
    { name: "Kurti Sets", defaultImg: saree10, path: "/category/Kurti_Set" },
    { name: "Co-ord Sets", defaultImg: saree2, path: "/category/Co-ord_Set" },
    { name: "Nauvari", defaultImg: saree1, path: "/category/Nauvari" },
    { name: "Nightwear", defaultImg: nightwear, path: "/category/Nightwear" },
  ];

  return (
    <div className="homepage">
      {/* HERO SLIDER */}
      <HeroSlider />

      {/* ===== TOP CATEGORIES (Dynamic) ===== */}
      <div className="container mt-4 category-box">
        <div className="section-header-flex">
          <h2 className="section-title">Shop By Category</h2>
        </div>

        {/* Simple 6-Item Grid */}
        <div className="category-grid-simple">
          {topCategories.map((cat, i) => {
            // 🟢 Get Real Image if available
            const displayImg = getCategoryImage(cat.path, cat.defaultImg);

            return (
              <div
                key={i}
                className="category-tile-premium"
                onClick={() => navigate(cat.path, { state: { from: "home" } })}
              >
                <div className="cat-premium-img">
                  <img src={displayImg} alt={cat.name} loading="lazy" />
                </div>
                <div className="cat-premium-label">{cat.name}</div>
              </div>
            );
          })}
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
            const rawImage =
              item.images?.length > 0 ? item.images[0] : item.image;

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
                  <img
                    src={getImgSrc(rawImage)}
                    alt={item.title}
                    loading="lazy"
                  />
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

                <div className="d-flex align-items-center gap-2 mt-2 home-best-actions">
                  {qty > 0 && (
                    <button
                      className="user_cart_minus show home-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWholeQty(itemId);
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
