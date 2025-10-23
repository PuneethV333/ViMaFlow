const User = require("../models/user");

const signInViaEmail = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error fetching user" });
  }
};

const signUpViaEmail = async (req, res) => {
  try {
    const { email, firebaseUid, displayName } = req.body;
    if (!email || !firebaseUid || !displayName)
      return res.status(400).json({ message: "Enter all the fields" });

    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ firebaseUid, displayName, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ message: "Server error adding user" });
  }
};

const viaGoogle = async (req, res) => {
  try {
    const { email, displayName, firebaseUid } = req.body;
    if (!email || !firebaseUid || !displayName)
      return res.status(400).json({ message: "Enter all the fields" });

    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ firebaseUid, displayName, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding Google user:", err);
    res.status(500).json({ message: "Server error adding Google user" });
  }
};

const viaGit = async (req, res) => {
  try {
    const { email, displayName, firebaseUid } = req.body;
    if (!email || !firebaseUid || !displayName)
      return res.status(400).json({ message: "Enter all the fields" });

    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ firebaseUid, displayName, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Error adding GitHub user:", err);
    res.status(500).json({ message: "Server error adding GitHub user" });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    const { imageUrl, userid } = req.body;
    if (!imageUrl || !userid)
      return res.status(400).json({ message: "Enter all the fields" });

    const user = await User.findByIdAndUpdate(
      userid,
      { profilePic: imageUrl },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile picture updated", user });
  } catch (err) {
    console.error("Error updating profile pic:", err);
    res.status(500).json({ message: "Server error while updating image" });
  }
};

const updateBios = async (req, res) => {
  try {
    const { bio, userid } = req.body;
    if (!bio || !userid)
      return res.status(400).json({ message: "Enter all the fields" });

    const user = await User.findByIdAndUpdate(
      userid,
      { bio: bio },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile picture updated", user });
  } catch (err) {
    console.error("Error updating bios:", err);
    res.status(500).json({ message: "Server error while updating bios" });
  }
};

module.exports = {
  signInViaEmail,
  signUpViaEmail,
  viaGoogle,
  viaGit,
  updateProfilePic,
  updateBios
};
