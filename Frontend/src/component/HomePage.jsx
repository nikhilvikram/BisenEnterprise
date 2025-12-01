import { useNavigate } from "react-router-dom";
import saree1 from "../assets/saree1.jpg";
import saree2 from "../assets/saree2.jpg";
import saree3 from "../assets/saree3.jpg";
import bag from "../assets/bag.webp";
import nightwear from "../assets/nightwear.jpeg";
import saree10 from "../assets/saree10.jpg";
import jwellery from "../assets/jwellery.jpg";
import footeware from "../assets/footware.webp";
import { useContext } from "react";
import { TextileList } from "../store/textile-list-store";
import BisenEnterprise_image from "../assets/BisenEnterprise_image.png";
import LandingHeroDesktop from "../assets/LandingHeroDesktop.png";
import LandingHeroMobile from "../assets/LandingHeroMobile.png";
const HomePage = () => {
  const navigate = useNavigate();
  const { textileArray } = useContext(TextileList);

  const bestSellers = [...textileArray]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 4);

  return (
    <div className="homepage">
      {/* ===== OFFER STRIP ===== */}
      <div className="offer-strip">
        <span>🔥 FLAT 50–80% OFF + FREE DELIVERY ON FIRST ORDER</span>
      </div>

      {/* ===== HERO BANNER ===== */}
      <div className="hero-banner redesigned-hero">
        <div className="image-container">
          <picture className="hero-img redesigned-hero-img">
            <source media="(max-width: 768px)" srcSet={LandingHeroMobile} />
            <source media="(min-width: 769px)" srcSet={LandingHeroDesktop} />
            <img src="desktop-image.jpg" alt="Image" />
          </picture>
        </div>
        <div className="hero-text redesigned-hero-text">
          <h1>Festive Fashion Sale</h1>
          <p>Surat • Jaipur • Ahmedabad Collections</p>

          <button className="hero-btn" onClick={() => navigate("/SareeList")}>
            Shop Now
          </button>
        </div>
      </div>

      {/* ===== CATEGORIES (Desktop Optimised) ===== */}
      <h2 className="section-title">Shop By Categories</h2>
      <div className="container mt-4">
        <div className="category-grid-responsive">
          {[
            { img: saree1, title: "Sarees", path: "/SareeList" },
            { img: saree10, title: "Kurtis", path: "/KurtaList" },
            { img: nightwear, title: "Nightwear", path: "/SareeList" },
            { img: jwellery, title: "Jewellery", path: "/SareeList" },
            { img: bag, title: "Bags", path: "/SareeList" },
            { img: footeware, title: "Footwear", path: "/SareeList" },
          ].map((cat, i) => (
            <div
              key={i}
              className="category-tile"
              onClick={() => navigate(cat.path)}
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="category-tile-img"
              />
              <div className="category-tile-title">{cat.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BEST SELLERS ===== */}
      {/* ===== BEST SELLERS ===== */}
      <div className="container mt-5">
        <h2 className="section-title">Best Sellers</h2>

        <div className="bisen-grid">
          {bestSellers.map((item) => (
            <div
              key={item.id}
              className="bisen-card"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <div className="bisen-img-box">
                <img src={item.image} alt={item.title} />
              </div>

              <h5 className="bisen-title">{item.title}</h5>

              <div className="bisen-price-row">
                <span className="new-price">₹{item.price}</span>
                <span className="old-price">
                  ₹{Math.round(item.price / (1 - item.discount / 100))}
                </span>
                <span className="discount">{item.discount}% OFF</span>
              </div>

              <div className="bisen-rating">
                {"⭐".repeat(item.rating)}
                <span className="review-count">({item.reviews})</span>
              </div>

              <button
                className="bisen-cart-btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${item.id}`);
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
