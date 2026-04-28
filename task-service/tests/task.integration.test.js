const request = require("supertest");
const app = require("../app");

describe("Task Service – Integration test", () => {

  test("GET /tasks/:id returns task with user data from User Service", async () => {

    const createResponse = await request(app)
      .post("/tasks")
      .send({ title: "Integration Test Task", userId: 1 });

    expect(createResponse.status).toBe(201);

    const taskId = createResponse.body.id;
    const response = await request(app)
      .get(`/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Integration Test Task");
    expect(response.body.user).toBeDefined();
    expect(response.body.user.name).toBe("Mickey Mouse");
  });

});