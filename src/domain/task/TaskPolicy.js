const { ConflictException } = require("../../exception/ConflictException");

class TaskPolicy {
  static validateDuplicateTitle(repo, title, currentId = null) {
    const dup = repo
      .list()
      .find(
        (t) =>
          (!currentId || t.id !== currentId) &&
          t.title.toLowerCase() === title.toLowerCase(),
      );

    if (dup) {
      throw new ConflictException("Task title already exists", {
        domain: "task",
        details: { title },
      });
    }
  }
}

module.exports = { TaskPolicy };
