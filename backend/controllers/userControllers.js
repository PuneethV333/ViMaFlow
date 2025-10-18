const User = require("../models/user");

const signInViaEmail = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error fetching user" });
  }
};

const signUpViaEmail = async (req, res) => {
  try {
    const { email, firebaseUid, displayName } = req.body;
    if (!email || !firebaseUid || !displayName) {
      return res.status(400).json({ message: "Enter all the feilds" });
    }

    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      firebaseUid: firebaseUid,
      displayName: displayName,
      email: email,
    });

    await user.save();

    res.status(201).json(user);
  } catch (err) {
    console.error("Error Adding user:", err);
    res.status(500).json({ message: "Server error Adding user" });
  }
};

const viaGoogle = async (req, res) => {
  try {
    const { email, displayName, firebaseUid } = req.body;
    if (!email || !firebaseUid || !displayName) {
      return res.status(400).json({ message: "Enter all the feilds" });
    }

    const existingUser = await User.findOne({ firebaseUid: firebaseUid });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      firebaseUid: firebaseUid,
      displayName: displayName,
      email: email,
    });

    await user.save();

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error Adding google user" });
  }
};

const viaGit = async (req, res) => {
  try {
    const { email, displayName, firebaseUid } = req.body;
    if (!email || !firebaseUid || !displayName) {
      return res.status(400).json({ message: "Enter all the feilds" });
    }

    const existingUser = await User.findOne({ firebaseUid: firebaseUid });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      firebaseUid: firebaseUid,
      displayName: displayName,
      email: email,
    });

    await user.save();

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error Adding Github user" });
  }
};

module.exports = { signInViaEmail, signUpViaEmail, viaGoogle, viaGit };
