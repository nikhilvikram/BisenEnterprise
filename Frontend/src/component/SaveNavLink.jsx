// src/component/SaveNavLink.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { saveScrollFor } from "../utils/scrollStore";

export default function SaveNavLink({ to, children, ...props }) {
  const { pathname } = useLocation();

  return (
    <NavLink
      to={to}
      {...props}
      onClick={(e) => {
        saveScrollFor(pathname); // <- VERY IMPORTANT
        if (props.onClick) props.onClick(e);
      }}
      className={({ isActive }) =>
        isActive ? "mb-nav-link active" : "mb-nav-link"
      }
    >
      {children}
    </NavLink>
  );
}
