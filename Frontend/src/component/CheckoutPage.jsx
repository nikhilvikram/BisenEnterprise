import React, { useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // 1. Use Redux
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaTag,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";

import { TextileList } from "../store/textile-list-store"; // Keep for product details if needed
import { clearCartServer } from "../store/cartSlice"; // Import the clear action
import { API_BASE_URL } from "../config"; // Or use your URL string
import { clearCartLocal } from "../store/cartSlice";
const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 2. Redux State
  const cartItems = useSelector((state) => state.cart.items);
  const { textileArray } = useContext(TextileList);

  // 3. Local State
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    pincode: "",
  });
  const [isPlacing, setIsPlacing] = useState(false);

  // 4. Robust Data Mapping (Redux + Catalogue)
  const items = cartItems
    .map((ci) => {
      // Handle MongoDB populated object OR string ID
      const cartProdId = ci.productId._id || ci.productId;

      // Find full details in catalogue
      const product = textileArray.find((p) => {
        const prodId = p._id || p.id;
        return prodId?.toString() === cartProdId?.toString();
      });

      return product ? { ...ci, product } : null;
    })
    .filter((item) => item !== null);

  // Calculations
  const totalAmount = items.reduce(
    (sum, item) => sum + item.qty * item.product.price,
    0
  );
  const shipping = totalAmount > 500 ? 0 : 50;
  const finalTotal = totalAmount + shipping;

  // 5. Place Order Function
  // ... imports and setup ...

  const placeOrder = async () => {
    // 1. Validation
    if (!address.line1 || !address.city || !address.pincode) {
      alert("Please fill complete address details");
      return;
    }

    setIsPlacing(true);
    const token = localStorage.getItem("token");

    try {
      // 2. Call Backend API
      // 🛑 NOTICE: We only send 'address'. The backend grabs items from the DB itself.
      const response = await axios.post(
        "https://bisenenterprisebackend.onrender.com/api/orders/create", // <--- Updated URL
        {
          address: {
            street: address.line1,
            city: address.city,
            zip: address.pincode, // Backend expects 'zip', frontend state is 'pincode'
          },
        },
        { headers: { "x-auth-token": token } }
      );

      // 3. Success Handling
      // Since backend wiped the DB cart, we must wipe the Redux/Frontend cart to match.
      dispatch(clearCartLocal()); // Use the synchronous clear action we made earlier

      alert("Order Placed Successfully! 🎉");
      navigate("/my-orders"); // Redirect to history
    } catch (err) {
      console.error("Order Error:", err);
      // specific error message from backend (e.g. "Cart is empty")
      const errMsg = err.response?.data?.msg || "Failed to place order.";
      alert(errMsg);
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mt-5 text-center empty-cart-container">
        <h3>Your Cart is Empty!</h3>
        <button
          className="btn-primary mt-3"
          onClick={() => navigate("/SareeList")}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container checkout-page-wrapper">
      <div className="checkout-header">
        <h3 className="fw-bold">Checkout</h3>
        <p className="text-muted">
          {items.length} Items • Total ₹{finalTotal}
        </p>
      </div>

      <div className="checkout-grid">
        {/* LEFT SIDE: FORMS */}
        <div className="checkout-left">
          {/* ADDRESS SECTION */}
          <div className="checkout-section">
            <div className="section-header">
              <FaMapMarkerAlt className="section-icon" />
              <h4>Delivery Address</h4>
            </div>

            <div className="address-form">
              <input
                className="checkout-input"
                placeholder="House No, Building, Street Area"
                value={address.line1}
                onChange={(e) =>
                  setAddress({ ...address, line1: e.target.value })
                }
              />
              <div className="form-row">
                <input
                  className="checkout-input"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
                <input
                  className="checkout-input"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* PAYMENT SECTION */}
          <div className="checkout-section">
            <div className="section-header">
              <FaMoneyBillWave className="section-icon" />
              <h4>Payment Method</h4>
            </div>

            <label className="payment-radio selected">
              <input type="radio" checked readOnly />
              <div className="radio-content">
                <span className="pay-title">Cash on Delivery (COD)</span>
                <span className="pay-sub">Pay cash at your doorstep</span>
              </div>
            </label>
            <label className="payment-radio disabled">
              <input type="radio" disabled />
              <div className="radio-content">
                <span className="pay-title">Online Payment</span>
                <span className="pay-sub">Coming Soon</span>
              </div>
            </label>
          </div>
        </div>

        {/* RIGHT SIDE: SUMMARY */}
        <div className="checkout-right">
          <div className="order-summary-card">
            <h5 className="summary-title">ORDER SUMMARY</h5>
            <div className="summary-items-list">
              {items.map(({ product, qty }) => (
                <div key={product._id || product.id} className="summary-item">
                  <span className="item-name">
                    {qty} x {product.title}
                  </span>
                  <span className="item-price">₹{product.price * qty}</span>
                </div>
              ))}
            </div>

            <hr className="dashed-line" />

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="text-success">
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>

            <hr className="dashed-line" />

            <div className="summary-total">
              <span>Total Payable</span>
              <span>₹{finalTotal}</span>
            </div>

            <button
              className="place-order-btn"
              onClick={placeOrder}
              disabled={isPlacing}
            >
              {isPlacing ? "Processing..." : "CONFIRM ORDER"}
            </button>

            <div className="secure-msg">
              <FaShieldAlt /> 100% Secure Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
