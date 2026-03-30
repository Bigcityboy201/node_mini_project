class TaskRepositoryMemory {
  constructor() {
    this._items = [];
  }

  list() {
    return [...this._items];
  }

  getById(id) {
    return this._items.find((t) => t.id === id) || null;
  }

  create(task) {
    this._items.push(task);
    return task;
  }

  update(task) {
    const idx = this._items.findIndex((t) => t.id === task.id);
    if (idx === -1) return null;
    this._items[idx] = task;
    return task;
  }

  delete(id) {
    const idx = this._items.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this._items.splice(idx, 1);
    return true;
  }
}

module.exports = { TaskRepositoryMemory };

