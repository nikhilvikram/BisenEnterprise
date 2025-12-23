import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../store/auth-context";
import axios from "axios";

const AdminRoute = () => {
  const { token } = useContext(AuthContext);
  const [role, setRole] = useState(null); // null = loading
  // ✅ CORRECT (Smart Switching)
  const baseUrl =
    import.meta.env.MODE === "production"
      ? "https://bisenenterprise.onrender.com" // <--- Your Live Render Backend
      : "http://localhost:5000"; // <--- Your Local Testing
  useEffect(() => {
    const checkRole = async () => {
      try {
        // You need an endpoint that returns the user's profile info
        // Ideally: GET /api/auth/me
        const res = await axios.get(`${baseUrl}/auth/me`, {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        });
        setRole(res.data.role);
      } catch (err) {
        setRole("user");
      }
    };

    if (token) checkRole();
    else setRole("guest");
  }, [token]);

  if (role === null)
    return <div className="text-center mt-5">Verifying Access...</div>;

  // If Admin or Superadmin, show the page. Else, redirect.
  return role === "admin" || role === "superadmin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoute;
