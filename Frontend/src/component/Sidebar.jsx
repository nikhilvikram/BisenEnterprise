import React, { useState, useEffect } from "react";
import "../styles/sidebar.css";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { FaUsersLine } from "react-icons/fa6";
import { UserContext } from "../store/user-context";
import { AuthContext } from "../store/auth-context";
import { useContext } from "react";
const Sidebar = ({ selectedTab, setselectedTab }) => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  // ===== Close sidebar when clicking outside =====
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        open &&
        !e.target.closest(".mobile-sidebar") &&
        !e.target.closest(".hamburger-btn")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, [open]);

  // ===== On clicking a menu item =====
  const handleMenuClick = () => {
    setOpen(false); // Close sidebar
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((i) => i[0])
        .join("")
        .toUpperCase()
    : "GU";
  return (
    <>
      {/* ===== Hamburger Button (Mobile) ===== */}
      <button
        className="hamburger-btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        ☰
      </button>

      {/* ===== Backdrop ===== */}
      {open && <div className="sidebar-backdrop"></div>}

      {/* ===== Slide Sidebar ===== */}
      <div className={`mobile-sidebar ${open ? "open" : ""}`}>
        <h4 className="sidebar-title">BisenEnterprise</h4>

        {/* ===== USER QUICK CARD ===== */}
        <div className="sidebar-user-card">
          <NavLink
            to={user ? "/UserProfile" : "/Login"}
            className="sidebar-user-link"
            onClick={() => handleMenuClick("UserProfile")}
          >
            <div className="sidebar-user-avatar">{initials}</div>

            <div className="sidebar-user-info">
              <h5 className="sidebar-user-name">
                {user ? user.name : "Guest User"}
              </h5>
              <p className="sidebar-user-email">
                {user ? user.phone : "Login to continue"}
              </p>
            </div>
          </NavLink>
          <span className="sidebar-user-arrow">›</span>
        </div>

        {/* ==== MENU SECTION ==== */}
        <div className="sidebar-menu-section">
          {/* HOMEPAGE */}
          <div className="sidebar-user-card">
            <NavLink
              to="/HomePage"
              className="sidebar-user-link"
              onClick={() => handleMenuClick("HomePage")}
            >
              <span className="icon">
                <FaHome />
              </span>
              <span className="label">Homepage</span>
            </NavLink>
            <span className="sidebar-user-arrow">›</span>
          </div>

          {/* CREATE POST */}
          {/* <div className="sidebar-user-card">
            <NavLink
              to="/CreatePost"
              className="sidebar-user-link"
              onClick={() => handleMenuClick("CreatePost")}
            >
              <span className="icon">
                <FaBookOpenReader />
              </span>
              <span className="label">Create Post</span>
            </NavLink>
            <span className="sidebar-user-arrow">›</span>
          </div> */}

          {/* SAREE LIST */}
          <div className="sidebar-user-card">
            <NavLink
              to="/SareeList"
              className="sidebar-user-link"
              onClick={() => handleMenuClick("SareeList")}
            >
              <span className="icon">🥻</span>
              <span className="label">Explore</span>
            </NavLink>
            <span className="sidebar-user-arrow">›</span>
          </div>

          {/* KURTA LIST */}
          <div className="sidebar-user-card">
            <NavLink
              to="/Categories"
              className="sidebar-user-link"
              onClick={() => handleMenuClick("Categories")}
            >
              <span className="icon">👚</span>
              <span className="label">Categories</span>
            </NavLink>
            <span className="sidebar-user-arrow">›</span>
          </div>

          {/* ABOUT US */}
          <div className="sidebar-user-card">
            <NavLink
              to="/AboutUs"
              className="sidebar-user-link"
              onClick={() => handleMenuClick("AboutUs")}
            >
              <span className="icon">
                <FaUsersLine />
              </span>
              <span className="label">About Us</span>
            </NavLink>
            <span className="sidebar-user-arrow">›</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
