const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
  { id: 1, title: "First task", status: "Created", userId: 1 },
  { id: 2, title: "Second task", status: "InProgress", userId: 1 }
];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", async (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  try {
    const userResponse = await axios.get(
      `http://user-service:3001/users/${task.userId}`
    );

    res.json({
      ...task,
      user: userResponse.data
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.listen(PORT, () => {
  console.log(`Task Service running on port ${PORT}`);
});