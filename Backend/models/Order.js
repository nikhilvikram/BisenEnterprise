const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,  // Snapshot
        price: Number,  // Snapshot
        qty: Number,
        image: String   // Helpful for UI
      }
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true }, // Stores { line1, city, zip }
    status: { type: String, default: "Processing" }, // Processing, Shipped, Delivered, Cancelled
    
    // 🆕 NEW FIELDS FOR PAYMENT
    paymentMethod: { type: String, default: "COD" }, // "COD" or "ONLINE"
    paymentId: { type: String } // Razorpay Payment ID (if online)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);