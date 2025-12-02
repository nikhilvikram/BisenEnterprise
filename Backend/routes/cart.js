const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // The security guard
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @route   POST api/cart/add
// @desc    Add item to cart
// @access  Private (Logged in users only)
router.post("/add", auth, async (req, res) => {
  const { productId, qty = 1 } = req.body;

  try {
    // 1. Get the user ID from the token (provided by auth middleware)
    const userId = req.user._id; // OR req.user._id depending on how you saved it

    // 2. Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // 3. Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Cart exists -> Check if product is already in it
      const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

      if (itemIndex > -1) {
        // Product exists in cart -> Update quantity
        cart.items[itemIndex].qty += qty;
      } else {
        // Product not in cart -> Push new item
        cart.items.push({ productId, qty });
      }
    } else {
      // No cart exists -> Create a new one
      cart = new Cart({
        userId,
        items: [{ productId, qty }]
      });
    }

    await cart.save();
    res.json(cart);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId", "title price image");
    if (!cart) {
        return res.json({ items: [] });
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route   DELETE api/cart/item/:productId
// @desc    Remove a specific item from cart
// @access  Private
router.delete("/item/:productId", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const productIdToRemove = req.params.productId;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    // Filter out the item to remove
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productIdToRemove
    );

    await cart.save();
    res.json(cart); // Send back updated cart

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;