const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Make sure Product.js model exists

// GET all products
// Path becomes: /api/products/
router.get("/", async (req, res) => {
  try {
    // 1. Fetch all products from MongoDB
    const products = await Product.find(); 
    
    // 2. Send them back to the client (Frontend)
    res.json(products); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
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