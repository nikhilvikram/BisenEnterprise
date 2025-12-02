require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
// In server.js (add these lines)
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart"); // Assuming you put the cart logic in routes/cart.js
const orderRoutes = require("./routes/orders");

const app = express();

app.use(express.json());
app.use(cors());

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
const PORT = 5000;
app.listen(PORT, () => console.log(`✔ Server running on port ${PORT}`));
