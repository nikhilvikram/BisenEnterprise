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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Inside src/store/auth-context.jsx

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log("Loading from LocalStorage:", { storedToken, storedUser }); // <--- ADD DEBUG LOG

    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (e) {
        console.error("Corrupt user data, clearing storage");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // 2. Login Function
  // Inside src/store/auth-context.jsx

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("Login Response from Backend:", res.data); // <--- ADD THIS DEBUG LOG

      // Check the structure. It should be { token: "...", user: { ... } }
      const { token, user } = res.data;

      if (!token || !user) {
        console.error("Invalid response structure:", res.data);
        return { success: false, message: "Invalid server response" };
      }

      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true };
    } catch (error) {
      console.error("Login Failed:", error.response?.data?.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // 3. Register Function
  const register = async (name, email, password) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      // Auto-login after register
      return await login(email, password);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.msg || "Registration failed",
      };
    }
  };

  // 4. Logout Function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isLoggedIn = !!token; // true if token exists

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
