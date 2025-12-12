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
        qty: item.qty,
        image: item.productId.image
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