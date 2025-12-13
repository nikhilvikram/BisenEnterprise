const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product"); // 👈 Essential for stock updates
const admin = require("../middleware/admin");
const redisClient = require("../config/redis");

// @route   GET /api/orders
// @desc    Get all orders for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/orders/create
// @desc    Checkout (Convert Cart to Order AND Reduce Stock)
router.post("/create", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, paymentMethod, paymentId } = req.body;

    // 1. Find the user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // ============================================================
    // 🛑 STEP 2: STOCK CHECK (Validation)
    // ============================================================
    for (const item of cart.items) {
      if (!item.productId) continue;

      const product = await Product.findById(item.productId._id);

      // If product missing or stock too low
      if (!product || product.stock < item.qty) {
        return res.status(400).json({
          msg: `Sorry! ${product?.title || 'Item'} is out of stock or requested quantity is too high.`
        });
      }
    }

    // ============================================================
    // 📉 STEP 3: DEDUCT STOCK & PREPARE ORDER
    // ============================================================
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.productId) continue;

      // A. Reduce Stock in Database
      const product = await Product.findById(item.productId._id);
      product.stock = product.stock - item.qty;

      // Safety: Never let it go below 0
      if (product.stock < 0) product.stock = 0;

      await product.save(); // ✅ Saved to DB

      // B. Prepare Order Snapshot
      const productDetails = {
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        qty: item.qty,
        image: item.productId.image || item.productId.images?.[0]
      };

      orderItems.push(productDetails);
      totalAmount += item.productId.price * item.qty;
    }

    // ============================================================
    // 🧹 STEP 4: CLEAR REDIS (Using Correct Key "active_products")
    // ============================================================
    try {
      if (redisClient.isOpen) {
        // 🔑 FIX: Must match the key used in shopRoutes.js
        await redisClient.del("active_products");
        console.log("🧹 Inventory Updated: Redis Cache Cleared");
      }
    } catch (e) {
      console.log("Redis warning:", e.message);
    }

    // 5. Create Order
    const newOrder = new Order({
      userId,
      products: orderItems,
      amount: totalAmount,
      address: address || { street: "Unknown", city: "Unknown" },
      status: "Processing",
      paymentMethod: paymentMethod || "COD",
      paymentId: paymentId || null
    });

    await newOrder.save();

    // 6. Clear Cart
    cart.items = [];
    await cart.save();

    res.json(newOrder);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/history
router.get("/history", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/orders/:id/status
router.put("/:id/status", [auth, admin], async (req, res) => {
  try {
    const { status } = req.body;
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = status;
    await order.save();

    // Note: Changing status usually doesn't affect stock, 
    // but if you have a "Cancelled" status logic later, you might want to restore stock here.

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/orders/all
router.get("/all", [auth, admin], async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/orders/:orderId/item/:productId
router.put("/:orderId/item/:productId", [auth, admin], async (req, res) => {
  try {
    const { qty } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) return res.status(404).json({ msg: "Order not found" });

    const itemIndex = order.products.findIndex(
      (p) => p.productId.toString() === req.params.productId
    );

    if (itemIndex === -1) return res.status(404).json({ msg: "Item not in order" });

    if (qty <= 0) {
      order.products.splice(itemIndex, 1);
    } else {
      order.products[itemIndex].qty = qty;
    }

    order.amount = order.products.reduce((sum, item) => sum + (item.price * item.qty), 0);

    await order.save();

    // Note: This Admin update changes the ORDER, but doesn't auto-adjust the Product stock.
    // That is a complex feature for later (Inventory Reconciliation).

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;