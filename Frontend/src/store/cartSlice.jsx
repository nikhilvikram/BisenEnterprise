import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../config"; // Ensure you have this, or hardcode the URL

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
      const token = localStorage.getItem("token");
      // If no token, we can't fetch. Return empty array.
      if (!token) return { items: [] };

      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { "x-auth-token": token },
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
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/cart/add`,
        { productId, qty },
        { headers: { "x-auth-token": token } }
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
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/cart/item/${productId}`,
        {
          headers: { "x-auth-token": token },
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
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/cart/update`,
        { productId, qty },
        { headers: { "x-auth-token": token } }
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
      const token = localStorage.getItem("token");
      // Call backend to delete all items
      await axios.delete(`${API_BASE_URL}/cart/clear`, {
        headers: { "x-auth-token": token },
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
