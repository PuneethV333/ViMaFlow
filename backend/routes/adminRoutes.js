const express = require('express');
const router = express.Router()
const { getAllUser } = require('../controllers/adminControllers');
const verifyToken = require('../middleware/verifyToken');



router.get('/all',verifyToken,getAllUser);



module.exports = router;




