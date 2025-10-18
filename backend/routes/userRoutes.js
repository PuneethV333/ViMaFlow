const verifyToken = require("../middleware/verifyToken");
const {
  signInViaEmail,
  signUpViaEmail,
  viaGoogle,
  viaGit,
} = require("../controllers/userControllers");
const express = require("express");
const router = express.Router();

router.get("/me", verifyToken, signInViaEmail);

router.post("/signup", signUpViaEmail);
router.post("/google", viaGoogle);
router.post("/git", viaGit);

module.exports = router;
