const { getProjectDate } = require("../controllers/projectControllers");
const express = require("express");
const router = express.Router();

router.get("/user/:userid", getProjectDate);

module.exports = router;
