const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("[UserService] DB error:", err);
  } else {
    console.log("[UserService] Connected to SQLite database");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT
    )
  `);

  console.log("[UserService] Seeding users table");

  db.run(
    `INSERT OR IGNORE INTO users (id, name) VALUES
      (1, 'Petteri Kivelä'),
      (2, 'Aku Ankka'),
      (3, 'Donald Duck')`
  );
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  console.log(`[UserService] Fetching user id=${userId}`);

  db.get(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    }
  );
});

module.exports = app;