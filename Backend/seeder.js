import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// 1) CONNECT MONGODB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🌿 MongoDB Connected (Seeder)"))
  .catch((err) => console.log("❌ Mongo Error:", err));

// 2) DEFINE PRODUCT MODEL
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  category: String,
});

const Product = mongoose.model("Product", productSchema);

// 3) SEED DATA (YOUR 10 SAREES)
const sarees = [
  {
    title: "Elegant Red Silk Saree",
    price: 1200,
    image: "saree1.jpg",
    category: "Saree",
  },
  {
    title: "Pink Designer Festive Saree",
    price: 1450,
    image: "saree2.jpg",
    category: "Saree",
  },
  {
    title: "Traditional Green Kanjivaram Saree",
    price: 2500,
    image: "saree3.jpg",
    category: "Saree",
  },
  {
    title: "Royal Blue Soft Silk Saree",
    price: 1800,
    image: "saree4.jpg",
    category: "Saree",
  },
  {
    title: "Classic Black Partywear Saree",
    price: 1700,
    image: "saree5.jpg",
    category: "Saree",
  },
  {
    title: "Cream Wedding Embroidered Saree",
    price: 3500,
    image: "saree6.jpg",
    category: "Saree",
  },
  {
    title: "Yellow Banarasi Silk Saree",
    price: 2800,
    image: "saree7.jpg",
    category: "Saree",
  },
  {
    title: "Maroon Royal Kanjivaram Saree",
    price: 3200,
    image: "saree8.jpg",
    category: "Saree",
  },
  {
    title: "Purple Soft Tissue Saree",
    price: 2000,
    image: "saree9.jpg",
    category: "Saree",
  },
  {
    title: "Heavy Bridal Saree Collection",
    price: 5000,
    image: "saree10.jpg",
    category: "Saree",
  },
];

// 4) FUNCTION TO INSERT DATA
async function seedData() {
  try {
    await Product.deleteMany();
    console.log("🗑️ Old data cleared");

    await Product.insertMany(sarees);
    console.log("🌟 Saree data inserted successfully!");

    mongoose.connection.close();
  } catch (err) {
    console.log("❌ Error while seeding:", err);
  }
}

seedData();
