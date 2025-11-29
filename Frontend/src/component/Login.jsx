import React, { useState, useContext } from "react";
import { UserContext } from "../store/user-context";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = () => {
    if (!name || !phone) {
      alert("Please fill all fields");
      return;
    }

    login({
      name,
      email: `${name.toLowerCase().replace(" ", "")}@gmail.com`,
      phone,
    });

    navigate("/UserProfile");
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

        <input
          type="text"
          placeholder="Full Name"
          className="user_login_input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="user_login_input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
