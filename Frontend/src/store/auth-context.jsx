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
  // ✅ Lazy Initialization: Reads storage immediately on mount
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser && savedUser !== "undefined"
      ? JSON.parse(savedUser)
      : null;
  });

  // Login Function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://bisenenterprisebackend.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("Login Response:", res.data);

      // ✅ Robust Handling: Works even if backend structure varies slightly
      const receivedToken = res.data.token;
      let receivedUser = res.data.user;

      if (receivedToken) {
        // If backend didn't send user object, fallback to local data
        if (!receivedUser) {
          receivedUser = { name: "User", email: email };
        }

        setToken(receivedToken);
        setUser(receivedUser);

        localStorage.setItem("token", receivedToken);
        localStorage.setItem("user", JSON.stringify(receivedUser));

        return { success: true };
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
      await axios.post(
        "https://bisenenterprisebackend.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );
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

  // Computed property for easier access
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
