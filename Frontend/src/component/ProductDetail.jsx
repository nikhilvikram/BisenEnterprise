import { useParams, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { TextileList } from "../store/textile-list-store";
import { CartContext } from "../store/cart-context";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";

const ProductDetail = () => {
  const { textileArray } = useContext(TextileList);
  const { id } = useParams();
  const navigate = useNavigate();
  const [animateCart, setAnimateCart] = React.useState(false);

  const item = textileArray.find((p) => p.id.toString() === id);

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
              className={`btn-cart ${animateCart ? "cart-animate" : ""}`}
              onClick={handleAddToCartAnimated}
            >
              Add to Cart 🛒
            </button>

            {/* Wishlist Button */}
            <button
              className={`btn-wishlist ${isInWishlist ? "active-heart" : ""}`}
              onClick={() =>
                reduxDispatch(
                  isInWishlist
                    ? removeFromWishlist(item.id)
                    : addToWishlist(item)
                )
              }
            >
              {isInWishlist ? "💗 Wishlisted" : "🤍 Wishlist"}
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
