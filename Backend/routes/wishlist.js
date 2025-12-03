const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Wishlist = require("../models/Wishlist");

// @route   GET api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate("products");
    
    if (!wishlist) {
      return res.json([]); // Return empty array if no wishlist exists yet
    }
    
    res.json(wishlist.products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/wishlist/add/:id
// @desc    Add item to wishlist
// @access  Private
router.post("/add/:id", auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create new wishlist if doesn't exist
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      // Check if product already exists to avoid duplicates
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    
    // Return the updated list with full product details
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate("products");
    res.json(populatedWishlist.products);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/wishlist/remove/:id
// @desc    Remove item from wishlist
// @access  Private
router.delete("/remove/:id", auth, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      // Filter out the item
      wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
      await wishlist.save();

      const populatedWishlist = await Wishlist.findById(wishlist._id).populate("products");
      res.json(populatedWishlist.products);
    } else {
      res.json([]);
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;