const express = require("express");
const { tasksRouter } = require("./src/routes/tasksRoutes");
const { createTasksModule } = require("./src/container/tasksContainer");
const { errorMiddleware } = require("./src/handler/errorMiddleware");
const { NotFoundApiException } = require("./src/exception/NotFoundApiException");

const app = express();
app.use(express.json());

const { controller: tasksController } = createTasksModule();
app.use("/tasks", tasksRouter(tasksController));

// 404 cho API không tồn tại
app.use((req, res, next) => {
  next(
    new NotFoundApiException(`API ${req.method} ${req.originalUrl} not found`, {
      domain: "route",
    }),
  );
});

app.use(errorMiddleware);

const basePort = Number(process.env.PORT || 3000);
const maxAttempts = 10;

function startServer(portAttempt) {
  const server = app.listen(portAttempt, () => {
    console.log(`Task API listening on http://localhost:${portAttempt}`);
  });

  server.on("error", (err) => {
    if (err?.code === "EADDRINUSE" && portAttempt < basePort + maxAttempts) {
      startServer(portAttempt + 1);
      return;
    }
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

startServer(basePort);
