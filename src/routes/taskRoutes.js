const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Task = mongoose.model("Task");

const router = express.Router();

router.use(requireAuth);

router.get("/task/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);
    if (task) {
      res.status(200).send(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/userTask", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    if (tasks.length > 0) {
      res.status(200).send(tasks);

      req.io.emit("tasksFetched", tasks);
    } else {
      res.status(200).json({ message: "No records found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/addTask", async (req, res) => {
  const { title, description } = req.body;

  const task = new Task({
    title,
    description,
    userId: req.user._id,
    status: "pending",
  });

  try {
    const savedTask = await task.save();
    res.status(201).send(savedTask);

    req.io.emit("taskCreated", savedTask);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

// Delete a task and emit "taskDeleted"
router.delete("/deleteTask/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      throw new Error("Task not found");
    }

    res.status(200).send({ message: "Task deleted successfully" });

    req.io.emit("taskDeleted", { taskId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a task and emit "taskUpdated"
router.put("/updateTask/:id", async (req, res) => {
  const { title, description } = req.body;
  const taskId = req.params.id;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description },
      { new: true }
    );

    if (!updatedTask) {
      throw new Error("Task not found");
    }

    res.status(200).send(updatedTask);

    req.io.emit("taskUpdated", updatedTask);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
