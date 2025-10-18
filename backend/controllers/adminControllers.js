const User = require('../models/user');

const getAllUser = async (req,res) => {
    try {
        if(res.user || !req.user.isAdmin){
            return res.status(403).json({ message: "Access denied" });
        }
        const users = await User.find().select("-firebaseUid -__v");
        res.json(users);

    } catch (err) {
        console.error("Error fetching users:",err);
        res.status(500).json({ error: err.message });
    }
}




module.exports = { getAllUser };