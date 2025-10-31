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
  getAllUser,
  reviewResume,
  updateFollowing,
  giveRecommendation,
} = require("../controllers/userControllers");

const router = express.Router();

router.get("/me", verifyToken, signInViaEmail);
router.get("/suggestions", verifyToken, giveRecommendation);
router.get("/allUsers", getAllUser);
router.post("/signup", signUpViaEmail);
router.post("/google", viaGoogle);
router.post("/git", viaGit);
router.post("/update/profilePic", updateProfilePic);
router.post('/update/follow',verifyToken,updateFollowing);
router.post("/update/bio", updateBios);
router.post("/update/aiGeneratedPath", updateAiGeneratedPath);
router.post("/review",verifyToken ,reviewResume);

module.exports = router;




