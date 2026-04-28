const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());

// Yksi käyttäjä‑endpoint
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  res.json({
    id: userId,
    name: "Test User"
  });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});