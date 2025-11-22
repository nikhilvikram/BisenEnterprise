import React, { useState } from "react";
import HeaderNavbar from "./HeaderNavbar";
import { useNavigate, NavLink } from "react-router-dom";

const Sidebar = function ({ selectedTab, setselectedTab }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="btn btn-dark position-absolute top-0 start-0 m-2 mybutton"
        style={{
          top: 12,
          left: 12,
          zIndex: 4000,
          width: 40,
          height: 40,
          padding: 0,
        }}
      >
        {collapsed ? "☰" : "✖"}
      </button>
      {
        <div
          className="d-flex flex-column flex-shrink-0 p-3 sidebar"
          style={{
            position: "fixed", // <-- important: removes from document flow
            top: 0,
            left: 0,
            width: collapsed ? "60px" : "280px",
            height: collapsed ? "60vh" : "100vh",
            overflowY: "auto",
            zIndex: 3000, // sit above main content
            backgroundColor: "var(--sidebar-bg)",
            color: "var(--text-color)",
            boxShadow: "2px 0 6px rgba(0,0,0,0.25)",
            transition: "width 0.3s ease",
            alignItems: collapsed ? "center" : "flex-start",
          }}
        >
          {" "}
          <a
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none"
          >
            {" "}
            <svg
              className="bi pe-none me-2"
              width="40"
              height="32"
              aria-hidden="true"
            >
              <use xlinkHref="#bootstrap"></use>
            </svg>{" "}
            {!collapsed && <span className="fs-4">Sidebar</span>}
          </a>{" "}
          <hr />{" "}
          <ul className="nav nav-pills flex-column mb-auto">
            {" "}
            <li>
              <NavLink
                to="/Home"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={() => setselectedTab("Home")}
              >
                ✍️ {!collapsed && "Home"}
              </NavLink>
            </li>{" "}
            <li>
              <NavLink
                to="/HomePage"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={() => setselectedTab("HomePage")}
              >
                🏠 {!collapsed && "HomePage"}
              </NavLink>
            </li>{" "}
            <li>
              <NavLink
                to="/CreatePost"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={() => setselectedTab("CreatePost")}
              >
                👗 {!collapsed && "CreatePost"}
              </NavLink>
            </li>{" "}
            <li>
              <NavLink
                to="/SareeList"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={() => setselectedTab("SareeList")}
              >
                🥻 {!collapsed && "SareeList"}
              </NavLink>
            </li>{" "}
            <li>
              <NavLink
                to="/KurtaList"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={() => setselectedTab("KurtaList")}
              >
                👚 {!collapsed && "KurtaList"}
              </NavLink>
            </li>{" "}
          </ul>{" "}
        </div>
      }
    </>
  );
};
export default Sidebar;
