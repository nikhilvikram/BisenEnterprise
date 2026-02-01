import React, { useContext, useState, useEffect } from "react";
import { TextileList } from "../store/textile-list-store";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaChevronLeft, FaHistory, FaTimes } from "react-icons/fa";
import "../styles/home-slider-search.css";

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
            <FaTimes className="clear-icon" onClick={() => setQuery("")} />
          )}
        </div>
      </div>

      {/* 1. Recent Searches (Show only if no query) */}
      {!query && recent.length > 0 && (
        <div className="recent-box">
          <div className="recent-header">
            <h4 className="recent-title">Recent Searches</h4>
            <span
              className="recent-clear"
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
              <div className="recent-item-content">
                <FaHistory className="recent-icon" />
                {text}
              </div>
              <FaTimes
                className="delete-recent"
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
                    <span className="search-category">{p.category}</span>
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
