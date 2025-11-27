require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");

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

const PORT = 5000;
app.listen(PORT, () => console.log(`✔ Server running on port ${PORT}`));
