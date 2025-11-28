// src/component/SaveNavLink.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { saveScrollFor } from "../utils/scrollStore";

export default function SaveNavLink({ to, children, ...props }) {
  const loc = useLocation();
  const currentKey = `${loc.pathname}${loc.hash || ""}`;

  return (
    <NavLink
      to={to}
      {...props}
      onClick={(e) => {
        // save current route key BEFORE navigation happens
        try {
          saveScrollFor(currentKey);
          console.debug(
            "SaveNavLink: saved scroll for",
            currentKey,
            window.scrollY
          );
        } catch (err) {
          console.warn("SaveNavLink: save failed", err);
        }
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
