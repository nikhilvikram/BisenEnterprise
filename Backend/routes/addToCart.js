// route: POST /api/cart/add
// body: { productId, qty = 1 }
const Cart = require("../models/Cart");
const Product = require("../models/Product");
// 1. Define the route and middleware
router.post("/add", authMiddleware, async (req, res) => {
  // 2. Destructuring input
  const { productId, qty = 1 } = req.body;
  // 3. Getting the logged-in user's ID
  const userId = req.user._id;

  // ensure product exists and stock check
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.stock < qty) return res.status(400).json({ message: "Not enough stock" });
// 6. Finding the Cart
  let cart = await Cart.findOne({ userId });
  // 7. Logic Flow: Create vs Update
  if (!cart) {
    // CASE A: User has no cart yet. Create a new one.
    cart = new Cart({ userId, items: [{ productId, qty }] });
  } else {
    // CASE B: User has a cart. Check if item exists.
    const existing = cart.items.find(i => i.productId.toString() === productId);
    if (existing)
      // Item exists -> Update Quantity (Stock check included)
      existing.qty = Math.min(product.stock, existing.qty + qty);
      
    else 
      // Item does not exist -> Push to array
    cart.items.push({ productId, qty });
  }
  cart.updatedAt = Date.now();
  await cart.save();

  res.json({ cart });
});
