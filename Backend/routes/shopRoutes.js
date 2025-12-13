const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Your Product Model
const auth = require("../middleware/auth");   // 🛡️ Import Auth
const admin = require("../middleware/admin"); // 🛡️ Import Admin
const redisClient = require("../config/redis");
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
    const cacheKey = "all_products"; // The label for our "photocopy"
    // 1. Ask the Receptionist (Check Redis)
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      // ⚡ HIT: Found in Cache! Return instantly.
      console.log("⚡ Serving Products from Redis Cache");
      return res.json(JSON.parse(cachedData));
    }
    // 2. MISS: Not in Cache. Ask the CEO (MongoDB).
    console.log("🐌 Serving Products from MongoDB");
    const products = await Product.find().sort({ createdAt: -1 }); // Sort by newest

    // 3. Give a copy to Receptionist (Save to Redis)
    // 'EX', 3600 means "Expire in 1 hour" (Auto-refresh)
    await redisClient.set(cacheKey, JSON.stringify(products), {
      EX: 3600 
    });
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
    // 🧹 CACHE INVALIDATION
    // The list changed! Tear up the old photocopy.
    await redisClient.del("all_products"); 
    console.log("🧹 Redis Cache Cleared (New Product Added)");
    res.json(savedProduct);

  } catch (err) {
    console.error("❌ Add Product Error:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;