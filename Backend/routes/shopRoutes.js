const express = require("express");
const router = express.Router();
const Product = require("../models/product"); // Make sure Product.js model exists

// GET all products
// Path becomes: /api/products/
router.get("/", async (req, res) => {
  try {
    const items = await Product.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Add error" });
  }
});

module.exports = router;