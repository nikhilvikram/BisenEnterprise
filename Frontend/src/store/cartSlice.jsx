import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// =========================================================
// 1. ASYNC THUNKS (The API Communication Layer)
// =========================================================
// Thunks allow us to make async calls (like fetching data) in Redux.
// They have 3 states automatically: .pending, .fulfilled, .rejected

// A. FETCH CART
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      // If no token, we can't fetch. Return empty array.
      if (!token) return { items: [] };

      const response = await axios.get(`${baseUrl}/cart`, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      });

      // Return the data so the Reducer can save it
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// B. ADD TO CART
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, qty }, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      const response = await axios.post(
        `${baseUrl}/cart/add`,
        { productId, qty },
        { headers: { "auth-token": localStorage.getItem("auth-token") } }
      );
      return response.data; // Backend returns the updated cart
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

// C. REMOVE FROM CART
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      const response = await axios.delete(
        `${baseUrl}/cart/item/${productId}`,
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// D. UPDATE QUANTITY
export const updateQty = createAsyncThunk(
  "cart/update",
  async ({ productId, qty }, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      const response = await axios.put(
        `${baseUrl}/cart/update`,
        { productId, qty },
        { headers: { "auth-token": localStorage.getItem("auth-token") } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// E. CLEAR CART ON SERVER
export const clearCartServer = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      // Call backend to delete all items
      await axios.delete(`${baseUrl}/cart/clear`, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      });
      return []; // Return empty array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// =========================================================
// 2. THE SLICE (State + Reducers)
// =========================================================

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // The actual cart items
    totalQuantity: 0, // Helper for badges
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Synchronous action (Happens instantly, no API needed)
    clearCartLocal: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },
  },
  // EXTRA REDUCERS: Listen to the Thunks (API calls) above
  extraReducers: (builder) => {
    builder
      // --- FETCH CART HANDLERS ---
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        // The backend returns { items: [...] }. We save it to state.
        state.items = action.payload.items || [];
        // Calculate total quantity for badge
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.qty,
          0
        );
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- ADD TO CART HANDLERS ---
      .addCase(addToCart.fulfilled, (state, action) => {
        // Backend returns the FULL updated cart object
        state.items = action.payload.items;
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.qty,
          0
        );
      })

      // --- REMOVE HANDLERS ---
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.qty,
          0
        );
      })

      // --- UPDATE HANDLERS ---
      .addCase(updateQty.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.qty,
          0
        );
      })
      .addCase(clearCartServer.fulfilled, (state) => {
        state.items = []; // Now we clear local state because server confirmed it's gone
        state.totalQuantity = 0;
      });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
