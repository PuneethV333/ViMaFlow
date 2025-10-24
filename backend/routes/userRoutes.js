const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
  signInViaEmail,
  signUpViaEmail,
  viaGoogle,
  viaGit,
  updateProfilePic,
  updateBios,
  updateAiGeneratedPath,
} = require("../controllers/userControllers");

const router = express.Router();

router.get("/me", verifyToken, signInViaEmail);
router.post("/signup", signUpViaEmail);
router.post("/google", viaGoogle);
router.post("/git", viaGit);
router.post("/update/profilePic", updateProfilePic);
router.post("/update/bio", updateBios);
router.post("/update/aiGeneratedPath", updateAiGeneratedPath);

module.exports = router;
