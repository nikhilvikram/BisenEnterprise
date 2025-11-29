import React, { useContext, useState } from "react";
import { FaSearch, FaHeart, FaShoppingBag } from "react-icons/fa";
import { ThemeContext } from "../store/theme-context";
import { CartContext } from "../store/cart-context";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import SearchOverlay from "./SearchOverlay"; // IMPORTANT: new import

const HeaderNavbar = () => {
  const { cart } = useContext(CartContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const [openSearch, setOpenSearch] = useState(false);

  const totalQuantity = cart.reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  return (
    <>
      {/* SEARCH OVERLAY (AJIO STYLE) */}
      {openSearch && <SearchOverlay close={() => setOpenSearch(false)} />}

      <nav className="bisen-header">
        <Link to="/HomePage" style={{ textDecoration: "none" }}>
          <div className="bisen-logo">
            <span style={{ color: "#E63946" }}>Bisen</span>
            <span style={{ color: "gray" }}>Enterprise</span>
          </div>
        </Link>

        <div className="bisen-icons">
          <button className="theme-btn" onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* SEARCH OPENER */}
          <FaSearch
            size={20}
            className="header-icon"
            onClick={() => setOpenSearch(true)}
            style={{ cursor: "pointer" }}
          />

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
    </>
  );
};

export default HeaderNavbar;
