import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ selectedTab, setselectedTab }) => {
  const [open, setOpen] = useState(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (open && !e.target.closest(".mobile-sidebar")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, [open]);

  const handleMenuClick = (tab) => {
    setselectedTab(tab);
    setOpen(false); // collapse on click
  };

  return (
    <>
      {/* ===== Hamburger Button (Mobile) ===== */}
      <button
        className="hamburger-btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        ☰
      </button>

      {/* ===== Backdrop (Click outside to close) ===== */}
      {open && <div className="sidebar-backdrop"></div>}

      {/* ===== Slide Drawer ===== */}
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
              to="/Categories"
              className="sidebar-link"
              onClick={() => handleMenuClick("Categories")}
            >
              👚 Kurta List
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
