const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// ROUTE 1: Register User (POST /api/auth/register)
router.post("/register", async (req, res) => {
  // 1. Destructure "name" (Make sure your frontend sends 'name', not 'username')
  const { name, email, password } = req.body;

  try {
    // 2. Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 3. Create new user instance
    user = new User({ name, email, password });

    // 4. Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Save to DB
    await user.save();

    // 6. Create JWT Payload
    // FIX: Use user._id (Mongoose native ID) instead of user.id
    const payload = {
      user: {
        _id: user._id 
      }
    };

    // 7. Sign Token
jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        // ✅ FIX: Send User Data AND Token
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ROUTE 2: Login User (POST /api/auth/login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // 3. Create Payload
    // FIX: Consistent usage of _id
    const payload = {
      user: {
        _id: user._id 
      }
    };

  jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        // ✅ FIX: Send User Data AND Token
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ROUTE 3: Get Logged In User Data (GET /api/auth/me)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user comes from the middleware decoding the token
    // We use .select("-password") so we don't send the password hash back
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("Auth Me Error:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;