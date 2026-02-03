import React, { useContext } from "react";
import { UserContext } from "../store/user-context";
import { AuthContext } from "../store/auth-context";
import {
  FaChevronRight,
  FaUserEdit,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaPhone,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/user-profile.css";
import GoogleLogin from "../components/GoogleLogin";

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "LI";

  return (
    <div className="user-profile-container">
      {/* USER CARD */}
      <div className="user-profile-card">
        {user && <div className="user-avatar">{initials}</div>}

        <div className="user-info">
          {user ? (
            <>
              <h4 className="user-name">{user.name}</h4>
              <p className="user-email">{user.email}</p>
              <p className="user-phone">{user.phone}</p>
            </>
          ) : (
            <div className="user-guest">
              <div className="user-guest-text">
                <h4 className="user-name">Welcome</h4>
                <p className="user-email">
                  Login or create an account to continue
                </p>
              </div>
              <div className="user-guest-actions">
                <button
                  type="button"
                  className="user-auth-btn primary"
                  onClick={() => navigate("/Login")}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="user-auth-btn ghost"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </button>
              </div>
              <div className="google-login-wrapper">
                <GoogleLogin />
              </div>
            </div>
          )}
        </div>

        {user && (
          <button
            className="user-edit-btn"
            onClick={() => navigate("/EditProfile")}
          >
            <FaUserEdit size={16} /> Edit
          </button>
        )}
      </div>

      {/* ACCOUNT OPTIONS */}
      <div className="user-section">
        <h5 className="user-section-title">Account Options</h5>

        <div className="user-option" onClick={() => navigate("/my-orders")}>
          <FaBox className="icon" /> <span>My Orders</span>
          <FaChevronRight className="arrow" />
        </div>

        <div className="user-option" onClick={() => navigate("/Wishlist")}>
          <FaHeart className="icon" /> <span>Wishlist</span>
          <FaChevronRight className="arrow" />
        </div>

        <div
          className="user-option"
          onClick={() => navigate("/SavedAddresses")}
        >
          <FaMapMarkerAlt className="icon" /> <span>Saved Addresses</span>
          <FaChevronRight className="arrow" />
        </div>
      </div>

      {/* SUPPORT */}
      <div className="user-section">
        <h5 className="user-section-title">Support</h5>

        <div className="user-option" onClick={() => navigate("/Support")}>
          <FaPhone className="icon" /> <span>Customer Care</span>
          <FaChevronRight className="arrow" />
        </div>

        <div className="user-option" onClick={() => navigate("/AboutUs")}>
          <FaInfoCircle className="icon" /> <span>About Us</span>
          <FaChevronRight className="arrow" />
        </div>
      </div>

      {/* LOGOUT / LOGIN */}
      {user && (
        <button
          className="user-logout-btn"
          onClick={() => {
            logout();
            navigate("/Login");
          }}
        >
          Logout
        </button>
      )}

      <div className="user-version">Version 1.0 • User Panel</div>
    </div>
  );
};

export default UserProfile;
