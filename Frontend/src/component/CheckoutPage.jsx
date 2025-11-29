import React, { useContext, useState } from "react";
import { CartContext } from "../store/cart-context";
import { TextileList } from "../store/textile-list-store";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, dispatch } = useContext(CartContext);
  const { textileArray } = useContext(TextileList);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [paymentMode] = useState("cod");
  const [showPopup, setShowPopup] = useState(false);

  const items = cart
    .map((ci) => {
      const product = textileArray.find(
        (p) => p.id.toString() === ci.productId.toString()
      );
      return { ...ci, product };
    })
    .filter((x) => x.product);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.qty * item.product.price,
    0
  );

  // -----------------------------------
  // PLACE ORDER FUNCTION (WORKING FIX)
  // -----------------------------------
  const placeOrder = () => {
    if (!address.trim()) return;

    setShowPopup(true);

    // Wait then clear cart + redirect
    setTimeout(() => {
      dispatch({ type: "CLEAR_CART" });
      navigate("/HomePage");
    }, 4000);
  };

  return (
    <div className="checkout-wrapper">
      {/* BACK BUTTON (SAME AS PRODUCT DETAIL) */}
      <div className="user_pd_header">
        <button className="user_pd_backbtn" onClick={() => navigate(-1)}>
          <span className="user_arrow_icon">←</span>
        </button>

        <div className="user_pd_header_title_box">
          <h4 className="user_pd_title_header">Checkout</h4>
        </div>
      </div>

      <h3 className="checkout-title">Delivery Details</h3>

      {/* ADDRESS */}
      <div className="checkout-card">
        <h4 className="section-title">Delivery Address</h4>
        <textarea
          rows="3"
          className="checkout-input"
          placeholder="Flat No, Street, Area, City - Pincode"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>
      </div>

      {/* COUPON */}
      <div className="checkout-card">
        <h4 className="section-title">Apply Coupon</h4>
        <input
          className="checkout-input"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
      </div>

      {/* ITEMS */}
      <div className="checkout-card">
        <h4 className="section-title">Order Summary</h4>

        {items.map(({ product, qty }) => (
          <div key={product.id} className="checkout-item">
            <img src={product.image} alt="" className="checkout-img" />
            <div className="checkout-info">
              <h5>{product.title}</h5>
              <p>Qty: {qty}</p>
            </div>
            <h5 className="checkout-price">₹{product.price * qty}</h5>
          </div>
        ))}

        <div className="checkout-total">
          <h4>Total:</h4>
          <h4>₹{totalAmount}</h4>
        </div>
      </div>

      {/* PAYMENT OPTIONS */}
      <div className="checkout-card">
        <h4 className="section-title">Payment Method</h4>

        <label className="payment-option">
          <input type="radio" checked readOnly />
          <span>Cash on Delivery (COD)</span>
        </label>

        <label className="payment-option disabled">
          <input type="radio" disabled />
          <span>UPI / Cards (Coming Soon)</span>
        </label>
      </div>

      {/* CONFIRM BUTTON */}
      <button
        className="place-order-btn"
        onClick={placeOrder}
        disabled={!address}
      >
        Confirm & Place Order
      </button>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="order-popup">
          <div className="order-popup-box animate-popup">
            <h2>🎉 Order Placed!</h2>
            <p>Your order will be delivered to:</p>

            <div className="popup-address-box">
              <p>{address}</p>
            </div>

            <p>
              <b>Payment:</b> Cash on Delivery
            </p>
            <p>
              <b>Total:</b> ₹{totalAmount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
