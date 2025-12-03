import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./auth-context"; // Import Auth to get token

export const CartContext = createContext({
  cart: [],
  dispatch: () => {},
});

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token } = useContext(AuthContext); // Get the JWT token

  // 1. FETCH CART FROM DB ON LOAD
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/cart", {
          headers: { "x-auth-token": token },
        })
        .then((res) => {
          // Backend returns { items: [...] }. We just need the items array.
          setCart(res.data.items || []);
        })
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [token]);

  // 2. HANDLE ACTIONS (Add, Remove, Update)
  const dispatch = async (action) => {
    console.log("Dispatching Action:", action.type, "Token:", token);
    if (!token) {
      alert("Please Login to use Cart");
      return;
    }

    const config = { headers: { "x-auth-token": token } };

    try {
      if (action.type === "ADD_TO_CART") {
        // Optimistic UI Update (Update screen immediately)
        // ... complex logic omitted for simplicity, let's wait for server response for accuracy

        const res = await axios.post(
          "http://localhost:5000/api/cart/add",
          action.payload,
          config
        );
        setCart(res.data.items); // Update local state with server response
      } else if (action.type === "REMOVE_FROM_CART") {
        const res = await axios.delete(
          `http://localhost:5000/api/cart/item/${action.payload}`,
          config
        );
        setCart(res.data.items);
      }

      // Note: For Update Qty, we need to create a specific route in backend or reuse ADD with logic
      // For now, let's assume ADD handles updates (if item exists, it adds qty)
      else if (action.type === "UPDATE_QTY") {
        // This requires a specific backend route we might need to tweak.
        // For now, re-using add logic or you can create a specific /update route in backend.
        // Let's implement a simple logic:
        // If qty is increasing, call Add. If decreasing, we need a subtract logic.
        // payload: { productId, qty }
        const res = await axios.put(
          "http://localhost:5000/api/cart/update",
          action.payload,
          config
        );
        setCart(res.data.items); // Update local state with new data
      } else if (action.type === "CLEAR_CART") {
        setCart([]); // Instantly wipe local state
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
