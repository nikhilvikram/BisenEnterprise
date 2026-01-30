import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCloudUploadAlt, FaArrowLeft, FaImage } from "react-icons/fa";
import { API_URL } from "../config";

const AddProductPage = () => {
  const navigate = useNavigate();

  // 1. State for text fields
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    category: "Saree",
    catalog: "",
    description: "",
  });

  // 🔴 FIX 1: Rename state to 'files' (plural) to match your loop below
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files; // This is a List of files

    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles); // Store the list

      // 🔴 FIX 2: createObjectURL only works on ONE file.
      // We grab the first one [0] just for the preview.
      setPreview(URL.createObjectURL(selectedFiles[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();

    // 🔴 FIX 3: Loop through the 'files' state correctly
    // (We iterate because FileList is array-like)
    for (let i = 0; i < files.length; i++) {
      data.append("images", files[i]);
    }

    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("catalog", formData.catalog);
    data.append("description", formData.description);

    try {
      await axios.post(`${API_URL}/products`, data, {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product Added Successfully! 🎉");
      navigate("/crm");
    } catch (err) {
      console.error(err);
      alert("Error adding product. Check console/permissions.");
    } finally {
      setIsLoading(false);
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
          {/* TITLE */}
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
            {/* PRICE */}
            <div className="col-md-4 mb-3">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                className="form-control"
                required
                onChange={handleChange}
              />
            </div>

            {/* STOCK */}
            <div className="col-md-4 mb-3">
              <label className="form-label">Stock Qty</label>
              <input
                type="number"
                name="stock"
                className="form-control"
                required
                onChange={handleChange}
              />
            </div>

            {/* CATEGORY */}
            <div className="col-md-4 mb-3">
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

            {/* Catalog */}
            <div className="col-md-4 mb-3">
              <label className="form-label">Catalog</label>
              <input
                name="catalog"
                className="form-control"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 📸 IMAGE UPLOAD SECTION */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Product Images (Select Multiple)
            </label>
            <div
              className="border p-3 rounded text-center"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <input
                type="file"
                multiple // Allow multiple files
                name="image"
                className="form-control mb-2"
                accept="image/*"
                required
                onChange={handleFileChange}
              />
              {preview ? (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-thumbnail shadow-sm"
                    style={{ maxHeight: "150px", objectFit: "cover" }}
                  />
                  {/* Show count of extra files if any */}
                  {files.length > 1 && (
                    <div className="text-muted small mt-1">
                      + {files.length - 1} more images selected
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted small mt-2">
                  <FaImage className="me-1" /> No image selected
                </div>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
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

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Uploading to AWS... ⏳</span>
            ) : (
              <span>
                <FaCloudUploadAlt /> Publish Product
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
