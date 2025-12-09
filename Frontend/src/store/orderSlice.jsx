import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../config"; // Or use "http://localhost:5000/api"

// 1. ASYNC THUNK: Fetch Orders from Backend
export const fetchOrders = createAsyncThunk("orders/fetch", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/orders`, {
      headers: { "x-auth-token": token },
    });
    return response.data; // The array of orders
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
  }
});

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
      });
  },
});

export default orderSlice.reducer;