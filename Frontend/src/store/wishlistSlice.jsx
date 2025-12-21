import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// 1. FETCH Wishlist from DB
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      if (!token) return []; // If no user, return empty

      const res = await axios.get(`${baseUrl}/wishlist`, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      });
      return res.data; // Returns array of products
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 2. ADD Item to DB
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      const res = await axios.post(
        `${baseUrl}/wishlist/add/${productId}`,
        {},
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      );
      return res.data; // Returns updated list
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 3. REMOVE Item from DB
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      const res = await axios.delete(
        `${baseUrl}/wishlist/remove/${productId}`,
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      );
      return res.data; // Returns updated list
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    // Optional: clear wishlist on logout
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Add
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Remove
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
