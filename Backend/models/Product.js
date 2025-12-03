const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true }, // friendly url
  description: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // percent
  category: { type: String, index: true },
  images: [{ type: String }], // array of image URLs or local paths
  stock: { type: Number, default: 0 }, // inventory
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
  
});
//optionasl to pre save upDateAt
ProductSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model("product", ProductSchema);
