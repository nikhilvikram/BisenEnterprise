import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "../store/wishlistSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice"; // <--- Import
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    cart: cartReducer,
    orders: orderReducer,
    firebaseAuth: authReducer,
  },
});
export default store;
