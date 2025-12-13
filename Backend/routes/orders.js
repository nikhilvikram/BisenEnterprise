const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const admin = require("../middleware/admin");

// @route   GET /api/orders
// @desc    Get all orders for the logged-in user
// @access  Private
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
// @desc    Checkout (Convert Cart to Order)
// @access  Private
router.post("/create", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    // 🆕 Extract Payment Details from Frontend
    const { address, paymentMethod, paymentId } = req.body; 

    // 1. Find the user's cart
    // CRITICAL: We use .populate() because the Cart only has IDs.
    // We need the ACTUAL Product Details (Price/Title) to calculate the bill.
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // 2. Calculate Total & Snapshot Items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.productId) continue;

      const productDetails = {
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        qty: item.qty,
        image: item.productId.image || item.productId.images?.[0] // Handle both schema styles
      };

      orderItems.push(productDetails);
      totalAmount += item.productId.price * item.qty;
    }

    // 3. Create Order
    const newOrder = new Order({
      userId,
      products: orderItems,
      amount: totalAmount,
      address: address || { street: "Unknown", city: "Unknown" },
      status: "Processing",
      // 🆕 Save Payment Info
      paymentMethod: paymentMethod || "COD",
      paymentId: paymentId || null
    });

    await newOrder.save();

    // 4. Clear Cart
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


// @route   PUT /api/orders/:id/status
// @desc    Update Order Status (For Admin/CRM)
// @access  Private (Should be Admin Only in future)
router.put("/:id/status", [auth, admin], async (req, res) => {
  try {
    const { status } = req.body; // e.g., "Shipped", "Delivered"

    // Find order by ID
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    // Update the status
    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/orders/all
// @desc    Get ALL orders (for CRM/Admin)
// @access  Private (Ideally Admin only)
router.get("/all", [auth, admin], async (req, res) => {
  try {
    // Fetch all orders, sorted by newest
    // .populate("userId") pulls the user's name/email so you know who bought it
    const orders = await Order.find()
      .populate("userId", "name email") 
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/orders/:orderId/item/:itemId
// @desc    Update Item Quantity in Order (Admin)
router.put("/:orderId/item/:productId", [auth, admin], async (req, res) => {
  try {
    const { qty } = req.body; // New Quantity
    const order = await Order.findById(req.params.orderId);

    if (!order) return res.status(404).json({ msg: "Order not found" });

    // 1. Find the item inside the order
    const itemIndex = order.products.findIndex(
      (p) => p.productId.toString() === req.params.productId
    );

    if (itemIndex === -1) return res.status(404).json({ msg: "Item not in order" });

    if (qty <= 0) {
      // Remove item if qty is 0
      order.products.splice(itemIndex, 1);
    } else {
      // Update qty
      order.products[itemIndex].qty = qty;
    }

    // 2. Recalculate Total Price
    order.amount = order.products.reduce((sum, item) => sum + (item.price * item.qty), 0);

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;