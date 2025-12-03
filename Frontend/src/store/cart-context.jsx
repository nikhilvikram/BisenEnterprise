import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./auth-context";

export const CartContext = createContext({
  cart: [],
  dispatch: () => {},
});

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token } = useContext(AuthContext);

  // ✅ HELPER: Get token from Context OR LocalStorage (Safe Fallback)
  const getToken = () => {
    return token || localStorage.getItem("token");
  };

  // 1. FETCH CART FROM DB ON LOAD
  useEffect(() => {
    const currentToken = getToken();
    if (currentToken) {
      axios
        .get("https://bisenenterprisebackend.onrender.com/api/cart", {
          headers: { "x-auth-token": currentToken },
        })
        .then((res) => {
          setCart(res.data.items || []);
        })
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [token]);

  // 2. HANDLE ACTIONS
  const dispatch = async (action) => {
    // ✅ CRITICAL FIX: Always get the freshest token
    const currentToken = getToken();

    console.log("Dispatching Action:", action.type, "Token:", currentToken);

    if (!currentToken) {
      alert("Please Login to use Cart");
      return;
    }

    const config = { headers: { "x-auth-token": currentToken } };

    try {
      if (action.type === "ADD_TO_CART") {
        const res = await axios.post(
          "https://bisenenterprisebackend.onrender.com/api/cart/add",
          action.payload,
          config
        );
        setCart(res.data.items);
      } else if (action.type === "REMOVE_FROM_CART") {
        const res = await axios.delete(
          `https://bisenenterprisebackend.onrender.com/api/cart/item/${action.payload}`,
          config
        );
        setCart(res.data.items);
      } else if (action.type === "UPDATE_QTY") {
        const res = await axios.put(
          "https://bisenenterprisebackend.onrender.com/api/cart/update",
          action.payload,
          config
        );
        setCart(res.data.items);
      } else if (action.type === "CLEAR_CART") {
        setCart([]);
      }
    } catch (error) {
      console.error("Cart Error:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
