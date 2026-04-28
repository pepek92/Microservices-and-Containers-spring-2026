const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3002;

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Task Manager UI</title>
        <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">
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
              <h3>Tasks</h3>
              <ul id="task-list"></ul>
            </section>

            <section>
              <h3>Task Details</h3>
              <pre id="task-details">Select a task</pre>
            </section>

          </div>

          <section>
            <h3>User Info</h3>
            <pre id="user-info">Select a task to see user</pre>
          </section>

        </main>

        <script>
          async function loadTasks() {
            const res = await fetch('/tasks');
            const tasks = await res.json();

            const list = document.getElementById('task-list');
            list.innerHTML = '';

            tasks.forEach(task => {
              const item = document.createElement('li');
              item.textContent = \`#\${task.id} – \${task.title}\`;
              item.onclick = () => selectTask(task.id);
              list.appendChild(item);
            });
          }

          async function selectTask(taskId) {
            const taskRes = await fetch(\`/task/\${taskId}\`);
            const task = await taskRes.json();
            document.getElementById('task-details').textContent =
              JSON.stringify(task, null, 2);

            if (task.user && task.user.id) {
              const userRes = await fetch(\`/user/\${task.user.id}\`);
              const user = await userRes.json();
              document.getElementById('user-info').textContent =
                JSON.stringify(user, null, 2);
            }
          }

          loadTasks();
        </script>
      </body>
    </html>
  `);
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

app.get("/user/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `http://user-service:3001/users/${req.params.id}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.listen(PORT, () => {
  console.log(`UI Service running on port ${PORT}`);
});