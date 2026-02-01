import React, { useState, useContext } from "react";
import "../styles/login.css";
import { AuthContext } from "../store/auth-context"; // ✅ Use the real Auth Context
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState("login"); // login | signup

  // ✅ Updated state for real backend auth
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async () => {
    // Basic Validation
    if (!email || !password) {
      alert("Please fill in Email and Password");
      return;
    }

    if (tab === "signup" && !name) {
      alert("Please enter your Name");
      return;
    }

    let result;

    // ✅ Call Backend API based on Tab
    if (tab === "signup") {
      result = await register(name, email, password);
    } else {
      result = await login(email, password);
    }

    // ✅ Handle Result
    if (result.success) {
      navigate("/"); // Redirect to Home on success
    } else {
      alert(result.message || "Authentication failed");
    }
  };

  return (
    <div className="user_login_container">
      <div className="user_login_card">
        {/* TABS */}
        <div className="user_login_tabs">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={tab === "signup" ? "active" : ""}
            onClick={() => setTab("signup")}
          >
            Signup
          </button>
        </div>

        <h2 className="user_login_title">
          {tab === "login" ? "Welcome Back" : "Create Your Account"}
        </h2>

        {/* ✅ NAME INPUT (Only for Signup) */}
        {tab === "signup" && (
          <input
            type="text"
            placeholder="Full Name"
            className="user_login_input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {/* ✅ EMAIL INPUT (Required for Backend) */}
        <input
          type="email"
          placeholder="Email Address"
          className="user_login_input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ PASSWORD INPUT (Required for Backend) */}
        <input
          type="password"
          placeholder="Password"
          className="user_login_input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="user_login_btn" onClick={handleSubmit}>
          {tab === "login" ? "Login" : "Signup"}
        </button>

        {/* TERMS */}
        <p className="user_terms_text">
          By continuing, you agree to our{" "}
          <span className="user_terms_link" onClick={() => setShowTerms(true)}>
            Terms & Conditions
          </span>
        </p>
      </div>

      {/* TERMS POPUP */}
      {showTerms && (
        <div className="user_terms_popup">
          <div className="user_terms_box">
            <h3>Terms & Conditions</h3>
            <p>
              • Your personal details are stored securely. <br />
              • Cash-on-delivery payments are subject to availability. <br />
              • We do not share your data with third parties. <br />• Orders
              once placed cannot be cancelled after processing.
            </p>

            <button
              className="user_terms_close"
              onClick={() => setShowTerms(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
