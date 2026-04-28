const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json());

const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) {
    console.error("DB error:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      status TEXT,
      userId INTEGER
    )
  `);
});

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const { title, userId } = req.body;

  db.run(
    "INSERT INTO tasks (title, status, userId) VALUES (?, ?, ?)",
    [title, "Created", userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "DB insert failed" });
      }
      console.log(`Created task with ID: ${this.lastID}`);
      res.status(201).json({
        id: this.lastID,
        title,
        status: "Created",
        userId
      });
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  db.run(
    "DELETE FROM tasks WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to delete task" });
      }
      console.log(`Deleted task with ID: ${req.params.id}`);
      res.json({ deleted: this.changes });
    }
  );
});

app.get("/tasks/:id", async (req, res) => {
  db.get(
    "SELECT * FROM tasks WHERE id = ?",
    [req.params.id],
    async (err, task) => {
      if (err || !task) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      try {
        const userResponse = await axios.get(
          `http://user-service:3001/users/${task.userId}`
        );
        res.json({ ...task, user: userResponse.data });
        console.log(`Fetched task with ID: ${req.params.id} and user data`);
      } catch {
        res.status(500).json({ error: "User service error" });
      }
    }
  );
});

module.exports = app;