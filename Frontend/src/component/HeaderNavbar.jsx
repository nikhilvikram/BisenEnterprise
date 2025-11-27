import React, { useContext } from "react";
import { FaSearch, FaHeart, FaShoppingBag } from "react-icons/fa";
import { ThemeContext } from "../store/theme-context";
import { CartContext } from "../store/cart-context";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const HeaderNavbar = () => {
  const { cart } = useContext(CartContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const totalQuantity = cart.reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  return (
    <nav className="bisen-header">
      {/* Left – Logo */}
      <div className="bisen-logo">
        <span style={{ color: "#E63946" }}>Bisen</span>
        <span style={{ color: "gray" }}>Enterprise</span>
      </div>

      {/* Right Icons */}
      <div className="bisen-icons">
        <button className="theme-btn" onClick={toggleTheme}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <FaSearch size={20} className="header-icon" />

        <NavLink
          to="/Wishlist"
          className={({ isActive }) =>
            `header-icon-wrapper ${isActive && "active"}`
          }
        >
          <FaHeart size={20} className="header-icon" />
          {wishlistCount > 0 && (
            <span className="icon-badge">{wishlistCount}</span>
          )}
        </NavLink>

        <NavLink
          to="/Cart"
          className={({ isActive }) =>
            `header-icon-wrapper ${isActive && "active"}`
          }
        >
          <FaShoppingBag size={20} className="header-icon" />
          {totalQuantity > 0 && (
            <span className="icon-badge">{totalQuantity}</span>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default HeaderNavbar;
