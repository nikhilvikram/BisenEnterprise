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
  const item = textileArray.find((p) => p.id.toString() === id);
  // Get this product's qty
  const cartItem = cart.find((c) => c.productId === item.id);
  const totalQuantityForThisItem = cartItem ? cartItem.qty : 0;

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
  // Wishlist
  const reduxDispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((i) => i.id === item.id);

  if (!item) {
    return (
      <div className="text-center mt-5">
        <h3>No product found 😔</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container product-detail-container">
      <button
        className="btn btn-primary mt-3"
        onClick={() => {
          saveScrollFor(currentKey); // save current product page scroll
          console.debug("GoBack: saved scroll for", currentKey, window.scrollY);
          navigate(-1);
        }}
      >
        Go Back
      </button>

      <div className="row g-4">
        {/* LEFT: PRODUCT IMAGE */}
        <div className="col-md-6 text-center">
          <div className="premium-img-box">
            <img
              src={item.image}
              alt={item.title}
              className="premium-main-img"
            />
          </div>

          {/* Buttons under image (mobile also) */}
          <div className="mt-3 d-flex justify-content-center gap-3">
            {/* Add to Cart Button */}
            <button
              className={`btn-cart cart-btn-wrapper 
             ${animateCart ? "cart-animate" : ""} 
             ${totalQuantityForThisItem > 0 ? "cart-added" : ""}`}
              onClick={handleAddToCartAnimated}
            >
              Add to Cart 🛒
              {/* Floating Quantity Badge */}
              {totalQuantityForThisItem > 0 && (
                <span className="cart-badge">{totalQuantityForThisItem}</span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              className={`bisen-wishlist-btn ${isInWishlist ? "active" : ""}`}
              onClick={() => {
                reduxDispatch(
                  isInWishlist
                    ? removeFromWishlist(item.id)
                    : addToWishlist(item)
                );
              }}
            >
              {/* Heart SVG */}
              <span className="wishlist-icon">
                {isInWishlist ? (
                  <svg viewBox="0 0 24 24" className="heart filled">
                    <path d="M12 21s-6.7-4.4-9.6-8.3C-1.2 8.7.4 4.2 4.1 2.5 6.6 1.3 9.4 2 12 4.5 14.6 2 17.4 1.3 20 2.5c3.6 1.7 5.2 6.2 1.6 10.2C18.7 16.6 12 21 12 21z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="heart outline">
                    <path d="M16.8 3.1c-1.9 0-3.6.9-4.8 2.4C10.8 4 9.1 3.1 7.2 3.1 3.8 3.1 1 5.9 1 9.3c0 4.9 5.3 8.6 10.2 12.4.5.4 1.1.4 1.6 0C17.7 17.9 23 14.2 23 9.3c0-3.4-2.8-6.2-6.2-6.2z" />
                  </svg>
                )}
              </span>

              {isInWishlist ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
        </div>
        {/* RIGHT: DETAILS */}
        <div className="col-md-6 premium-details">
          <span className="badge bg-light text-dark category-badge">
            {item.category}
          </span>

          <h2 className="premium-title mt-2">{item.title}</h2>

          {/* Rating */}
          <div className="premium-rating mt-2">
            <span className="stars">
              {"★".repeat(item.rating)}
              {"☆".repeat(5 - item.rating)}
            </span>
            <span className="reviews">({item.reviews} reviews)</span>
          </div>

          {/* Price Block */}
          <div className="premium-price-block mt-3">
            <h3 className="price-text">₹{item.price}</h3>
            <p className="discount-text">{item.discount}% OFF</p>
            <p className="delivery-text">FREE Delivery Tomorrow</p>
          </div>

          {/* Description */}
          <p className="premium-description mt-3">{item.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
