const request = require("supertest");
const app = require("../app");

describe("Task Service unit tests", () => {

  test("GET /tasks returns task list", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /tasks creates new task", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "Test task", userId: 1 });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test task");
  });

});