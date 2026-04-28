const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3002;

app.use(express.json())

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
      <head>
        <meta charset="UTF-8" />
        <title>Task Manager UI</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
        />
        <style>
          li {
            cursor: pointer;
            padding: 0.3rem;
          }
          li:hover {
            background-color: #f0f0f0;
          }
        </style>
      </head>

  <body>
    <main class="container">
      <h1>Task Manager</h1>

      <div class="grid">

        <section>
          <h3>➕ Create New Task</h3>
          <form onsubmit="createTask(event)">
            <label>
              Task title
              <input type="text" id="new-title" required />
            </label>

            <label>
              User ID
              <input type="number" id="new-user" value="1" required />
            </label>

            <button type="submit">Create Task</button>
          </form>
        </section>

        <section>
          <h3>Tasks</h3>
          <ul id="task-list"></ul>
        </section>

        <section>
          <h3>Task Details</h3>
          <div id="task-details">
            <em>Select a task</em>
          </div>
        </section>

      </div>
    </main>

    <script>
      async function loadTasks() {
        const res = await fetch("/tasks");
        const tasks = await res.json();
        const list = document.getElementById("task-list");
        list.innerHTML = "";

        tasks.forEach(task => {
          const item = document.createElement("li");
          item.textContent = "#" + task.id + " – " + task.title;
          item.onclick = function () { selectTask(task.id); };
          list.appendChild(item);
        });
      }

      async function createTask(event) {
        event.preventDefault();

        const title = document.getElementById("new-title").value;
        const userId = document.getElementById("new-user").value;

        await fetch("/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title, userId: userId })
        });

        document.getElementById("new-title").value = "";
        loadTasks();
      }

      async function selectTask(taskId) {
        const res = await fetch("/task/" + taskId);
        const task = await res.json();

        document.getElementById("task-details").innerHTML =
          "<div>" +
          "<strong>ID:</strong> " + task.id + "<br/>" +
          "<strong>Title:</strong> " + task.title + "<br/>" +
          "<strong>Status:</strong> " + task.status + "<br/>" +
          "<strong>User:</strong> " + task.user.name + "<br/><br/>" +
          "<button style='background-color:#e5533d;color:white;padding:0.5rem 1rem;' " +
          "onclick='deleteTask(" + task.id + ")'>🗑 Delete Task</button>" +
          "</div>";
      }

      async function deleteTask(taskId) {
        if (!confirm("Delete this task?")) return;

        await fetch("/tasks/" + taskId, { method: "DELETE" });
        document.getElementById("task-details").innerHTML = "<em>Select a task</em>";
        loadTasks();
      }

      loadTasks();
    </script>
  </body>
</html>
  `);
});

app.post("/tasks", async (req, res) => {
  try {
    const response = await axios.post(
      "http://task-service:3000/tasks",
      req.body
    );
    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.get("/task/:id", async (req, res) => {
  try {
    const taskResponse = await axios.get(
      `http://task-service:3000/tasks/${req.params.id}`
    );
    res.json(taskResponse.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `http://task-service:3000/tasks/${req.params.id}`
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const response = await axios.get(
      "http://task-service:3000/tasks"
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.listen(PORT, () => {
  console.log(`UI Service running on port ${PORT}`);
});