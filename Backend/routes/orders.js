const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @route   GET /api/orders
// @desc    Get all orders for the logged-in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    // 🛑 FIX: Changed 'user' to 'userId' to match your POST route
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/orders/create
// @desc    Checkout (Convert Cart to Order)
// @access  Private
router.post("/create", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body; // User sends their address

    // 1. Find the user's cart
    // CRITICAL: We use .populate() because the Cart only has IDs.
    // We need the ACTUAL Product Details (Price/Title) to calculate the bill.
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // 2. Calculate Total & Create Order Items Snapshot
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      // Logic: If product was deleted from DB but still in cart, skip it
      if (!item.productId) continue;

      const productDetails = {
        productId: item.productId._id,
        title: item.productId.title, // Save title in case it changes later
        price: item.productId.price, // Save price (Snapshot)
        qty: item.qty
      };

      orderItems.push(productDetails);
      totalAmount += item.productId.price * item.qty;
    }

    // 3. Create the Order
    const newOrder = new Order({
      userId,
      products: orderItems,
      amount: totalAmount,
      address: address || { street: "Default St", city: "Pune" }, // Fallback if no address sent
      status: "Processing"
    });

    await newOrder.save();

    // 4. CLEAR THE CART (Checkout complete)
    cart.items = [];
    await cart.save();

    res.json(newOrder);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/history
// @desc    Get logged in user's order history
// @access  Private
router.get("/history", auth, async (req, res) => {
  try {
    // Find orders where userId matches logged in user
    // Sort by date: -1 means "Newest First"
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;