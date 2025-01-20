const mongoose = require("mongoose");

// Defining the blog schema
const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "done"],
    required: true,
  },
});

// Creating the Blog model
mongoose.model("Task", TaskSchema);
