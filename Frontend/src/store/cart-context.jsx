import { createContext, useReducer } from "react";

export const CartContext = createContext({
  cart: [], // only normalized: [{ productId, qty }]
  dispatch: () => {}, // function to change cart
});

// ------------------------------
// REDUCER
// ------------------------------
const cartReducer = (cart, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      // Extract productId from payload (normalized)
      const { productId, qty = 1 } = action.payload;

      // Check if product already exists in cart
      const existing = cart.find((c) => c.productId === productId);

      // If already exists → increase qty
      if (existing) {
        return cart.map((c) =>
          c.productId === productId ? { ...c, qty: c.qty + qty } : c
        );
      }

      // If not in cart → add entry { productId, qty }
      return [...cart, { productId, qty }];
    }

    case "UPDATE_QTY": {
      const { productId, qty } = action.payload;

      // qty <= 0 → remove from cart
      if (qty <= 0) {
        return cart.filter((c) => c.productId !== productId);
      }

      return cart.map((c) => (c.productId === productId ? { ...c, qty } : c));
    }

    case "REMOVE_FROM_CART":
      return cart.filter((c) => c.productId !== action.payload);

    case "CLEAR_CART":
      return [];

    default:
      return cart;
  }
};

// ------------------------------
// PROVIDER
// ------------------------------
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
