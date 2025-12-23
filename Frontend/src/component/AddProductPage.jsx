import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCloudUploadAlt, FaArrowLeft } from "react-icons/fa";

const AddProductPage = () => {
  const navigate = useNavigate();
  // const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  // ✅ CORRECT (Smart Switching)
  const baseUrl =
    import.meta.env.MODE === "production"
      ? "https://bisenenterprise.onrender.com/api" // <--- Your Live Render Backend
      : "http://localhost:5000/api"; // <--- Your Local Testing
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Saree", // Default
    image: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/products`, formData, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      });
      alert("Product Added Successfully! 🎉");
      navigate("/crm"); // Go back to CRM
    } catch (err) {
      alert("Error adding product. Check permissions.");
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "600px" }}>
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/crm")}
      >
        <FaArrowLeft /> Back to CRM
      </button>

      <div className="card shadow p-4">
        <h3 className="mb-4 fw-bold">Upload New Product 📤</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Product Title</label>
            <input
              name="title"
              className="form-control"
              required
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                className="form-control"
                required
                onChange={handleChange}
              />
            </div>
            {/* 🆕 STOCK INPUT FIELD */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Initial Stock Qty</label>
              <input
                type="number"
                name="stock"
                className="form-control"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                onChange={handleChange}
              >
                <option value="Saree">Saree</option>
                <option value="Kurta">Kurta</option>
                <option value="Lehenga">Lehenga</option>
                <option value="Jewellery">Jewellery</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              name="image"
              className="form-control"
              placeholder="https://..."
              required
              onChange={handleChange}
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 rounded"
                style={{ height: "80px" }}
              />
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              required
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
            <FaCloudUploadAlt /> Publish Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
