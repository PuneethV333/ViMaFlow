const User = require("../models/user");
const admin = require('../firebaseAdmin'); 

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (err) {
    console.error("Firebase Token Verification Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
