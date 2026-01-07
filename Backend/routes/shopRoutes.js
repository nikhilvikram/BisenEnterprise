const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/uploadS3");
// 🟢 CRITICAL: Make sure this path is correct!
const redisClient = require("../config/redis");

// Helper for Slug
const createSlug = (text) => {
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

// ==================================================
// 1. PUBLIC ROUTE (Customer View)
// ==================================================
router.get("/", async (req, res) => {
  try {
    const cacheKey = "active_products";
    let cachedData = null;

    // 🛡️ Safe Redis Read
    try {
      if (redisClient && redisClient.isOpen) {
        cachedData = await redisClient.get(cacheKey);
      }
    } catch (redisErr) {
      console.error("⚠️ Redis GET Warning:", redisErr.message);
    }

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // 🐌 Database Fetch (Only Stock >= 1)
    const products = await Product.find({ stock: { $gte: 1 } }).sort({ createdAt: -1 });

    // 🛡️ Safe Redis Write
    try {
      if (redisClient && redisClient.isOpen) {
        await redisClient.set(cacheKey, JSON.stringify(products), { EX: 3600 });
      }
    } catch (redisErr) {
      console.error("⚠️ Redis SET Warning:", redisErr.message);
    }

    res.json(products);
  } catch (err) {
    console.error("❌ GET Products Fatal Error:", err);
    res.status(500).send("Server Error");
  }
});

// ==================================================
// 2. ADMIN ROUTE (CRM View - Shows stock 0 too)
// ==================================================
router.get("/admin/all", [auth, admin], async (req, res) => {
  try {
    const products = await Product.find().sort({ stock: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// ==================================================
// 3. CREATE PRODUCT (AWS S3 INTEGRATED)
// ==================================================
// 🟢 NOTICE: We added 'upload.single("image")' middleware here
router.post("/", [auth, admin, upload.single("image")], async (req, res) => {
  try {
    // 1. Extract text fields
    const { title, price, description, category, rating, stock } = req.body;
    
    // 2. Handle Image from AWS S3 (Multer adds req.file)
    // If upload worked, 'req.file.location' holds the S3 URL
    const imageUrl = req.file ? req.file.location : "https://via.placeholder.com/150";

    const slug = createSlug(title) + "-" + Date.now();

    const newProduct = new Product({
      title, 
      slug, 
      price, 
      description, 
      category,
      images: [imageUrl], // <--- Save the AWS S3 URL here
      rating: rating || 4,
      reviewsCount: 0,
      stock: Number(stock) || 0
    });

    const savedProduct = await newProduct.save();

    // Clear Cache
    try {
      if (redisClient && redisClient.isOpen) await redisClient.del("active_products");
    } catch (e) { }

    res.json(savedProduct);
  } catch (err) {
    console.error("❌ Create Product Error:", err);
    res.status(500).send("Server Error: " + err.message);
  }
});

// ==================================================
// 3. UPDATE STOCK ROUTE (Self-Healing Fix)
// ==================================================
router.put("/:id", [auth, admin], async (req, res) => {
  try {
    const { stock } = req.body;

    // 1. Find Product
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    // 2. Update Stock
    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    // 🩹 SELF-HEALING: If Slug is missing, create it now!
    if (!product.slug) {
      product.slug = createSlug(product.title) + "-" + Date.now();
      console.log(`🩹 Auto-fixed missing slug for: ${product.title}`);
    }

    // 3. Save (Now it passes validation)
    await product.save();
    console.log(`✅ Stock Updated for ${product.title} to ${product.stock}`);

    // 4. Clear Cache
    try {
      if (redisClient && redisClient.isOpen) {
        await redisClient.del("active_products");
        console.log("🧹 Redis Cache Cleared");
      }
    } catch (redisErr) {
      console.error("⚠️ Redis Clear Warning (Ignored):", redisErr.message);
    }

    res.json(product);

  } catch (err) {
    console.error("❌ Update Stock Fatal Error:", err);
    res.status(500).send("Server Error: " + err.message);
  }
});

// ==================================================
// 4. MIGRATION/RESET ROUTE (Run this once)
// ==================================================
router.post("/reset-stock-all", async (req, res) => {
  try {
    await Product.updateMany({}, { $set: { stock: 10 } });

    try {
      if (redisClient && redisClient.isOpen) await redisClient.del("active_products");
    } catch (e) { console.log("Redis skip"); }

    res.json({ msg: "All products reset to Stock 10" });
  } catch (err) {
    res.status(500).send("Reset Failed");
  }
});

// ... Keep your POST / (Create Product) and DELETE routes here ...
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { title, price, description, category, image, rating, stock } = req.body;
    const slug = createSlug(title) + "-" + Date.now();

    const newProduct = new Product({
      title, slug, price, description, category,
      images: [image],
      rating: rating || 4,
      reviewsCount: 0,
      stock: Number(stock) || 0
    });

    const savedProduct = await newProduct.save();

    try {
      if (redisClient && redisClient.isOpen) await redisClient.del("active_products");
    } catch (e) { }

    res.json(savedProduct);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;