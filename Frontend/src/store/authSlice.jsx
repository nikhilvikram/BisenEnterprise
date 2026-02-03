import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  user: (() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  })(),
};

const authSlice = createSlice({
  name: "firebaseAuth",
  initialState,
  reducers: {
    setFirebaseToken(state, action) {
      state.token = action.payload;
    },
    setCredentials(state, action) {
      const { token, user } = action.payload || {};
      state.token = token || null;
      state.user = user || null;
    },
    clearFirebaseToken(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setFirebaseToken, setCredentials, clearFirebaseToken } =
  authSlice.actions;
export default authSlice.reducer;
