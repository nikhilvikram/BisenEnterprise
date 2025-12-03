import React, { useContext, useState } from "react";
import { CartContext } from "../store/cart-context";
import { TextileList } from "../store/textile-list-store";
import { AuthContext } from "../store/auth-context"; // Needed for token
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaTag,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";

const CheckoutPage = () => {
  const { cart, dispatch } = useContext(CartContext);
  const { textileArray } = useContext(TextileList);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    line1: "",
    city: "",
    pincode: "",
  });
  const [isPlacing, setIsPlacing] = useState(false);

  // ✅ ROBUST DATA MAPPING (Matches CartPage Logic)
  const items = cart
    .map((ci) => {
      const cartProdId = ci.productId._id || ci.productId;
      const product = textileArray.find((p) => {
        const prodId = p._id || p.id;
        return prodId?.toString() === cartProdId?.toString();
      });
      return product ? { ...ci, product } : null;
    })
    .filter((item) => item !== null);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.qty * item.product.price,
    0
  );

  const shipping = totalAmount > 500 ? 0 : 50;
  const finalTotal = totalAmount + shipping;

  // ✅ PLACE ORDER (Backend Connection)
  const placeOrder = async () => {
    if (!address.line1 || !address.city || !address.pincode) {
      alert("Please fill complete address details");
      return;
    }

    setIsPlacing(true);

    try {
      // Call Backend API
      await axios.post(
        "https://bisenenterprisebackend.onrender.com/api/orders/create",
        {
          address: {
            street: address.line1,
            city: address.city,
            zip: address.pincode,
          },
        },
        { headers: { "x-auth-token": token } }
      );

      // Success: Clear Context & Redirect
      dispatch({ type: "CLEAR_CART" }); // Optional: backend clears it, but good for UI sync
      alert("Order Placed Successfully! 🎉");
      navigate("/Orders"); // Redirect to My Orders page
    } catch (err) {
      console.error("Order Error:", err);
      alert("Failed to place order. Try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>Your Cart is Empty!</h3>
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

      <div className="row">
        {/* LEFT SIDE: FORMS */}
        <div className="col-md-8">
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
              <div className="d-flex gap-3 mt-3">
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
              <div>
                <span className="pay-title">Cash on Delivery (COD)</span>
                <span className="pay-sub">Pay cash at your doorstep</span>
              </div>
            </label>
            <label className="payment-radio disabled">
              <input type="radio" disabled />
              <div>
                <span className="pay-title">Online Payment (UPI/Card)</span>
                <span className="pay-sub">Coming Soon</span>
              </div>
            </label>
          </div>
        </div>

        {/* RIGHT SIDE: SUMMARY */}
        <div className="col-md-4">
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

            <hr />

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

            <hr />

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
