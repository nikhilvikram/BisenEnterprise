const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Product = require("../models/Product"); // Or whatever your Product model is named

// @route   POST /api/products
// @desc    Add a new product
// @access  Admin Only
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { title, price, description, category, image, rating } = req.body;

    const newProduct = new Product({
      title,
      price,
      description,
      category,
      image,
      rating: rating || 4,
      reviews: 0
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;