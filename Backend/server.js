require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
// In server.js (add these lines)
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart"); // Assuming you put the cart logic in routes/cart.js
const orderRoutes = require("./routes/orders");

const wishlistRoutes = require("./routes/wishlist");

const app = express();

app.use(express.json());
// Allow your GitHub URL and Localhost (for testing)
app.use(cors({
  origin: ["https://nikhilvikram.github.io", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// connect MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✔ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// register routes
app.use("/api/products", productRoutes);
// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`✔ Server running on port ${PORT}`));
