import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext({
  user: null,
  token: null,
  isLoggedIn: false,
  login: (email, password) => {},
  logout: () => {},
  register: (name, email, password) => {},
});

export const AuthProvider = ({ children }) => {
  // ✅ Lazy Initialization
  const [token, setToken] = useState(() => localStorage.getItem("auth-token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser && savedUser !== "undefined"
      ? JSON.parse(savedUser)
      : null;
  });
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  // Login Function
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password,
      });

      console.log("Login Response:", res.data);

      const receivedToken = res.data.token;
      let receivedUser = res.data.user;

      if (receivedToken) {
        if (!receivedUser) {
          receivedUser = { name: "User", email: email, role: "user" };
        }

        // 1. Update State
        setToken(receivedToken);
        setUser(receivedUser);

        // 2. Persist to LocalStorage
        localStorage.setItem("auth-token", receivedToken);
        localStorage.setItem("user", JSON.stringify(receivedUser));

        // 3. Return Success + Role (So LoginPage knows where to go)
        return { success: true, role: receivedUser.role };
      } else {
        return { success: false, message: "No token received from server" };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return {
        success: false,
        message: error.response?.data?.msg || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post(`${baseUrl}/auth/register`, { name, email, password });
      return await login(email, password);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.msg || "Registration failed",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
