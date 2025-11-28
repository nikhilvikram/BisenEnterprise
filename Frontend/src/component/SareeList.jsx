import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextileList } from "../store/textile-list-store";
import { CartContext } from "../store/cart-context";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { saveScrollFor } from "../utils/scrollStore";

const SareeList = () => {
  const { textileArray } = useContext(TextileList);
  const { cart, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (id) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { productId: id },
    });
  };
  // Get qty for each product
  const getQty = (id) => {
    const item = cart.find((c) => c.productId === id);
    return item ? item.qty : 0;
  };
  const { pathname, hash } = useLocation();

  return (
    <div className="container mt-4">
      <h3 className="mb-4" style={{ color: "var(--text-color)" }}>
        Saree Collection
      </h3>

      <div className="bisen-grid">
        {textileArray.map((item) => {
          const qty = getQty(item.id);

          return (
            <div key={item.id} className="bisen-card">
              {/* IMAGE */}
              <div
                className="bisen-img-box"
                onClick={() => {
                  const key = `${pathname}${hash || ""}`;
                  saveScrollFor(key);
                  navigate(`/product/${item.id}`);
                }}
              >
                <img src={item.image} alt={item.title} />
              </div>

              {/* TITLE */}
              <h5 className="bisen-title">{item.title}</h5>

              {/* CATEGORY */}
              <p className="bisen-category">{item.category}</p>

              {/* PRICE ROW */}
              <div className="bisen-price-row">
                <span className="new-price">₹{item.price}</span>
                <span className="old-price">
                  ₹{Math.round(item.price / (1 - item.discount / 100))}
                </span>
                <span className="discount">{item.discount}% OFF</span>
              </div>

              {/* RATING */}
              <div className="bisen-rating">
                {"⭐".repeat(item.rating)}
                <span className="review-count">({item.reviews})</span>
              </div>

              {/* ADD TO CART BUTTON */}
              <button
                className={`bisen-cart-btn-small ${qty > 0 ? "added" : ""}`}
                onClick={() => handleAddToCart(item.id)}
              >
                Add to Cart 🛒
                {qty > 0 && <span className="card-badge">{qty}</span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SareeList;
