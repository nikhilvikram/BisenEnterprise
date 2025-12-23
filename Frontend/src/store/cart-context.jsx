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
  // ✅ CORRECT (Smart Switching)
  const baseUrl =
    import.meta.env.MODE === "production"
      ? "https://bisenenterprise.onrender.com/api" // <--- Your Live Render Backend
      : "http://localhost:5000/api"; // <--- Your Local Testing
  // ✅ HELPER: Get token from Context OR LocalStorage (Safe Fallback)
  const getToken = () => {
    return localStorage.getItem("auth-token");
  };

  // 1. FETCH CART FROM DB ON LOAD
  useEffect(() => {
    const currentToken = getToken();
    if (currentToken) {
      axios
        .get(`${baseUrl}/cart`, {
          headers: { "auth-token": currentToken },
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

    const config = { headers: { "auth-token": currentToken } };

    try {
      if (action.type === "ADD_TO_CART") {
        const res = await axios.post(
          `${baseUrl}/cart/add`,
          action.payload,
          config
        );
        setCart(res.data.items);
      } else if (action.type === "REMOVE_FROM_CART") {
        const res = await axios.delete(
          `${baseUrl}/cart/item/${action.payload}`,
          config
        );
        setCart(res.data.items);
      } else if (action.type === "UPDATE_QTY") {
        const res = await axios.put(
          `${baseUrl}/cart/update`,
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
