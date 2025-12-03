const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @route   POST api/cart/add
// @desc    Add item to cart
// @access  Private (Logged in users only)
router.post("/add", auth, async (req, res) => {
  const { productId, qty = 1 } = req.body;

  try {
    // 1. Get the user ID from the token (FIXED: uses _id)
    const userId = req.user._id; 

    // 2. Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // 3. Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Cart exists -> Check if item is already in it
      const existing = cart.items.find(p => p.productId.toString() === productId);

      if (existing) {
        // Item exists -> Update quantity (Stock check included)
        existing.qty = Math.min(product.stock || 100, existing.qty + qty);
      } else {
        // Item doesn't exist -> Push new item
        cart.items.push({ productId, qty });
      }
    } else {
      // No cart exists -> Create a new one
      cart = new Cart({
        userId,
        items: [{ productId, qty }]
      });
    }

    cart.updatedAt = Date.now();
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
    // Populate gives you Title/Price/Image instead of just ID
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId", "title price image category");
    
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
// @desc    Remove item from cart
// @access  Private
router.delete("/item/:productId", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const productIdToRemove = req.params.productId;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productIdToRemove
    );

    await cart.save();
    res.json(cart);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/cart/update
// @desc    Update item quantity
// @access  Private
router.put("/update", auth, async (req, res) => {
  const { productId, qty } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

    if (itemIndex > -1) {
      if (qty > 0) {
        cart.items[itemIndex].qty = qty; // Update to exact number
      } else {
        cart.items.splice(itemIndex, 1); // Remove if 0
      }
      
      await cart.save();
      
      // Populate to return full data
      const updatedCart = await Cart.findOne({ userId }).populate("items.productId", "title price image category");
      res.json(updatedCart);
    } else {
      return res.status(404).json({ msg: "Item not found in cart" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


module.exports = router;