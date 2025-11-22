import React, { useContext } from "react";
import { CartContext } from "../store/cart-context";
const CartPage = () => {
  const { cart, dispatch } = useContext(CartContext);
  return (
    <div className="conatiner m-4">
      <h2>Your cart</h2>
      {cart.map((item) => (
        <div key={item.id}>
          <h5>{item.name}</h5>
          <img
            src={item.image}
            alt={item.title}
            className="img-fluid img-thumbnail"
          />
          <p>Qty: {item.qty}</p>
          <button
            onClick={() => {
              dispatch({ type: "REMOVE_FROM_CART", payload: item.id });
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
export default CartPage;
