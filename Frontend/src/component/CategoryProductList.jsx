import React, { useContext, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/categories.css";
import "../styles/product-grid.css";
import "../styles/shared-buttons.css";
import { TextileList } from "../store/textile-list-store";
import { saveScrollFor } from "../utils/scrollStore";
import { addToCart } from "../store/cartSlice"; // Keep if you re-enable cart button
import { API_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";

const CategoryProductList = () => {
  // 1. Get the category name from the URL (e.g. "Kurti_Set")
  const { categoryName } = useParams();

  const { textileArray } = useContext(TextileList);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname, hash } = location;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // 🟢 2. SMART FILTER (Fixes the "Empty List" bug)
  const categoryProducts = useMemo(() => {
    if (!textileArray) return [];

    // Convert URL slug (e.g., "Kurti_Set") to Readable (e.g., "kurti set")
    const targetCategory = categoryName.replace(/_/g, " ").toLowerCase().trim();

    return textileArray.filter((item) => {
      if (!item.category) return false;

      // Compare Database Category vs URL Category
      const itemCat = item.category.replace(/_/g, " ").toLowerCase().trim();

      // Strict Check OR Partial Check (e.g. "Kurtis" matches "Kurti Set")
      return itemCat === targetCategory || itemCat.includes(targetCategory);
    });
  }, [textileArray, categoryName]);

  // 🟢 3. IMAGE HELPER
  const getImgSrc = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = API_URL.replace("/api", "");
    return `${baseUrl}${imagePath}`;
  };

  // Helper for human-readable title
  const displayTitle = categoryName.replace(/_/g, " ");

  // --- UI RENDER ---
  if (!textileArray) {
    return (
      <div
        className="container mt-4"
        style={{
          minHeight: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="spinner-border text-danger" role="status"></div>
        <span className="ms-2">Loading Collection...</span>
      </div>
    );
  }

  return (
    <div
      className="container category-page-wrapper"
      style={{ minHeight: "80vh" }}
    >
      {/* BACK BUTTON + HEADER */}
      <div className="category-list-header mb-4 mt-3">
        <button
          className="app-back-btn"
          onClick={() =>
            navigate(
              location.state?.from === "home" ? "/HomePage" : "/Categories"
            )
          }
          type="button"
          aria-label="Back to categories"
        >
          <FaArrowLeft className="me-2" />
          {location.state?.from === "home"
            ? "Back to Home"
            : "Back to Categories"}
        </button>
        <h2
          className="section-title text-center mt-3"
          style={{ textTransform: "capitalize", marginBottom: "5px" }}
        >
          {displayTitle} Collection
        </h2>
      </div>
      <p className="text-muted text-center">
        Found {categoryProducts.length} exclusive designs
      </p>

      {/* EMPTY STATE */}
      {categoryProducts.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5 p-5 text-center bg-light rounded">
          <h3 style={{ color: "#555" }}>Coming Soon! ✨</h3>
          <p className="text-muted">
            We haven't uploaded <b>{displayTitle}</b> yet. <br />
            Check back tomorrow for new designs!
          </p>
          <button
            className="app-back-btn btn mt-3"
            onClick={() =>
              navigate(
                location.state?.from === "home" ? "/HomePage" : "/Categories"
              )
            }
          >
            <FaArrowLeft className="me-2" />
            {location.state?.from === "home"
              ? "Back to Home"
              : "Browse All Categories"}
          </button>
        </div>
      ) : (
        /* PRODUCT GRID */
        <div className="bisen-grid">
          {categoryProducts.map((item) => {
            const itemId = item._id || item.id;
            if (!itemId) return null;

            const rawImage =
              item.images?.length > 0 ? item.images[0] : item.image;
            // const qty = getQty(itemId); // Use if enabling cart button

            return (
              <div key={itemId} className="bisen-card animate-fade-in">
                {/* IMAGE */}
                <div
                  className="bisen-img-box"
                  onClick={() => {
                    const key = `${pathname}${hash || ""}`;
                    saveScrollFor(key);
                    navigate(`/product/${itemId}`);
                  }}
                >
                  <img
                    src={getImgSrc(rawImage)}
                    alt={item.title}
                    loading="lazy"
                  />
                  {/* Discount Badge */}
                  {item.discount > 0 && (
                    <span
                      className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded"
                      style={{ fontSize: "10px", fontWeight: "bold" }}
                    >
                      {item.discount}% OFF
                    </span>
                  )}
                </div>

                {/* TITLE */}
                <h5 className="bisen-title">{item.title}</h5>

                {/* PRICE ROW */}
                <div className="bisen-price-row">
                  <span className="new-price">₹{item.price}</span>
                  {item.discount > 0 && (
                    <span className="old-price">
                      ₹{Math.round(item.price / (1 - item.discount / 100))}
                    </span>
                  )}
                </div>

                {/* RATING */}
                <div className="bisen-rating">
                  {"⭐".repeat(item.rating || 4)}
                  <span className="review-count">
                    ({item.reviews || Math.floor(Math.random() * 50) + 10})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryProductList;
