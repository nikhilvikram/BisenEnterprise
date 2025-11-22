import { createContext, useReducer } from "react";

export const CartContext = createContext({
  cart: [],
  dispatch: () => {},
});

const cartReducer = (cart, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = action.payload;
      const existing = cart.find((p) => p.id === product.id);
      if (existing) {
        return cart.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...cart, { ...product, qty: 1 }];
    }
    case "REMOVE_FROM_CART": {
      const id = action.payload;
      return cart.filter((p) => p.id !== id);
    }
    case "CLEAR_CART":
      return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;