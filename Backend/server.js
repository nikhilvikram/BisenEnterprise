require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// --- IMPORTS (Updated) ---
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const wishlistRoutes = require("./routes/wishlist");
const shopRoutes = require("./routes/shopRoutes");
const app = express();

app.use(express.json());

// CORS
app.use(cors({
  origin: ["https://nikhilvikram.github.io", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Connect Database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✔ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ✅ HEALTH CHECK ROUTE (Add this!)
app.get("/", (req, res) => {
  res.send("API is Running Live! 🚀");
});

// --- REGISTER ROUTES ---
app.use("/api/products", shopRoutes); // <--- Using the new file
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✔ Server running on port ${PORT}`));