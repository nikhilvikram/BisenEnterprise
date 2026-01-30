import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { FaCloudUploadAlt, FaCheckCircle, FaRobot } from "react-icons/fa";

const CatalogUploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [draftProducts, setDraftProducts] = useState([]);

  // 🟢 CATEGORY OPTIONS (Matches Python Logic)
  const CATEGORIES = [
    "Saree",
    "Nauvari",
    "Ready-to-wear Saree",
    "Lehenga",
    "Kurti Set",
    "Anarkali",
    "Western",
    "Co-ord Set",
    "Nightwear",
    "Lingerie",
    "Gowns",
    "Jewellery",
    "Bags",
  ];

  // Helper to point to Localhost Backend or S3
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    if (imagePath.startsWith("http")) return imagePath;
    const BASE_URL = API_URL.replace("/api", ""); // Use Config URL
    let cleanPath = imagePath.replace(/\\/g, "/");
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
    return `${BASE_URL}${cleanPath}`;
  };

  // 1. Handle File Upload & AI Processing
  const handleProcess = async () => {
    if (!file) return alert("Select a PDF/Image!");

    setLoading(true);
    setLoadingText(
      "Uploading & Running AI Pipeline (This may take time)... 🤖",
    );

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/pipeline/process`, formData);

      const preparedDrafts = res.data.products.map((p) => ({
        ...p,
        price: "",
        stock: 10,
        category: p.category || "General", // Ensure category exists
      }));

      setDraftProducts(preparedDrafts);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Pipeline Error. Check backend logs.");
      setLoading(false);
    }
  };

  // 2. Handle Inputs (Price, Stock, Category, Title)
  const handleInputChange = (index, field, value) => {
    const newDrafts = [...draftProducts];
    newDrafts[index][field] = value;
    setDraftProducts(newDrafts);
  };

  // 3. Final Publish
  const handlePublish = async () => {
    const invalid = draftProducts.find((p) => !p.price || !p.stock);
    if (invalid) return alert("Please fill Price & Stock for all items!");

    try {
      await axios.post(`${API_URL}/pipeline/publish`, {
        products: draftProducts,
      });
      alert("🚀 All Products Published Successfully!");
      setDraftProducts([]);
    } catch (err) {
      alert("Publish Error");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🤖 AI Catalog Automator</h2>

      {/* SECTION 1: UPLOAD */}
      {draftProducts.length === 0 && (
        <div className="card p-5 text-center shadow-sm">
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-control mb-3"
          />
          <button
            className="btn btn-primary btn-lg"
            onClick={handleProcess}
            disabled={loading}
          >
            {loading ? (
              loadingText
            ) : (
              <>
                <FaRobot /> Process Catalog with AI
              </>
            )}
          </button>
        </div>
      )}

      {/* SECTION 2: REVIEW & EDIT */}
      {draftProducts.length > 0 && (
        <div className="animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Review AI Suggestions ({draftProducts.length} Items)</h4>
            <button className="btn btn-success btn-lg" onClick={handlePublish}>
              <FaCheckCircle /> Confirm & Publish All
            </button>
          </div>

          <div className="row">
            {draftProducts.map((prod, idx) => (
              <div className="col-md-6 mb-4" key={idx}>
                <div className="card h-100 shadow-sm border-primary">
                  <div className="row g-0">
                    {/* Image Preview */}
                    <div className="col-md-4">
                      {prod.localImages && prod.localImages[0] && (
                        <img
                          src={getImageUrl(prod.localImages[0])}
                          className="img-fluid rounded-start"
                          style={{ height: "100%", objectFit: "cover" }}
                          alt="AI Crop"
                        />
                      )}
                    </div>

                    {/* Form Details */}
                    <div className="col-md-8">
                      <div className="card-body">
                        {/* Title Input */}
                        <label className="fw-bold small text-muted">
                          Title
                        </label>
                        <input
                          type="text"
                          className="form-control mb-2 fw-bold"
                          value={prod.product_title}
                          onChange={(e) =>
                            handleInputChange(
                              idx,
                              "product_title",
                              e.target.value,
                            )
                          }
                        />

                        {/* Category Dropdown (🟢 ADDED) */}
                        <div className="mb-2">
                          <label className="fw-bold small text-muted">
                            Category
                          </label>
                          <select
                            className="form-select border-primary"
                            value={prod.category}
                            onChange={(e) =>
                              handleInputChange(idx, "category", e.target.value)
                            }
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                            {!CATEGORIES.includes(prod.category) && (
                              <option value={prod.category}>
                                {prod.category}
                              </option>
                            )}
                          </select>
                        </div>

                        <p className="card-text small text-muted mb-2">
                          {prod.short_description}
                        </p>

                        <div className="row g-2">
                          <div className="col-6">
                            <label className="fw-bold small">Price (₹)</label>
                            <input
                              type="number"
                              className="form-control border-success"
                              placeholder="Price"
                              value={prod.price}
                              onChange={(e) =>
                                handleInputChange(idx, "price", e.target.value)
                              }
                              autoFocus={idx === 0}
                            />
                          </div>
                          <div className="col-6">
                            <label className="fw-bold small">Stock</label>
                            <input
                              type="number"
                              className="form-control"
                              value={prod.stock}
                              onChange={(e) =>
                                handleInputChange(idx, "stock", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="mt-2 small text-muted">
                          <strong>Attributes:</strong> {prod.attributes?.fabric}
                          , {prod.attributes?.color}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogUploadPage;
