import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// 1. ASYNC THUNK: Fetch Orders from Backend
export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      const response = await axios.get(`${baseUrl}/orders`, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      });
      return response.data; // The array of orders
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// 1. FETCH ALL ORDERS (Admin)
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      const response = await axios.get(`${baseUrl}/orders/all`, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// 2. UPDATE ORDER STATUS (Admin)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const currentToken = localStorage.getItem("auth-token");
      const response = await axios.put(
        `${baseUrl}/orders/${orderId}/status`,
        { status },
        { headers: { "auth-token": localStorage.getItem("auth-token") } }
      );
      return response.data; // Returns updated order
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);
// 2. THE SLICE
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No sync actions needed yet
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // FETCH ALL
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      // UPDATE STATUS
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // Find the order in the list and update its status immediately
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});
export default orderSlice.reducer;
