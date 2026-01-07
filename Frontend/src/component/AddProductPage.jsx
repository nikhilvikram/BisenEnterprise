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
    stock: "", // Added stock
    category: "Saree",
    description: "",
  });

  // 2. Separate State for the File
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Show preview instantly
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 3. Prepare FormData (Required for File Uploads)
    const data = new FormData();
    data.append("image", file); // Must match backend: upload.single('image')
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("description", formData.description);

    try {
      // 4. Send as Multipart Form Data
      await axios.post(`${API_URL}/products`, data, {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "multipart/form-data", // Crucial header
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
          </div>

          {/* 📸 IMAGE UPLOAD SECTION */}
          <div className="mb-3">
            <label className="form-label fw-bold">Product Image</label>
            <div className="border p-3 rounded text-center" style={{ backgroundColor: "#f8f9fa" }}>
              <input
                type="file"
                name="image"
                className="form-control mb-2"
                accept="image/*"
                required
                onChange={handleFileChange}
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="img-thumbnail mt-2 shadow-sm"
                  style={{ maxHeight: "150px", objectFit: "cover" }}
                />
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
              <span><FaCloudUploadAlt /> Publish Product</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;