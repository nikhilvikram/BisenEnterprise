const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Product = require("../models/Product"); // Or whatever your Product model is named
// Helper to make a slug (e.g., "Red Saree" -> "red-saree")
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
};
// @route   POST /api/products
// @desc    Add a new product
// @access  Admin Only
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { title, price, description, category, image, rating } = req.body;
// 1. Generate Slug
    // We add a random number to ensure uniqueness if two products have the same title
    const slug = createSlug(title) + "-" + Date.now();
    const newProduct = new Product({
      title,
      slug, // 👈 REQUIRED FIELD ADDED
      price,
      description,
      category,
      images: [image],
      rating: rating || 4,
      reviewsCount: 0
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error("Save Error:",err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;