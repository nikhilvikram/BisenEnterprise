// server/models/Wishlist.js
const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
