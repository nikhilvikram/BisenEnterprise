// server/models/User.js
const mongoose = require("mongoose");

/**
 * Address is embedded because addresses are small and accessed with user profile.
 * _id:false to avoid nested object ids if not needed.
 */
const AddressSchema = new mongoose.Schema({
  label: { type: String }, // e.g., "Home", "Office"
  name: { type: String }, // recipient name
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  pin: { type: String },
  phone: { type: String },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password: { type: String }, // hashed password (bcrypt)
  phone: { type: String, index: true, sparse: true }, // phone login optional
  addresses: [AddressSchema],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now }
});

// export model
module.exports = mongoose.model("User", UserSchema);
