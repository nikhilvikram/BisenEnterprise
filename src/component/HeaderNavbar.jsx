import React, { useState, useContext } from "react";
import { FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";
import { ThemeContext } from "../store/theme-context";
import { CartContext } from "../store/cart-context";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
const HeaderNavbar = ({ selectedTab, setselectedTab }) => {
  const menuItems = [
    { name: "Men", tab: "Men" },
    { name: "Women", tab: "Women" },
    { name: "Kids", tab: "Kids" },
    { name: "Home", tab: "HomeDecor" },
  ];
  const { cart } = useContext(CartContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const totalQuantity = cart.reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  return (
    <nav
      className="navbar px-3"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        zIndex: 3500,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",

        /* THEME COLORS */
        backgroundColor: "var(--navbar-bg)",
        color: "var(--text-color)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Logo */}
      <div
        className="fw-bold"
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={() => setselectedTab("Home")}
      >
        <span className="fs-4 fw-bold icon_contain">
          <span style={{ color: darkMode ? "#ff5b5b" : "#E63946" }}>Bisen</span>
          <span style={{ color: darkMode ? "#cccccc" : "gray" }}>
            Enterprise
          </span>
        </span>
      </div>

      {/* Horizontal Nav Links */}
      <ul
        className="d-flex align-items-center list-unstyled mb-0"
        style={{ gap: "1.5rem" }}
      >
        {menuItems.map((item) => (
          <li
            key={item.tab}
            style={{
              cursor: "pointer",
              fontWeight: selectedTab === item.tab ? "600" : "400",
              color: selectedTab === item.tab ? "#ff3f6c" : "var(--text-color)",
              borderBottom:
                selectedTab === item.tab ? "2px solid #ff3f6c" : "none",
              paddingBottom: "2px",
            }}
            onClick={() => setselectedTab(item.tab)}
          >
            {item.name}
          </li>
        ))}
      </ul>

      {/* Theme Toggle */}
      <button
        className="btn btn-outline-light"
        onClick={toggleTheme}
        style={{
          backgroundColor: "var(--navbar-bg)",
          borderColor: "var(--text-color)",
          color: "var(--text-color)",
        }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Right-side Icons */}
      <div
        className="d-flex align-items-center"
        style={{ color: "var(--text-color)" }}
      >
        <div
          className="d-flex flex-column align-items-center mx-3"
          style={{ cursor: "pointer" }}
        >
          <FaUser size={18} />
          <span style={{ fontSize: "0.75rem" }}>Profile</span>
        </div>
        <NavLink
          to="/Wishlist"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => setselectedTab("Wishlist")}
        >
          <div
            className="d-flex flex-column align-items-center mx-3"
            style={{ cursor: "pointer" }}
          >
            <FaHeart size={18} />{" "}
            <span class="top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {wishlistCount}
            </span>
            <span style={{ fontSize: "0.75rem" }}></span>
          </div>
        </NavLink>
        <NavLink
          to="/Cart"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => setselectedTab("Home")}
        >
          <div
            className="d-flex flex-column align-items-center mx-3"
            style={{ cursor: "pointer" }}
          >
            <FaShoppingBag size={18} />
            <span class="top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalQuantity}
            </span>
            <span style={{ fontSize: "0.75rem" }}></span>
          </div>
        </NavLink>
      </div>
    </nav>
  );
};

export default HeaderNavbar;
