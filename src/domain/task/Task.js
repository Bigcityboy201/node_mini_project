const { BadRequestException } = require("../../exception/BadRequestException");

class Task {
  static create({ id, title }) {
    return new Task({ id, title, completed: false });
  }

  constructor({ id, title, completed = false }) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException("Invalid id", { domain: "task" });
    }
    if (typeof title !== "string" || title.trim().length === 0) {
      throw new BadRequestException("Title is required", { domain: "task" });
    }
    if (typeof completed !== "boolean") {
      throw new BadRequestException("Completed must be boolean", { domain: "task" });
    }

    this._id = id;
    this._title = title.trim();
    this._completed = completed;
    Object.freeze(this);
  }

  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get completed() {
    return this._completed;
  }

  rename(newTitle) {
    return new Task({ id: this.id, title: newTitle, completed: this.completed });
  }

  markCompleted() {
    return new Task({ id: this.id, title: this.title, completed: true });
  }

  markIncomplete() {
    return new Task({ id: this.id, title: this.title, completed: false });
  }

  setCompleted(completed) {
    if (typeof completed !== "boolean") {
      throw new BadRequestException("Completed must be boolean", { domain: "task" });
    }
    return completed ? this.markCompleted() : this.markIncomplete();
  }

  applyUpdate({ title, completed }) {
    let next = this;
    if (title !== undefined) next = next.rename(title);
    if (completed !== undefined) next = next.setCompleted(completed);
    return next;
  }

  toJSON() {
    return { id: this.id, title: this.title, completed: this.completed };
  }
}

module.exports = { Task };

