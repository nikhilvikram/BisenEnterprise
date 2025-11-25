import React, { useContext } from "react";
import { CartContext } from "../store/cart-context";
import { TextileList } from "../store/textile-list-store";

const CartPage = () => {
  const { cart, dispatch } = useContext(CartContext);
  const { textileArray } = useContext(TextileList);

  const itemsWithProductDetails = cart
    .map((ci) => {
      const product = textileArray.find(
        (p) => p.id.toString() === ci.productId.toString()
      );
      return { ...ci, product };
    })
    .filter((item) => item.product);

  if (itemsWithProductDetails.length === 0) {
    return (
      <div className="empty-cart-container">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty"
          className="empty-cart-img"
        />
        <h3>Your Cart is Empty</h3>
        <p className="text-muted">Looks like you haven't added anything yet.</p>
      </div>
    );
  }

  const totalAmount = itemsWithProductDetails.reduce(
    (sum, item) => sum + item.qty * item.product.price,
    0
  );

  return (
    <div className="cart-wrapper">
      <h3 className="cart-title">Your Cart</h3>

      {/* CART ITEMS */}
      {itemsWithProductDetails.map(({ product, qty }) => (
        <div key={product.id} className="cart-item-card">
          <img src={product.image} alt={product.title} className="cart-img" />

          <div className="cart-details">
            <h5 className="cart-title-text">{product.title}</h5>
            <p className="cart-category">{product.category}</p>

            <p className="price-text">₹{product.price}</p>

            {/* Quantity Controller */}
            <div className="qty-box">
              <button
                className="qty-btn"
                onClick={() =>
                  dispatch({
                    type: "UPDATE_QTY",
                    payload: { productId: product.id, qty: qty - 1 },
                  })
                }
              >
                -
              </button>

              <span className="qty-count">{qty}</span>

              <button
                className="qty-btn"
                onClick={() =>
                  dispatch({
                    type: "UPDATE_QTY",
                    payload: { productId: product.id, qty: qty + 1 },
                  })
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="cart-price-side">
            <h5 className="line-total">₹{product.price * qty}</h5>

            <button
              className="remove-btn"
              onClick={() =>
                dispatch({ type: "REMOVE_FROM_CART", payload: product.id })
              }
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* TOTAL SUMMARY BOX */}
      <div className="cart-summary">
        <h4>Total Amount: ₹{totalAmount}</h4>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
