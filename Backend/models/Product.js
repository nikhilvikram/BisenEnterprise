const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: String, index: true },
  catalog: { type: String, index: true },
  images: [{ type: String }], // Array of image URLs
  stock: { type: Number, default: 0 },
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 }
}, {
  // 🚀 AUTOMATIC TIMESTAMPS (Fixes the pre-save crash)
  timestamps: true
});

module.exports = mongoose.model("Product", ProductSchema);