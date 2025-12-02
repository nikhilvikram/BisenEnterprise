const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,  // Snapshot: Title at time of purchase
        price: Number,  // Snapshot: Price at time of purchase
        qty: Number
      }
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true }, // Simple object for now
    status: { type: String, default: "pending" }, // pending, shipped
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);