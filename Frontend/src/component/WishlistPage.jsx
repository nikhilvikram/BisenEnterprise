import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../store/wishlistSlice";
import { CartContext } from "../store/cart-context";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const WishlistPage = () => {
  const items = useSelector((state) => state.wishlist.items);
  const reduxDispatch = useDispatch();

  const { dispatch: cartDispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const moveToCart = (e, item) => {
    e.stopPropagation();
    const id = item._id || item.id;

    cartDispatch({
      type: "ADD_TO_CART",
      payload: { productId: id, qty: 1 },
    });

    reduxDispatch(removeFromWishlist(id));
  };

  const removeHandler = (e, id) => {
    e.stopPropagation();
    reduxDispatch(removeFromWishlist(id));
  };

  if (!items || items.length === 0) {
    return (
      <div className="empty-wishlist-container">
        <img
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
          alt="Empty Wishlist"
          className="empty-wishlist-img"
        />
        <h3>Your Wishlist is Empty</h3>
        <p className="text-muted">Save items you love here to buy later.</p>
        <button
          className="bisen-btn-primary mt-3"
          onClick={() => navigate("/SareeList")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container wishlist-wrapper">
      <h3 className="wishlist-title">
        My Wishlist{" "}
        <span className="wishlist-count">({items.length} Items)</span>
      </h3>

      <div className="wishlist-grid">
        {items.map((item) => {
          const itemId = item._id || item.id;

          // ✅ FIX: Safe Title Check (Prevents Crash)
          const safeTitle =
            item.title || item.name || "Product Name Unavailable";

          return (
            <div
              key={itemId}
              className="wishlist-card"
              onClick={() => navigate(`/product/${itemId}`)}
            >
              <button
                className="wishlist-close-btn"
                onClick={(e) => removeHandler(e, itemId)}
              >
                ✕
              </button>

              <div className="wishlist-img-box">
                <img
                  src={item.images?.length > 0 ? item.images[0] : item.image}
                  alt={safeTitle}
                />
              </div>

              <div className="wishlist-details">
                <h5 className="wishlist-product-name">
                  {/* ✅ FIX: Use safeTitle here */}
                  {safeTitle.length > 25
                    ? safeTitle.substring(0, 25) + "..."
                    : safeTitle}
                </h5>

                <div className="wishlist-price-row">
                  <span className="price">₹{item.price || 0}</span>
                  <span className="cut-price">
                    ₹{Math.round((item.price || 0) * 1.3)}
                  </span>
                  <span className="offer">(30% OFF)</span>
                </div>
              </div>

              <button
                className="move-to-bag-btn"
                onClick={(e) => moveToCart(e, item)}
              >
                <FaShoppingCart className="me-2" /> Move to Bag
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
