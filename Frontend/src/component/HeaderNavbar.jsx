import React, { useContext, useState } from "react";
import "../styles/header-navbar.css";
import "../styles/badges.css";
import { FaSearch, FaHeart, FaShoppingBag } from "react-icons/fa";
import { ThemeContext } from "../store/theme-context";
import { CartContext } from "../store/cart-context";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import SearchOverlay from "./SearchOverlay"; // IMPORTANT: new import

const HeaderNavbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [openSearch, setOpenSearch] = useState(false);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  return (
    <>
      {/* SEARCH OVERLAY (AJIO STYLE) */}
      {openSearch && <SearchOverlay close={() => setOpenSearch(false)} />}

      <nav className="bisen-header">
        <Link to="/HomePage" className="brand-link">
          <div className="bisen-logo">
            <span className="brand-primary">Bisen</span>
            <span className="brand-secondary">Enterprise</span>
          </div>
        </Link>

        <div className="bisen-icons">
          <button className="theme-btn" onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* SEARCH OPENER */}
          <FaSearch
            size={20}
            className="header-icon header-icon-clickable"
            onClick={() => setOpenSearch(true)}
          />

          <NavLink
            to="/Wishlist"
            className={({ isActive }) =>
              `header-icon-wrapper ${isActive && "active"}`
            }
          >
            <FaHeart size={20} className="header-icon" />
            {wishlistCount > 0 && (
              <span className="icon-badge badgehome">{wishlistCount}</span>
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
              <span className="icon-badge badgehome">{totalQuantity}</span>
            )}
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default HeaderNavbar;
