const app = require("./app");
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`[TaskService] Running on port ${PORT}`);
});