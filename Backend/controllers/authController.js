const jwt = require("jsonwebtoken");
const User = require("../models/User");
const firebaseAdmin = require("../config/firebaseAdmin");

const googleSync = async (req, res) => {
  const { token, email, displayName, photoURL } = req.body;

  if (!token) {
    return res.status(400).json({ msg: "Token is required" });
  }

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);

    if (email && decoded.email && email !== decoded.email) {
      return res.status(400).json({ msg: "Email mismatch" });
    }

    const verifiedEmail = (decoded.email || email || "").toLowerCase();
    if (!verifiedEmail) {
      return res.status(400).json({ msg: "Email not available" });
    }

    let user = await User.findOne({ email: verifiedEmail }).select("-password");
    if (user) {
      const payload = { user: { _id: user._id } };
      const appToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5 days",
      });
      return res.json({ token: appToken, user });
    }

    const name =
      decoded.name || displayName || verifiedEmail.split("@")[0] || "User";

    const newUser = new User({
      name,
      email: verifiedEmail,
      role: "client",
      isGoogleAuth: true,
      photoURL: photoURL || undefined,
    });

    await newUser.save();

    user = await User.findById(newUser._id).select("-password");
    const payload = { user: { _id: user._id } };
    const appToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5 days",
    });
    return res.json({ token: appToken, user });
  } catch (err) {
    console.error("Google sync error:", err);
    return res.status(401).json({ msg: "Invalid Firebase token" });
  }
};

module.exports = {
  googleSync,
};
