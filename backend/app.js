const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connect = require("./db/db");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const postRoutes = require("./routes/postRoutes");
const chatRoutes = require('./routes/chatRoutes');

connect();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.VITE_FRONTEND_URL,
  })
);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.send("All set");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/`);
});

module.exports = app;