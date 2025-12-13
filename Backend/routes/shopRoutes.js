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

// 1. PUBLIC ROUTE (Customer View) - Only Stock > 0
router.get("/", async (req, res) => {
  try {
    const cacheKey = "active_products";

    // Safety check for Redis connection
    if (redisClient.isOpen) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) console.log("⚡ Serving Products from Redis Cache"); return res.json(JSON.parse(cachedData));
    }
    // 2. MISS: Not in Cache. Ask the CEO (MongoDB).
    console.log("🐌 Serving Products from MongoDB");
    const products = await Product.find({ stock: { $gte: 1 } }).sort({ createdAt: -1 });

    if (redisClient.isOpen) {
      await redisClient.set(cacheKey, JSON.stringify(products), { EX: 3600 });
    }

    res.json(products);
  } catch (err) {
    console.error("GET Products Error:", err);
    res.status(500).send("Server Error");
  }
});

// 2. ADMIN ROUTE (CRM View) - Show EVERYTHING
router.get("/admin/all", [auth, admin], async (req, res) => {
  try {
    // Admin needs to see 0 stock items to restock them!
    const products = await Product.find().sort({ stock: 1 }); // Sorted by lowest stock first
    res.json(products);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 3. CREATE PRODUCT (Add Stock Support)
router.post("/", [auth, admin], async (req, res) => {
  try {
    // 🆕 Accept 'stock' from frontend
    const { title, price, description, category, image, rating, stock } = req.body;
    const slug = createSlug(title) + "-" + Date.now();

    const newProduct = new Product({
      title, slug, price, description, category,
      images: [image],
      rating: rating || 4,
      reviewsCount: 0,
      stock: Number(stock) || 0 // 👈 Save the stock!
    });

    const savedProduct = await newProduct.save();

    // Clear Cache
    if (redisClient.isOpen) await redisClient.del("active_products");

    res.json(savedProduct);
  } catch (err) {
    console.error("Add Product Error:", err.message);
    res.status(500).send("Server Error");
  }
});

// 4. UPDATE STOCK ROUTE (The one causing 500 error)
router.put("/:id", [auth, admin], async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Update stock if provided
    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    await product.save();

    // 🛡️ SAFE REDIS CLEARING (Prevents crash if Redis is down)
    try {
      if (redisClient.isOpen) {
        await redisClient.del("active_products");
        console.log("🧹 Cache Cleared");
      }
    } catch (redisErr) {
      console.error("Redis Clear Failed (ignoring):", redisErr.message);
    }

    res.json(product);
  } catch (err) {
    console.error("Update Stock Error:", err.message); // 👈 Log the real error
    res.status(500).send("Server Error");
  }
});

module.exports = router;