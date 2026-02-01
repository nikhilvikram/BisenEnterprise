import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useContext, useState, useRef, useEffect } from "react"; // Added useRef
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import "../styles/product-detail.css";
import "../styles/product-grid.css";
import "../styles/product-actions.css";
import "../styles/badges.css";
import { TextileList } from "../store/textile-list-store";
// import { CartContext } from "../store/cart-context"; // Context (Commented out as you use Redux)
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import { saveScrollFor } from "../utils/scrollStore";
import { addToCart, updateQty, removeFromCart } from "../store/cartSlice";

const ProductDetail = () => {
  const { textileArray } = useContext(TextileList);
  const { id } = useParams();
  const navigate = useNavigate();
  const [animateCart, setAnimateCart] = useState(false);

  const loc = useLocation();
  const currentKey = `${loc.pathname}${loc.hash || ""}`;

  // --- 1. REDUX SETUP ---
  const dispatch = useDispatch();
  const reduxDispatch = useDispatch();

  // Read Cart from Redux Store
  const cartItems = useSelector((state) => state.cart.items);

  // Find item in Redux Cart
  const cartItem = cartItems.find((c) => {
    const pId = c.productId._id || c.productId;
    return pId === id;
  });
  const qty = cartItem ? cartItem.qty : 0;

  // Find product in Catalogue
  const item = textileArray.find((p) => p._id === id || p.id === id);

  // --- 2. IMAGE GALLERY LOGIC (NEW) ---
  // Normalize images: Use array if available, otherwise fallback to single string
  const productImages =
    item?.images?.length > 0 ? item.images : item?.image ? [item.image] : [];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const scrollRef = useRef(null);

  // Handle Scroll (Detect Swipe)
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const newIndex = Math.round(scrollLeft / offsetWidth);
      setActiveImgIndex(newIndex);
    }
  };

  // Handle Thumbnail Click
  const scrollToImage = (index) => {
    setActiveImgIndex(index);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.offsetWidth * index,
        behavior: "smooth",
      });
    }
  };

  // --- 3. WISHLIST REDUX ---
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist =
    item &&
    wishlistItems.some((i) => {
      const iId = i._id || i.id;
      const itemId = item._id || item.id;
      return iId?.toString() === itemId?.toString();
    });

  // --- HANDLERS ---
  const handleAddToCart = () => {
    dispatch(addToCart({ productId: id, qty: 1 }));
  };

  const handleAddToCartAnimated = () => {
    handleAddToCart();
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 300);
  };

  useEffect(() => {
    if (qty > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [qty]);

  const handleUpdateQty = (newQty) => {
    if (newQty < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQty({ productId: id, qty: newQty }));
    }
  };

  const removeWholeQty = (id) => {
    dispatch(removeFromCart(id));
  };

  // Related Products
  const bestSellers = [...textileArray]
    .filter((p) => p._id !== id && p.id !== id)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 8);

  if (!item) {
    return (
      <div className="user_notfound">
        <h3>Product Not Found</h3>
        <button className="user_btn_go" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 🎨 INTERNAL STYLES FOR GALLERY (Copy to CSS if preferred) */}
      <style>{`
        .gallery-container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow: visible;
        }
        /* The Swipeable Track */
        .gallery-scroll-track {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch; /* Smooth swipe on iOS */
          scrollbar-width: none; /* Hide scrollbar Firefox */
        }
        .gallery-scroll-track::-webkit-scrollbar {
          display: none; /* Hide scrollbar Chrome/Safari */
        }
        /* Individual Main Image */
        .gallery-main-img {
          min-width: 100%;
          scroll-snap-align: center;
          height: 350px; /* Adjust based on your design */
          object-fit: contain; /* Full product visible - no cropping */
          object-position: center;
          background: #f8f8f8;
          border-radius: 12px;
        }
        @media (max-width: 768px) {
          .gallery-main-img {
            object-fit: contain;
            background: #f5f5f5;
          }
        }
        body.dark .gallery-main-img {
          background: #1e1e1e;
        }
      `}</style>

      <div className="user_product_detail_wrapper">
        {/* HEADER SECTION */}
        <div className="user_pd_header">
          <button
            className="user_pd_backbtn"
            onClick={() => {
              saveScrollFor(currentKey);
              navigate(-1);
            }}
          >
            <span className="user_arrow_icon">←</span>
          </button>

          <div className="user_pd_header_title_box">
            <h4 className="user_pd_title_header">{item.title}</h4>
          </div>
        </div>

        {/* ============ NEW IMAGE GALLERY ============ */}
        <div className="user_pd_imgbox">
          <div className="gallery-container">
            {/* 1. Swipeable Main Images */}
            <div
              className="gallery-scroll-track"
              ref={scrollRef}
              onScroll={handleScroll}
            >
              {productImages.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`${item.title} - ${idx + 1}`}
                  className="gallery-main-img"
                />
              ))}
            </div>

            {/* 2. Thumbnails (Only show if > 1 image) */}
            {productImages.length > 1 && (
              <div className="gallery-thumbnails">
                {productImages.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Thumb ${idx}`}
                    className={`gallery-thumb ${
                      activeImgIndex === idx ? "active" : ""
                    }`}
                    onClick={() => scrollToImage(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {/* =========================================== */}

        {/* DETAILS */}
        <div className="user_pd_content">
          <span className="user_pd_category">{item.category}</span>

          <h2 className="user_pd_title">{item.title}</h2>

          <div className="user_pd_rating">
            <span>{"★".repeat(item.rating || 4)}</span>
            <span className="user_pd_reviews">
              ({item.reviews || 0} reviews)
            </span>
          </div>

          <div className="user_pd_price_block">
            <h3>₹{item.price}</h3>
            <p className="user_pd_discount">{item.discount}% OFF</p>
            <p className="user_pd_delivery">FREE Delivery Tomorrow</p>
          </div>

          <p className="user_pd_desc">{item.description}</p>
        </div>

        {/* STICKY BOTTOM BAR */}
        <div className="user_pd_sticky_bar_fixed">
          <div className="pd-action-row">
            <button
              className={`bisen-wishlist-btn pd-wishlist-btn ${
                isInWishlist ? "active" : ""
              }`}
              onClick={() => {
                reduxDispatch(
                  isInWishlist ? removeFromWishlist(id) : addToWishlist(id),
                );
              }}
            >
              <FaHeart className="pd-btn-icon" />
              {isInWishlist ? "Wishlisted" : "Wishlist"}
            </button>

            <button
              className={`btn-cart pd-cart-btn ${
                animateCart ? "cart-animate" : ""
              } ${qty > 0 ? "is-added" : ""}`}
              onClick={() =>
                qty > 0 ? navigate("/cart") : handleAddToCartAnimated()
              }
            >
              <FaShoppingBag className="pd-btn-icon" />
              {qty > 0 ? "Go to Bag" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* ============== MORE PRODUCTS SECTION ============== */}
      <div className="container mt-5 pd-related-section">
        <h2 className="section-title">Related Collection</h2>

        <div className="bisen-grid">
          {bestSellers.map((item) => (
            <div
              key={item._id || item.id}
              className="bisen-card"
              onClick={() => navigate(`/product/${item._id || item.id}`)}
            >
              <div className="bisen-img-box">
                {/* Updated Grid Image Logic */}
                <img
                  src={item.images?.length > 0 ? item.images[0] : item.image}
                  alt={item.title}
                />
              </div>

              <h5 className="bisen-title">{item.title}</h5>

              <div className="bisen-price-row">
                <span className="new-price">₹{item.price}</span>
                <span className="old-price">
                  ₹{Math.round(item.price / (1 - (item.discount || 10) / 100))}
                </span>
                <span className="discount">{item.discount}% OFF</span>
              </div>

              <div className="bisen-rating">
                {"⭐".repeat(item.rating || 4)}
                <span className="review-count">({item.reviews} reviews)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
