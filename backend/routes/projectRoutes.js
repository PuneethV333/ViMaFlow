const { getProjectDate, addProjects } = require("../controllers/projectControllers");
const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get("/user/:userid", getProjectDate);
router.post("/addProj", verifyToken,addProjects);

module.exports = router;
