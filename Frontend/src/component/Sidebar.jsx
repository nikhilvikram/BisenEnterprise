import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ selectedTab, setselectedTab }) => {
  const [open, setOpen] = useState(false);

  // ===== Close sidebar when clicking outside =====
  useEffect(() => {
    const handleOutside = (e) => {
      if (open && !e.target.closest(".mobile-sidebar") && !e.target.closest(".hamburger-btn")) {
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
        <hr />

        <ul className="list-unstyled px-3">

          <li>
            <NavLink
              to="/Home"
              className="sidebar-link"
              onClick={() => handleMenuClick("Home")}
            >
              ✍️ Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/HomePage"
              className="sidebar-link"
              onClick={() => handleMenuClick("HomePage")}
            >
              🏠 Homepage
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/CreatePost"
              className="sidebar-link"
              onClick={() => handleMenuClick("CreatePost")}
            >
              👗 Create Post
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/SareeList"
              className="sidebar-link"
              onClick={() => handleMenuClick("SareeList")}
            >
              🥻 Saree List
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/KurtaList"
              className="sidebar-link"
              onClick={() => handleMenuClick("KurtaList")}
            >
              👚 Kurta List
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/BackendProducts"
              className="sidebar-link"
              onClick={() => handleMenuClick("BackendProducts")}
            >
              About us
            </NavLink>
          </li>

        </ul>
      </div>
    </>
  );
};

export default Sidebar;
