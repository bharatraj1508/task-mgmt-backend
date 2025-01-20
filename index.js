require("dotenv").config();
require("./src/models/user");
require("./src/models/Task");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");

const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());

// Middleware to add Socket.IO to the request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGOURI);

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo instance");
});

mongoose.connection.on("error", (error) => {
  console.log("Error connecting to Mongo instance", error);
});

// Define routes
app.use("/auth", authRoutes);
app.use("/", taskRoutes);

app.get("/", (req, res) => {
  res.status(200).send({ message: "Server is online" });
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
server.listen(3000, () => {
  console.log("Listening on port 3000");
});
