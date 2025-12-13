import React, { useContext, useState, useEffect } from "react";
import { TextileList } from "../store/textile-list-store";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaChevronLeft, FaHistory, FaTimes } from "react-icons/fa";

const SearchOverlay = ({ close }) => {
  const { textileArray } = useContext(TextileList);

  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();

  // Load recent from localStorage
  useEffect(() => {
    const r = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecent(r);
  }, []);

  const saveRecent = (text) => {
    // Avoid saving duplicates and empty strings
    if (!text.trim()) return;
    let updated = [text, ...recent.filter((x) => x !== text)];
    updated = updated.slice(0, 8); // keep max 8
    setRecent(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Filter products (Safety check for null array)
  const results = (textileArray || []).filter((p) =>
    p.title?.toLowerCase().includes(query.toLowerCase().trim())
  );

  const handleSelect = (item) => {
    // 🛑 CRITICAL FIX: Handle MongoDB _id OR Static id
    const productId = item._id || item.id;

    if (!productId) {
      console.error("Product ID missing", item);
      return;
    }

    saveRecent(item.title);
    close();
    navigate(`/product/${productId}`);
  };

  // Clear a specific recent item
  const removeRecent = (e, text) => {
    e.stopPropagation();
    const updated = recent.filter((x) => x !== text);
    setRecent(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  return (
    <div className="search-overlay">
      {/* Header */}
      <div className="search-header">
        <FaChevronLeft className="close-btn" onClick={close} />
        <div className="search-input-box">
          <FaSearch className="search-icon" />
          <input
            autoFocus
            placeholder="Search for Sarees, Kurtis..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <FaTimes
              className="clear-icon"
              style={{
                position: "absolute",
                right: "10px",
                color: "#888",
                cursor: "pointer",
              }}
              onClick={() => setQuery("")}
            />
          )}
        </div>
      </div>

      {/* 1. Recent Searches (Show only if no query) */}
      {!query && recent.length > 0 && (
        <div className="recent-box">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 className="recent-title">Recent Searches</h4>
            <span
              style={{ fontSize: "0.75rem", color: "red", cursor: "pointer" }}
              onClick={() => {
                setRecent([]);
                localStorage.removeItem("recentSearches");
              }}
            >
              CLEAR ALL
            </span>
          </div>

          {recent.map((text, i) => (
            <div key={i} className="recent-item" onClick={() => setQuery(text)}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <FaHistory className="recent-icon" />
                {text}
              </div>
              <FaTimes
                className="delete-recent"
                style={{ marginLeft: "auto", opacity: 0.4 }}
                onClick={(e) => removeRecent(e, text)}
              />
            </div>
          ))}
        </div>
      )}

      {/* 2. Search Results */}
      {query && (
        <div className="results-box">
          {results.length === 0 ? (
            <div className="no-results">
              <p>No products found for "{query}"</p>
              <small>Try checking for typos or using different keywords.</small>
            </div>
          ) : (
            results.map((p) => {
              // Handle ID for key safely
              const pid = p._id || p.id;

              return (
                <div
                  key={pid}
                  className="search-card"
                  onClick={() => handleSelect(p)}
                >
                  <img
                    src={p.images?.length > 0 ? p.images[0] : p.image}
                    alt={p.title}
                  />
                  <div className="search-info">
                    <h5>{p.title}</h5>
                    <span className="price">₹{p.price}</span>
                    <span style={{ fontSize: "0.7rem", color: "green" }}>
                      {p.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SearchOverlay;
