import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TextileList } from "../store/textile-list-store";
import { CartContext } from "../store/cart-context";
import { saveScrollFor } from "../utils/scrollStore";
import { addToCart, updateQty, removeFromCart } from "../store/cartSlice";
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
    <div className="container mt-4">
      {/* Check if CSS class exists */}
      <div className="bisen-grid">
        {textileArray.map((item) => {
          // Handle both MongoDB _id and Static id
          const itemId = item._id || item.id;

          if (!itemId) {
            console.error("❌ Item missing ID:", item);
            return null;
          }

          const qty = getQty(itemId);

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
                <img src={item.image} alt={item.title} />
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
