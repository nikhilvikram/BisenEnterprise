import React, { useContext } from "react";
import { CartContext } from "../store/cart-context";
import { TextileList } from "../store/textile-list-store";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQty } from "../store/cartSlice";

const CartPage = () => {
  const { textileArray } = useContext(TextileList);
  const navigate = useNavigate();

  // --- 3. REDUX SETUP ---
  const dispatch = useDispatch();
  // Read Cart from Redux Store
  const cart = useSelector((state) => state.cart.items);
  ``;

  // ✅ FIX: Robust Logic to Match Cart Items with Product Details
  const cartItems = cart
    .map((cartItem) => {
      // 1. Extract the ID string safely (Backend might send Object or String)
      const cartProductId = cartItem.productId._id || cartItem.productId;

      // 2. Find the matching product in your Catalogue (Handle _id and id)
      const product = textileArray.find((p) => {
        const prodId = p._id || p.id;
        return prodId?.toString() === cartProductId?.toString();
      });

      return product ? { ...cartItem, product } : null;
    })
    .filter((item) => item !== null); // Remove any nulls if product not found
  const qty = cartItems ? cartItems.qty : 0;
  // --- CALCULATIONS ---
  const totalMRP = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );
  const discount = Math.round(totalMRP * 0.1); // Example: 10% discount logic
  const shipping = totalMRP > 500 ? 0 : 50; // Free shipping above 500
  const finalAmount = totalMRP - discount + shipping;

  // --- HANDLERS ---
  const handleUpdateQty = (id, newQty) => {
    if (newQty < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQty({ productId: id, qty: newQty }));
    }
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  // --- EMPTY STATE ---
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <img
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
          alt="Empty Cart"
          className="empty-cart-img"
        />
        <h3>Your Cart is Empty</h3>
        <p className="text-muted">Looks like you haven't added anything yet.</p>
        <button
          className="bisen-btn-primary mt-3"
          onClick={() => navigate("/SareeList")}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container cart-page-wrapper">
      {/* PAGE HEADER */}
      <div className="cart-header mb-4">
        <h3 className="fw-bold">Shopping Cart ({cartItems.length} Items)</h3>
      </div>

      <div className="row">
        {/* LEFT: CART ITEMS LIST */}
        <div className="col-lg-8">
          <div className="cart-items-list">
            {cartItems.map(({ product, qty }) => {
              // Ensure we have a valid ID for actions
              const pid = product._id || product.id;

              return (
                <div key={pid} className="bisen-cart-card">
                  {/* Image */}
                  <div
                    className="cart-img-wrapper"
                    onClick={() => navigate(`/product/${pid}`)}
                  >
                    <img
                      src={
                        product.images?.length > 0
                          ? product.images[0]
                          : product.image
                      }
                      alt={product.title}
                    />
                  </div>

                  {/* Info */}
                  <div className="cart-info">
                    <div className="d-flex justify-content-between">
                      <h5 className="cart-product-title">{product.title}</h5>
                      <button
                        className="btn-trash"
                        onClick={() => removeItem(pid)}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <p className="cart-product-cat">{product.category}</p>

                    <div className="cart-pricing">
                      <span className="current-price">₹{product.price}</span>
                      <span className="mrp-price">
                        ₹{Math.round(product.price * 1.2)}
                      </span>
                      <span className="off-text">20% OFF</span>
                    </div>

                    {/* Qty Control */}
                    <div className="cart-actions">
                      <div className="qty-selector">
                        <button
                          onClick={() => handleUpdateQty(pid, qty - 1)}
                          disabled={qty <= 1}
                        >
                          −
                        </button>
                        <span>{qty}</span>
                        <button onClick={() => handleUpdateQty(pid, qty + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: PRICE DETAILS (Sticky) */}
        <div className="col-lg-4">
          <div className="price-summary-card">
            <h5 className="summary-title">PRICE DETAILS</h5>
            <hr />

            <div className="summary-row">
              <span>Price ({cartItems.length} items)</span>
              <span>₹{totalMRP}</span>
            </div>

            <div className="summary-row discount-text">
              <span>Discount</span>
              <span>− ₹{discount}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className={shipping === 0 ? "free-text" : ""}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>

            <hr className="dashed-line" />

            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span>₹{finalAmount}</span>
            </div>

            <button
              className="checkout-btn-full"
              onClick={() => navigate("/Checkout")}
            >
              PLACE ORDER
            </button>

            <div className="secure-msg">
              <FaShieldAlt className="icon" /> Safe and Secure Payments.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
