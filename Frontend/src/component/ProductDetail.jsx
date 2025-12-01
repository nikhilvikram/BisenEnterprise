import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { TextileList } from "../store/textile-list-store";
import { CartContext } from "../store/cart-context";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";
import { saveScrollFor } from "../utils/scrollStore";

const ProductDetail = () => {
  const { textileArray } = useContext(TextileList);
  const { id } = useParams();
  const navigate = useNavigate();
  const [animateCart, setAnimateCart] = React.useState(false);
  const { cart } = useContext(CartContext);
  const loc = useLocation();
  const currentKey = `${loc.pathname}${loc.hash || ""}`;

  const reduxDispatch = useDispatch();
  const wishlistItems = useSelector((s) => s.wishlist.items);

  const item = textileArray.find((p) => p.id.toString() === id);
  const cartItem = cart.find((c) => c.productId === item?.id);
  const qty = cartItem ? cartItem.qty : 0;
  const isInWishlist = wishlistItems.some((i) => i.id === item?.id);
  const { dispatch } = useContext(CartContext);
  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { productId: item.id },
    });
  };
  const handleAddToCartAnimated = () => {
    handleAddToCart(); // your existing add-to-cart logic

    setAnimateCart(true);

    setTimeout(() => {
      setAnimateCart(false);
    }, 300); // animation duration
  };
  const bestSellers = [...textileArray]
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
          <span>{"★".repeat(item.rating)}</span>
          <span className="user_pd_reviews">({item.reviews} reviews)</span>
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
        {/* WISHLIST */}
        <button
          className={`bisen-wishlist-btn ${isInWishlist ? "active" : ""}`}
          onClick={() =>
            reduxDispatch(
              isInWishlist ? removeFromWishlist(item.id) : addToWishlist(item)
            )
          }
        >
          {isInWishlist ? "♥ Wishlisted" : "♡ Wishlist"}
        </button>

        {/* MINUS */}
        <button
          className={`user_cart_minus ${qty > 0 ? "show" : "hide"}`}
          onClick={() =>
            dispatch({
              type: "UPDATE_QTY",
              payload: { productId: item.id, qty: qty - 1 },
            })
          }
        >
          −
        </button>

        {/* ADD */}
        <button
          className={`btn-cart cart-btn-wrapper 
      ${animateCart ? "cart-animate" : ""} 
      ${qty > 0 ? "cart-added" : ""}`}
          onClick={handleAddToCartAnimated}
        >
          Add 🛒
          {qty > 0 && <span className="cart-badge">{qty}</span>}
        </button>
      </div>
      {/* ============== MORE PRODUCTS SECTION ============== */}

      <div className="container mt-5">
        <h2 className="section-title">Related PRODUCTS</h2>

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

export default ProductDetail;
