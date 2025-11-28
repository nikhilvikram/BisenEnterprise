import React from "react";
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

const UserProfile = () => {
  const user = {
    name: "Nikhil Bisen",
    email: "nikhilbisen25@gmail.com",
    phone: "9767853662",
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="user-profile-container">
      {/* HEADER */}
      <h2 className="user-profile-heading">My Account</h2>

      {/* USER CARD */}
      <div className="user-profile-card">
        <div className="user-avatar">{initials}</div>

        <div className="user-info">
          <h4 className="user-name">{user.name}</h4>
          <p className="user-email">{user.email}</p>
          <p className="user-phone">{user.phone}</p>
        </div>

        <button className="user-edit-btn">
          <FaUserEdit size={16} /> Edit
        </button>
      </div>

      {/* SECTIONS */}
      <div className="user-section">
        <h5 className="user-section-title">Account Options</h5>

        <div className="user-option">
          <FaBox className="icon" /> <span>My Orders</span>
          <FaChevronRight className="arrow" />
        </div>

        <div className="user-option">
          <FaHeart className="icon" /> <span>Wishlist</span>
          <FaChevronRight className="arrow" />
        </div>

        <div className="user-option">
          <FaMapMarkerAlt className="icon" /> <span>Saved Addresses</span>
          <FaChevronRight className="arrow" />
        </div>
      </div>

      <div className="user-section">
        <h5 className="user-section-title">Support</h5>

        <div className="user-option">
          <FaPhone className="icon" /> <span>Customer Care</span>
          <FaChevronRight className="arrow" />
        </div>

        <div className="user-option">
          <FaInfoCircle className="icon" /> <span>About Us</span>
          <FaChevronRight className="arrow" />
        </div>
      </div>

      {/* LOGOUT */}
      <button className="user-logout-btn">
        <FaSignOutAlt /> Logout
      </button>

      <div className="user-version">Version 1.0 • User Panel</div>
    </div>
  );
};

export default UserProfile;
