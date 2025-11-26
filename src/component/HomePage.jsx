import { useNavigate } from "react-router-dom";
import saree1 from "../assets/saree1.jpg";
import saree2 from "../assets/saree2.jpg";
import saree3 from "../assets/saree3.jpg";
import bag from "../assets/bag.jpg";
import nightwear from "../assets/nightwear.jpeg";
import saree10 from "../assets/saree10.jpg";
import jwellery from "../assets/jwellery.jpg";
import footeware from "../assets/footware.webp";
import { useContext } from "react";
import { TextileList } from "../store/textile-list-store";

const HomePage = () => {
  const navigate = useNavigate();
  const { textileArray } = useContext(TextileList);
  // Sort by reviews (best selling)
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
      <div className="hero-banner">
        <img src={saree2} alt="Hero" className="hero-img" />
        <div className="hero-text">
          <h1>Festive Fashion Sale</h1>
          <p>Surat • Jaipur • Ahmedabad Collections</p>
          <button className="hero-btn" onClick={() => navigate("/SareeList")}>
            Shop Now
          </button>
        </div>
      </div>

      {/* ===== CATEGORIES ===== */}
      <div className="container mt-4">
        <h2 className="section-title">Shop By Categories</h2>

        <div className="category-row">
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
              className="category-cardx"
              onClick={() => navigate(cat.path)}
            >
              <img src={cat.img} alt={cat.title} className="category-imagex" />
              <div className="category-titlex">{cat.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BEST SELLERS ===== */}
      <div className="container mt-5">
        <h2 className="section-title">Best Sellers</h2>

        <div className="best-grid">
          {bestSellers.map((item) => (
            <div
              key={item.id}
              className="best-card"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img src={item.image} alt={item.title} className="best-img" />

              <div className="best-info">
                <p className="best-name">{item.title}</p>

                <p className="best-price">₹{item.price}</p>

                <p className="best-rating">
                  ⭐ {item.rating} ({item.reviews})
                </p>

                <button
                  className="best-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    navigate(`/product/${item.id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
