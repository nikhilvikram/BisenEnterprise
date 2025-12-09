import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "../store/wishlistSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice"; // <--- Import

const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});
export default store;
