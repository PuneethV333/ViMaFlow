const app = require("./app");
const http = require("http");
const connect = require("./db/db");
const socketIO = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();
connect();

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    socket.join(roomId);
    console.log(`👥 Joined room: ${roomId}`);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    io.to(roomId).emit("receiveMessage", { senderId, message });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

const PORT = process.env.SOCKETIO_PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
