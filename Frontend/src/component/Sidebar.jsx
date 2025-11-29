import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { FaUsersLine } from "react-icons/fa6";

const Sidebar = ({ selectedTab, setselectedTab }) => {
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
          {" "}
          <NavLink
            to="/UserProfile"
            className="sidebar-link"
            onClick={() => handleMenuClick("UserProfile")}
          >
            <div className="sidebar-user-avatar">{/* Initials */}NB</div>

            <div className="sidebar-user-info">
              <h5 className="sidebar-user-name">Nikhil Bisen</h5>
            </div>
          </NavLink>
          <div className="sidebar-user-arrow custom_side">›</div>
        </div>

        {/* ==== SIDEBAR MENU (Styled like Account Options) ==== */}
        <div className="user-section">
          <div className="sidebar-user-card">
            <NavLink
              to="/HomePage"
              className="sidebar-link user-option"
              onClick={() => handleMenuClick("HomePage")}
            >
              <span className="icon">
                <FaHome className="icon" />
              </span>
              <span>Homepage</span>
            </NavLink>
            <div className="sidebar-user-arrow arrow custom_side">›</div>
          </div>
          <div className="sidebar-user-card">
            <NavLink
              to="/CreatePost"
              className="sidebar-link user-option"
              onClick={() => handleMenuClick("CreatePost")}
            >
              <span className="icon">
                <FaBookOpenReader className="icon" />
              </span>
              <span>Create Post</span>
            </NavLink>
            <div className="sidebar-user-arrow arrow custom_side">›</div>
          </div>
          <div className="sidebar-user-card">
            <NavLink
              to="/SareeList"
              className="sidebar-link user-option"
              onClick={() => handleMenuClick("SareeList")}
            >
              <span className="icon">🥻</span>
              <span>Saree List</span>
            </NavLink>
            <div className="sidebar-user-arrow arrow custom_side">›</div>
          </div>
          <div className="sidebar-user-card">
            <NavLink
              to="/KurtaList"
              className="sidebar-link user-option"
              onClick={() => handleMenuClick("KurtaList")}
            >
              <span className="icon">👚</span>
              <span>Kurta List</span>
            </NavLink>

            <div className="sidebar-user-arrow arrow custom_side">›</div>
          </div>
          <div className="sidebar-user-card">
            <NavLink
              to="/AboutUs"
              className="sidebar-link user-option"
              onClick={() => handleMenuClick("AboutUs")}
            >
              <span className="icon">
                <FaUsersLine className="icon" />
              </span>
              <span>About Us</span>
            </NavLink>
            <div className="sidebar-user-arrow arrow custom_side">›</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
