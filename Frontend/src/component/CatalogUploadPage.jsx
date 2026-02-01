import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { FaCheckCircle, FaRobot, FaArrowLeft } from "react-icons/fa";
import "../styles/shared-buttons.css";
import "../styles/catalog-upload.css";

const CatalogUploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [draftProducts, setDraftProducts] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [phase, setPhase] = useState("idle");
  const eventSourceRef = useRef(null);

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
      "Uploading & Running AI Pipeline (This may take time)... 🤖"
    );
    setLogs([]);
    setPhase("upload");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/pipeline/process`, formData);
      const newJobId = res.data.jobId;
      setJobId(newJobId);

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const streamUrl = `${API_URL}/pipeline/process/stream/${newJobId}`;
      const es = new EventSource(streamUrl);
      eventSourceRef.current = es;

      es.addEventListener("log", (evt) => {
        const payload = JSON.parse(evt.data);
        const message = payload.message || "";
        setLogs((prev) => [...prev, message].slice(-80));

        if (message.includes("Checking")) setPhase("extract");
        if (message.includes("Uploading")) setPhase("uploading");
        if (message.includes("Cleaned up")) setPhase("cleanup");
      });

      es.addEventListener("error", (evt) => {
        const payload = JSON.parse(evt.data || "{}");
        const message = payload.message || "Pipeline error.";
        setLogs((prev) => [...prev, message].slice(-80));
        setPhase("error");
        setLoading(false);
        es.close();
      });

      es.addEventListener("done", async () => {
        es.close();
        const statusRes = await axios.get(
          `${API_URL}/pipeline/process/status/${newJobId}`
        );
        if (statusRes.data.status === "done") {
          const preparedDrafts = statusRes.data.products.map((p) => ({
            ...p,
            price: "",
            stock: 10,
            category: p.category || "General",
          }));
          setDraftProducts(preparedDrafts);
          setPhase("review");
        } else {
          setPhase("error");
        }
        setLoading(false);
      });
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

  // 3. Back to upload (clear drafts)
  const handleBack = () => {
    setDraftProducts([]);
    setFile(null);
    setJobId(null);
    setLogs([]);
    setPhase("idle");
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  // 4. Final Publish
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

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="container mt-5 catalog-page">
      <div className="catalog-header">
        <div>
          <h2 className="catalog-title">AI Catalog Automator</h2>
          <p className="catalog-subtitle">
            Upload a PDF or image and let the AI prepare your products.
          </p>
        </div>
        <div className="catalog-badge">
          <FaRobot /> AI Pipeline
        </div>
      </div>

      {/* SECTION 1: UPLOAD */}
      {draftProducts.length === 0 && (
        <div className="catalog-upload-card">
          <label className="catalog-upload-area">
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              className="catalog-file-input"
            />
            <div className="catalog-upload-inner">
              <div className="catalog-upload-icon">
                <FaRobot />
              </div>
              <div className="catalog-upload-text">
                <h5>Drop your catalog here</h5>
                <p>PDF or high-quality product images</p>
              </div>
              {file && <div className="catalog-file-pill">{file.name}</div>}
            </div>
          </label>

          <div className="catalog-actions">
            <button
              className="btn btn-primary btn-lg catalog-primary-btn"
              onClick={handleProcess}
              disabled={loading}
            >
              {loading ? "Processing..." : "Process Catalog with AI"}
            </button>
          </div>

          {loading && (
            <div className="catalog-progress">
              <div className="catalog-progress-header">
                <div className="spinner-border text-danger" role="status"></div>
                <div>
                  <div className="catalog-progress-title">
                    AI Pipeline Running
                  </div>
                  <div className="catalog-progress-subtitle">{loadingText}</div>
                </div>
              </div>
              <div className="catalog-progress-bar">
                <div className="catalog-progress-fill" />
              </div>
              <div className="catalog-steps">
                <div
                  className={`catalog-step ${phase !== "idle" ? "active" : ""}`}
                >
                  Upload
                </div>
                <div
                  className={`catalog-step ${
                    ["extract", "uploading", "cleanup", "review"].includes(
                      phase
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  Extract
                </div>
                <div
                  className={`catalog-step ${
                    ["uploading", "cleanup", "review"].includes(phase)
                      ? "active"
                      : ""
                  }`}
                >
                  Upload
                </div>
                <div
                  className={`catalog-step ${
                    phase === "review" ? "active" : ""
                  }`}
                >
                  Review
                </div>
              </div>
              {logs.length > 0 && (
                <div className="catalog-log">
                  {logs.slice(-6).map((line, i) => (
                    <div key={i} className="catalog-log-line">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: REVIEW & EDIT */}
      {draftProducts.length > 0 && (
        <div className="animate-fade-in">
          <div className="catalog-review-header d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="d-flex align-items-center gap-3">
              <button
                className="app-back-btn btn"
                onClick={handleBack}
                type="button"
                aria-label="Back to upload"
              >
                <FaArrowLeft className="me-2" />
                Back to Upload
              </button>
              <div>
                <h4 className="mb-0">
                  Review AI Suggestions ({draftProducts.length} Items)
                </h4>
                <p className="catalog-review-subtitle">
                  Validate details before publishing to the store.
                </p>
              </div>
            </div>
            <button
              className="btn btn-success btn-lg catalog-publish-btn"
              onClick={handlePublish}
            >
              <FaCheckCircle /> Confirm & Publish All
            </button>
          </div>

          <div className="row">
            {draftProducts.map((prod, idx) => (
              <div className="col-md-6 mb-4" key={idx}>
                <div className="card h-100 shadow-sm border-primary catalog-review-card">
                  <div className="row g-0">
                    {/* Image Preview */}
                    <div className="col-md-4">
                      {prod.localImages && prod.localImages[0] && (
                        <img
                          src={getImageUrl(prod.localImages[0])}
                          className="img-fluid rounded-start catalog-ai-crop"
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
                              e.target.value
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
