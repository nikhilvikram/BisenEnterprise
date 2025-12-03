const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" } // Stores Product IDs
  ]
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", WishlistSchema);