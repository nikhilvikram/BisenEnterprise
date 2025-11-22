import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "../store/wishlistSlice";

const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
  },
});
export default store;
