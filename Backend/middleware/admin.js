const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    // 1. Get user details (req.user was already set by the 'auth' middleware)
    const user = await User.findById(req.user._id);

    // 2. Check Role
    if (user.role !== "admin" && user.role !== "superadmin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    // 3. Allow Access
    next();
  } catch (err) {
    res.status(500).send("Server Error");
  }
};