const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Your Product Model
const auth = require("../middleware/auth");   // 🛡️ Import Auth
const admin = require("../middleware/admin"); // 🛡️ Import Admin

// --- HELPER FUNCTION: Create URL-Friendly Slug ---
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

// ==================================================
// @route   GET /api/products
// @desc    Get all products (Public)
// ==================================================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Sort by newest
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ==================================================
// @route   POST /api/products
// @desc    Add a new product (Admin Only)
// @access  Protected
// ==================================================
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { title, price, description, category, image, rating } = req.body;

    // 1. Generate Unique Slug
    const slug = createSlug(title) + "-" + Date.now();

    // 2. Create Object (Matching your Mongoose Schema)
    const newProduct = new Product({
      title,
      slug,                // Required by Schema
      price,
      description,
      category,
      images: [image],     // Schema expects Array: ['url']
      rating: rating || 4,
      reviewsCount: 0      // Initialize reviews
    });

    // 3. Save to DB
    const savedProduct = await newProduct.save();
    res.json(savedProduct);

  } catch (err) {
    console.error("❌ Add Product Error:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;