const { Task } = require("../../domain/task/Task");
const {
  parseCreateTask,
  parseUpdateTask,
} = require("../../dto/tasks/TasksRequestDTO");
const { BadRequestException } = require("../../exception/BadRequestException");
const { NotFoundException } = require("../../exception/NotFoundException");
const { paginateArray, parsePaginationQuery } = require("../../utils/paginate");
const { TaskPolicy } = require("../../domain/task/TaskPolicy");

function parseId(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestException("Invalid id", { domain: "request" });
  }
  return id;
}

class TaskService {
  constructor(taskRepo) {
    this._repo = taskRepo;
    this._nextId = 1;
  }

  create(body) {
    const dto = parseCreateTask(body);

    TaskPolicy.validateDuplicateTitle(this._repo, dto.title);

    const task = Task.create({ id: this._nextId++, title: dto.title });

    return this._repo.create(task);
  }

  list() {
    return this._repo.list();
  }

  listPaged(query) {
    const { page, size } = parsePaginationQuery(query, {
      defaultPage: 0,
      defaultSize: 10,
      maxSize: 100,
    });

    return paginateArray(this._repo.list(), {
      page,
      size,
      maxSize: 100,
    });
  }

  getById(idParam) {
    const id = parseId(idParam);

    const found = this._repo.getById(id);
    if (!found) {
      throw new NotFoundException("Task not found", { domain: "task" });
    }

    return found;
  }

  update(idParam, body) {
    const id = parseId(idParam);
    const patch = parseUpdateTask(body);

    const current = this._repo.getById(id);
    if (!current) {
      throw new NotFoundException("Task not found", { domain: "task" });
    }

    if (patch.title) {
      TaskPolicy.validateDuplicateTitle(this._repo, patch.title, current.id);
    }

    const updated = current.applyUpdate(patch);
    this._repo.update(updated);

    return updated;
  }

  delete(idParam) {
    const id = parseId(idParam);

    const current = this._repo.getById(id);
    if (!current) {
      throw new NotFoundException("Task not found", { domain: "task" });
    }

    this._repo.delete(id);

    return current;
  }
}

module.exports = { TaskService };
