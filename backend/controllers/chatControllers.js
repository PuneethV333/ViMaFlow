const Chat = require("../models/chat");
const User = require("../models/user");

const getAllChatBtwTwoUser = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ message: "Sesender not found" });
    const receiver = await User.findById(receiverId);
    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });
    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("🔥 Error in Fetching Chats:", err);
    res.status(500).json({
      message: "Server error while Fetching Chats",
      error: err.message,
    });
  }
};

const sendNewMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const newChat = new Chat({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (err) {
    console.error("🔥 Error in sending Chats:", err);
    res.status(500).json({
      message: "Server error while sending Chats",
      error: err.message,
    });
  }
};

module.exports = { getAllChatBtwTwoUser, sendNewMessage }
