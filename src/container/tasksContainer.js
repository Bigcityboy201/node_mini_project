const { TaskRepositoryMemory } = require("../infrastructure/task/TaskRepositoryMemory");
const { TaskService } = require("../application/task/TaskService");
const { TasksController } = require("../controller/task/TasksController");

function createTasksModule() {
  const repo = new TaskRepositoryMemory();
  const service = new TaskService(repo);
  const controller = new TasksController(service);

  return { repo, service, controller };
}

module.exports = { createTasksModule };

