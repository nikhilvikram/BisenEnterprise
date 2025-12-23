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
import { clearCartLocal } from "../store/cartSlice";

// Add a script loader function at the top (outside component)
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default COD
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ✅ CORRECT (Smart Switching)
  const backendUrl =
    import.meta.env.MODE === "production"
      ? "https://bisenenterprise.onrender.com" // <--- Your Live Render Backend
      : "http://localhost:5000"; // <--- Your Local Testing
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
    const currentToken = localStorage.getItem("auth-token");

    try {
      // ---------------------------------------------
      // OPTION A: CASH ON DELIVERY
      // ---------------------------------------------
      if (paymentMethod === "COD") {
        await axios.post(
          `${baseUrl}/orders/create`,
          {
            address: { ...address, zip: address.pincode }, // Backend needs 'zip'
            paymentMethod: "COD",
          },
          { headers: { "auth-token": localStorage.getItem("auth-token") } }
        );

        dispatch(clearCartLocal());
        alert("Order Placed Successfully! 🎉");
        navigate("/my-orders");
      }
      // ---------------------------------------------
      // OPTION B: ONLINE PAYMENT (RAZORPAY)
      // ---------------------------------------------
      else if (paymentMethod === "ONLINE") {
        // 1. Load Script
        const res = await loadRazorpayScript();
        if (!res) {
          alert("Razorpay SDK failed to load. Check connection.");
          return;
        }

        // 2. Create Order on Backend
        const orderData = await axios.post(`${baseUrl}/payment/create-order`, {
          amount: finalTotal, // Send amount from frontend state
        });

        // 3. Configure Options
        const options = {
          key: "rzp_test_RqpgHSApEpR2oR", // 🔴 REPLACE WITH YOUR KEY ID
          amount: orderData.data.amount,
          currency: "INR",
          name: "Bisen Enterprise",
          description: "Payment for Order",
          image: "https://your-logo-url.com/logo.png",
          order_id: orderData.data.id, // Order ID from backend

          handler: async function (response) {
            try {
              // Verify Signature
              const verifyRes = await axios.post(`${baseUrl}/payment/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.data.success) {
                // 5. IF VERIFIED -> SAVE ORDER TO DB
                await axios.post(
                  `${baseUrl}/orders/create`,
                  {
                    address: { ...address, zip: address.pincode },
                    paymentMethod: "ONLINE",
                    paymentId: response.razorpay_payment_id, // Save this reference!
                  },
                  {
                    headers: {
                      "auth-token": localStorage.getItem("auth-token"),
                    },
                  }
                );

                dispatch(clearCartLocal());
                alert("Payment Successful! Order Placed 🎉");
                navigate("/my-orders");
              }
            } catch (error) {
              alert("Payment verification failed.");
            }
          },
          prefill: {
            name: "User Name", // You can pull from AuthContext
            email: "user@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#ff3f6c", // Bisen Brand Color
          },
        };

        // 4. Open Popup
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setIsPlacing(false); // Stop loader so UI doesn't freeze
      }
    } catch (err) {
      console.error("Order Error:", err);
      const errMsg = err.response?.data?.msg || "Failed to place order.";
      alert(errMsg);
      setIsPlacing(false);
    }
  };
  // 2. Call Backend API
  // 🛑 NOTICE: We only send 'address'. The backend grabs items from the DB itself.
  // const response = await axios.post(
  //   `${baseUrl}/orders/create", // <--- Updated URL
  //   {
  //     address: {
  //       street: address.line1,
  //       city: address.city,
  //       zip: address.pincode, // Backend expects 'zip', frontend state is 'pincode'
  //     },
  //   },
  //   { headers: { "auth-token": localStorage.getItem("auth-token") } }
  // );

  // 3. Success Handling
  // Since backend wiped the DB cart, we must wipe the Redux/Frontend cart to match.
  //     dispatch(clearCartLocal()); // Use the synchronous clear action we made earlier

  //     alert("Order Placed Successfully! 🎉");
  //     navigate("/my-orders"); // Redirect to history
  //   } catch (err) {
  //     console.error("Order Error:", err);
  //     // specific error message from backend (e.g. "Cart is empty")
  //     const errMsg = err.response?.data?.msg || "Failed to place order.";
  //     alert(errMsg);
  //   } finally {
  //     setIsPlacing(false);
  //   }
  // };

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
          {/* PAYMENT SECTION */}
          <div className="checkout-section">
            <div className="section-header">
              <FaMoneyBillWave className="section-icon" />
              <h4>Payment Method</h4>
            </div>

            {/* OPTION 1: CASH ON DELIVERY */}
            <label
              className={`payment-radio ${
                paymentMethod === "COD" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("COD")}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <div className="radio-content">
                <span className="pay-title">Cash on Delivery (COD)</span>
                <span className="pay-sub">Pay cash at your doorstep</span>
              </div>
            </label>

            {/* OPTION 2: ONLINE PAYMENT */}
            <label
              className={`payment-radio ${
                paymentMethod === "ONLINE" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("ONLINE")}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
              />
              <div className="radio-content">
                <span className="pay-title">Online Payment (Razorpay)</span>
                <span className="pay-sub">UPI, Cards, Netbanking</span>
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
