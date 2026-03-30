const express = require("express");
const request = require("supertest");

const { tasksRouter } = require("../src/routes/tasksRoutes");
const { TaskService } = require("../src/application/task/TaskService");
const {
  TaskRepositoryMemory,
} = require("../src/infrastructure/task/TaskRepositoryMemory");
const { TasksController } = require("../src/controller/task/TasksController");
const { errorMiddleware } = require("../src/handler/errorMiddleware");

function buildAppWithInMemoryRepo() {
  const app = express();
  app.use(express.json());

  const repo = new TaskRepositoryMemory();
  const service = new TaskService(repo);
  const controller = new TasksController(service);

  app.use("/tasks", tasksRouter(controller));

  app.use((req, res, next) => {
    const {
      NotFoundApiException,
    } = require("../src/exception/NotFoundApiException");

    next(
      new NotFoundApiException(
        `API ${req.method} ${req.originalUrl} not found`,
        { domain: "route" },
      ),
    );
  });

  app.use(errorMiddleware);

  return { app, repo };
}

describe("Task creation API", () => {
  test("create task with valid title returns task data", async () => {
    // Arrange
    const { app } = buildAppWithInMemoryRepo();

    // Act
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Learn Node.js" });

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Learn Node.js");
    expect(res.body.data.completed).toBe(false);
    expect(res.body.data.id).toBeDefined();
  });

  test("create task with empty body returns BAD_REQUEST", async () => {
    // Arrange
    const { app } = buildAppWithInMemoryRepo();

    // Act
    const res = await request(app).post("/tasks").send({});

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("BAD_REQUEST");
  });

  test("create task with duplicate title returns CONFLICT", async () => {
    // Arrange
    const { app } = buildAppWithInMemoryRepo();

    await request(app).post("/tasks").send({ title: "Dup" });

    // Act
    const res = await request(app).post("/tasks").send({ title: "Dup" });

    // Assert
    expect(res.status).toBe(409);
    expect(res.body.code).toBe("CONFLICT");
  });
});

describe("Task query API", () => {
  test("get paginated tasks returns correct metadata and data size", async () => {
    // Arrange
    const { app } = buildAppWithInMemoryRepo();

    await request(app).post("/tasks").send({ title: "T1" });
    await request(app).post("/tasks").send({ title: "T2" });

    // Act
    const res = await request(app).get("/tasks?page=0&size=1");

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.operationType).toBe("Success");
    expect(res.body.page).toBe(0);
    expect(res.body.pageSize).toBe(1);
    expect(res.body.totalElements).toBe(2);
    expect(res.body.totalPages).toBe(2);
    expect(res.body.data).toHaveLength(1);
  });

  test("get task by invalid id returns BAD_REQUEST", async () => {
    // Arrange
    const { app } = buildAppWithInMemoryRepo();

    // Act
    const res = await request(app).get("/tasks/abc");

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("BAD_REQUEST");
  });

  test("get task by non-existing id returns NOT_FOUND", async () => {
    // Arrange
    const { app } = buildAppWithInMemoryRepo();

    // Act
    const res = await request(app).get("/tasks/999");

    // Assert
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("NOT_FOUND");
    expect(res.body.domain).toBe("task");
  });
});

describe("Task update API", () => {
  test("update task with duplicate title returns CONFLICT", async () => {
    // Arrange
    const { app } = buildAppWithInMemoryRepo();

    await request(app).post("/tasks").send({ title: "T1" });
    await request(app).post("/tasks").send({ title: "T2" });

    // Act
    const res = await request(app).put("/tasks/2").send({ title: "T1" });

    // Assert
    expect(res.status).toBe(409);
    expect(res.body.code).toBe("CONFLICT");
  });
});

describe("Route handling", () => {
  test("unknown endpoint returns NOT_FOUND route error", async () => {
    // Arrange
    const { app } = buildAppWithInMemoryRepo();

    // Act
    const res = await request(app).get("/unknown");

    // Assert
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("NOT_FOUND");
    expect(res.body.domain).toBe("route");
  });
});
