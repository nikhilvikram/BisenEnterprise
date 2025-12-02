// server/models/Cart.js
const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, default: 1, min: 1 }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

CartSchema.methods.getTotal = async function () {
  // example helper -> calculates total using product prices
  await this.populate("items.productId", "price discount").execPopulate();
  return this.items.reduce((sum, it) => {
    const p = it.productId;
    const price = p ? p.price : 0;
    const discounted = Math.round(price * (1 - (p.discount || 0)/100));
    return sum + discounted * it.qty;
  }, 0);
};

module.exports = mongoose.model("Cart", CartSchema);
