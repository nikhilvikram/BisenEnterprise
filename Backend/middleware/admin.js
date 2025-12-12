const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {

    // 1. Get User ID safely (Check both .id and ._id)
    // The auth middleware usually attaches the payload to req.user
    const userId = req.user?.id || req.user?._id;
    // Debug Log 1: Did we get a user ID?
if (!userId) {
      console.log("❌ Admin Middleware: No User ID found in request");
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await User.findById(userId);

    // Debug Log 2: Did we find the user?
    if (!user) {
        console.log("❌ User not found in DB");
        return res.status(404).json({ msg: "User not found" });
    }

    // Debug Log 3: What is the role?
    console.log("👤 User Role from DB:", user.role);

    if (user.role !== "admin" && user.role !== "superadmin") {
      console.log("⛔ Access Denied: Role is not admin/superadmin");
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    console.log("✅ Access Granted!");
    next();
  } catch (err) {
    console.error("💥 Admin Middleware Error:", err.message);
    res.status(500).send("Server Error");
  }
};