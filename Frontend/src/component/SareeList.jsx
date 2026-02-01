import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/categories.css";
import "../styles/product-grid.css";
import "../styles/product-actions.css";
import "../styles/shared-buttons.css";
import { TextileList } from "../store/textile-list-store";
import { CartContext } from "../store/cart-context";
import { saveScrollFor } from "../utils/scrollStore";
import { addToCart, updateQty, removeFromCart } from "../store/cartSlice";
// 🟢 1. Import API_URL to get the base domain
import { API_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
const SareeList = () => {
  const { textileArray } = useContext(TextileList);
  // const { cart, dispatch } = useContext(CartContext);
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  // --- 3. REDUX SETUP ---
  const dispatch = useDispatch();

  // Read Cart from Redux Store
  const cartItems = useSelector((state) => state.cart.items);

  // 🟢 2. HELPER: Force Images to Backend Port
  const getImgSrc = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";

    // If it's already an AWS or full link, use it
    if (imagePath.startsWith("http")) return imagePath;

    // If it's a local pipeline path (starts with /output_website)
    // We need to point it to http://localhost:5000 (NOT 5173)

    // HACK: API_URL is usually "http://localhost:5000/api"
    // We need just "http://localhost:5000"
    const baseUrl = API_URL.replace("/api", "");

    return `${baseUrl}${imagePath}`;
  };

  const handleAddToCart = (id) => {
    // Dispatch to Context (which calls API)
    // dispatch({
    //   type: "ADD_TO_CART",
    //   payload: { productId: id, qty: 1 }, // Backend expects { productId, qty }
    // });
    // 4. Dispatch to Redux Thunk
    dispatch(addToCart({ productId: id, qty: 1 }));
  };

  // ✅ Robust Quantity Check with Logging
  const getQty = (itemId) => {
    if (!cartItems || cartItems.length === 0) return 0;

    const item = cartItems.find((c) => {
      // Backend sends productId as an OBJECT (populated), Static sends STRING.
      // Safely handle null/undefined
      const pId = c.productId;

      if (!pId) return false; // Skip malformed entries

      const cartProdId = pId._id || pId; // Extract ID string

      // Log comparison for debugging specific items if needed
      // console.log(`Checking Cart ID: ${cartProdId} vs Item ID: ${itemId}`);

      return cartProdId.toString() === itemId.toString();
    });

    return item ? item.qty : 0;
  };

  const removeWholeQty = (id) => {
    dispatch(removeFromCart(id));
  };

  // --- DEBUG LOGS START ---
  useEffect(() => {
    console.log("🔹 SareeList Rendered");
    console.log("📦 Products from Context (textileArray):", textileArray);
    console.log("🛒 Cart from Context:", cartItems);
  }, [textileArray, cartItems]);

  // Safety Check: If data isn't loaded yet, show loading
  if (!textileArray) {
    return <div className="container mt-4">Loading Products...</div>;
  }

  return (
    <div
      className="container category-page-wrapper"
      style={{ minHeight: "80vh" }}
    >
      {/* BACK BUTTON + HEADER (same as CategoryProductList) */}
      <div className="category-list-header mb-4 mt-3">
        <button
          className="app-back-btn"
          onClick={() => navigate("/HomePage")}
          type="button"
          aria-label="Back to home"
        >
          <FaArrowLeft className="me-2" />
          Back to Home
        </button>
        <h2
          className="section-title text-center mt-3"
          style={{ marginBottom: "5px" }}
        >
          Explore All Products
        </h2>
      </div>
      <p className="text-muted text-center mb-4">
        Found {textileArray?.length || 0} exclusive designs
      </p>

      <div className="bisen-grid">
        {textileArray.map((item) => {
          // Handle both MongoDB _id and Static id
          const itemId = item._id || item.id;

          if (!itemId) {
            console.error("❌ Item missing ID:", item);
            return null;
          }

          const qty = getQty(itemId);
          const rawImage =
            item.images?.length > 0 ? item.images[0] : item.image;
          return (
            <div key={itemId} className="bisen-card">
              {/* IMAGE */}
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

              {/* TITLE */}
              <h5 className="bisen-title">{item.title}</h5>

              {/* PRICE ROW */}
              <div className="bisen-price-row">
                <span className="new-price">₹{item.price}</span>
                <span className="old-price">
                  ₹{Math.round(item.price / (1 - (item.discount || 10) / 100))}
                </span>
                <span className="discount">{item.discount || 10}% OFF</span>
              </div>

              {/* RATING */}
              <div className="bisen-rating">
                {"⭐".repeat(item.rating || 4)}
                <span className="review-count">
                  ({item.reviews || 0} reviews)
                </span>
              </div>

              {/* ADD TO CART BUTTON */}
              {/* MINUS (Only show if in cart) */}
              {/* <button
                className={`user_cart_minus ${qty > 0 ? "show" : "hide"}`}
                onClick={() => removeWholeQty(itemId)}
              >
                Remove from cart
              </button>
              <button
                className={`bisen-cart-btn-small ${
                  getQty(item._id || item.id) > 0 ? "added" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item._id || item.id);
                }}
              >
                {getQty(item._id || item.id) > 0 ? "Added" : "Add to Cart 🛒"}
                {getQty(item._id || item.id) > 0 && (
                  <span className="card-badge">
                    {getQty(item._id || item.id)}
                  </span>
                )}
              </button> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SareeList;
