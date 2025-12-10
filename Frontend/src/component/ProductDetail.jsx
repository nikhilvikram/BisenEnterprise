import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { TextileList } from "../store/textile-list-store";
import { CartContext } from "../store/cart-context";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import { saveScrollFor } from "../utils/scrollStore";
// Import Icons for cleaner UI (optional, if you have them set up)
// import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { addToCart, updateQty, removeFromCart } from "../store/cartSlice";
const ProductDetail = () => {
  const { textileArray } = useContext(TextileList);
  const { id } = useParams(); // This is the Product ID from URL
  const navigate = useNavigate();
  const [animateCart, setAnimateCart] = useState(false);

  const loc = useLocation();
  const currentKey = `${loc.pathname}${loc.hash || ""}`;

  // --- 1. CART CONTEXT ---
  // const { cart, dispatch } = useContext(CartContext);

  // --- 3. FIND PRODUCT ---
  // Ensure we compare strings to avoid Type errors
  // const item = textileArray.find((p) => p._id === id || p.id === id);

  // --- 4. CHECK CART QUANTITY (BACKEND COMPATIBLE) ---
  // const cartItem = cart.find((c) => {
  //   // Backend populates productId as an Object { _id, title... }
  //   // But sometimes it might be just an ID string. Handle both.
  //   const cartProdId = c.productId._id || c.productId;
  //   return cartProdId.toString() === id;
  // });
  // const qty = cartItem ? cartItem.qty : 0;

  // --- 5. CHECK WISHLIST STATUS ---
  // const isInWishlist = wishlistItems.some((i) => i._id === id || i.id === id);

  // --- 3. REDUX SETUP ---
  const dispatch = useDispatch();

  // Read Cart from Redux Store
  const cartItems = useSelector((state) => state.cart.items);

  // Find item in Redux Cart (Handle MongoDB _id)
  const cartItem = cartItems.find((c) => {
    const pId = c.productId._id || c.productId;
    return pId === id;
  });
  const qty = cartItem ? cartItem.qty : 0;

  // Find product in Catalogue
  const item = textileArray.find((p) => p._id === id || p.id === id);
  // --- 2. WISHLIST REDUX ---
  const reduxDispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Check if item is in wishlist (Safe check)
  const isInWishlist =
    item &&
    wishlistItems.some((i) => {
      const iId = i._id || i.id;
      const itemId = item._id || item.id;
      return iId?.toString() === itemId?.toString();
    });
  // --- HANDLERS ---

  const handleAddToCart = () => {
    // Dispatch to Context (which calls API)
    // dispatch({
    //   type: "ADD_TO_CART",
    //   payload: { productId: id, qty: 1 }, // Backend expects { productId, qty }
    // });
    // 4. Dispatch to Redux Thunk
    dispatch(addToCart({ productId: id, qty: 1 }));
  };

  const handleAddToCartAnimated = () => {
    handleAddToCart();
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 300);
  };

  const handleUpdateQty = (newQty) => {
    // if (newQty < 1) {
    //   dispatch({ type: "REMOVE_FROM_CART", payload: id });
    // } else {
    //   // For simple update, we can reuse ADD logic or creating a specific UPDATE action
    //   // Since your backend ADD logic increments, we need a specific UPDATE logic or
    //   // calculate the difference.
    //   // Simplest for now: Call UPDATE_QTY action if your Context handles it
    //   dispatch({
    //     type: "UPDATE_QTY",
    //     payload: { productId: id, qty: newQty },
    //   });
    // }
    if (newQty < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQty({ productId: id, qty: newQty }));
    }
  };
  const removeWholeQty = (id) => {
    dispatch(removeFromCart(id));
  };
  // Related Products (Logic remains same)
  const bestSellers = [...textileArray]
    .filter((p) => p._id !== id && p.id !== id) // Don't show current item
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 4);
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

      {/* IMAGE */}
      <div className="user_pd_imgbox">
        <img src={item.image} alt={item.title} />
      </div>

      {/* DETAILS */}
      <div className="user_pd_content">
        <span className="user_pd_category">{item.category}</span>

        <h2 className="user_pd_title">{item.title}</h2>

        <div className="user_pd_rating">
          <span>{"★".repeat(item.rating || 4)}</span>
          <span className="user_pd_reviews">({item.reviews || 0} reviews)</span>
        </div>

        <div className="user_pd_price_block">
          <h3>₹{item.price}</h3>
          <p className="user_pd_discount">{item.discount}% OFF</p>
          <p className="user_pd_delivery">FREE Delivery Tomorrow</p>
        </div>

        <p className="user_pd_desc">{item.description}</p>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div
        className={`user_pd_sticky_bar_fixed ${qty > 0 ? "three-btns" : ""}`}
      >
        <div className="sticky-row-top">
          {/* 3. GO TO BAG BUTTON (Visible ONLY if Qty > 0) */}
          {qty > 0 && (
            <button className="btn-go-bag" onClick={() => navigate("/cart")}>
              GO TO BAG <span style={{ marginLeft: "5px" }}>→</span>
            </button>
          )}
        </div>
        <div className="sticky-row-bottom">
          {/* WISHLIST */}
          <button
            className={`bisen-wishlist-btn ${isInWishlist ? "active" : ""}`}
            onClick={() => {
              // Dispatch Async Thunk (sends API call)
              reduxDispatch(
                isInWishlist ? removeFromWishlist(id) : addToWishlist(id)
              );
            }}
          >
            {isInWishlist ? "♥ Wishlisted" : "♡ Wishlist"}
          </button>
          {/* ADD BUTTON */}
          <button
            className={`btn-cart cart-btn-wrapper 
    ${animateCart ? "cart-animate" : ""} 
    ${qty > 0 ? "cart-added" : ""}`}
            onClick={handleAddToCartAnimated}
          >
            <span className="btn-cart-content">
              {qty > 0 ? `Add again 🛒` : "Add 🛒"}
            </span>

            {qty > 0 && <span className="icon-badge">{qty}</span>}
          </button>

          {/* REMOVE + MINUS STACK */}
          <div className="remove_stack">
            <button
              className={`user_cart_minus removebtn ${
                qty > 0 ? "show" : "hide"
              }`}
              onClick={() => removeWholeQty(item._id || item.id)}
            >
              Remove
            </button>

            <button
              className={`user_cart_minus ${qty > 0 ? "show" : "hide"}`}
              onClick={() => handleUpdateQty(qty - 1)}
            >
              −
            </button>
          </div>
        </div>
        {/* PLUS (Only show if in cart - optional design choice to split button) */}
        {/* If you want a +/- counter style instead of just "Add", you can add a Plus button here too */}
      </div>

      {/* ============== MORE PRODUCTS SECTION ============== */}
      <div className="container mt-5">
        <h2 className="section-title">Related PRODUCTS</h2>

        <div className="bisen-grid">
          {bestSellers.map((item) => (
            <div
              key={item._id || item.id}
              className="bisen-card"
              onClick={() => navigate(`/product/${item._id || item.id}`)}
            >
              <div className="bisen-img-box">
                <img src={item.image} alt={item.title} />
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

              <button
                className="bisen-cart-btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${item._id || item.id}`);
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

export default ProductDetail;
