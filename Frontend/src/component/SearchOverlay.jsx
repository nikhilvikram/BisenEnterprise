import React, { useContext, useState, useEffect } from "react";
import { TextileList } from "../store/textile-list-store";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaChevronLeft, FaHistory } from "react-icons/fa";

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
    let updated = [text, ...recent.filter((x) => x !== text)];
    updated = updated.slice(0, 8); // keep max 8
    setRecent(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Filter products using textileArray
  const results = textileArray.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id, title) => {
    saveRecent(title);
    close();
    navigate(`/product/${id}`);
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
            placeholder="Search for products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Recent Searches */}
      {!query && recent.length > 0 && (
        <div className="recent-box">
          <h4 className="recent-title">Recent Searches</h4>

          {recent.map((text, i) => (
            <div
              key={i}
              className="recent-item"
              onClick={() => setQuery(text)}
            >
              <FaHistory className="recent-icon" />
              {text}
            </div>
          ))}
        </div>
      )}

      {/* Search Results */}
      {query && (
        <div className="results-box">
          {results.length === 0 ? (
            <p className="no-results">No products found</p>
          ) : (
            results.map((p) => (
              <div
                key={p.id}
                className="search-card"
                onClick={() => handleSelect(p.id, p.title)}
              >
                <img src={p.image} alt={p.title} />
                <div className="search-info">
                  <h5>{p.title}</h5>
                  <span className="price">₹{p.price}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchOverlay;
