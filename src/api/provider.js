export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getTasks() {
    return this._api.getTasks();
  }

  createTask(task) {
    return this._api.createTask(task);
  }

  updateTask(id, task) {
    return this._api.updateTask(id, task);
  }

  deleteTask(id) {
    return this._api.deleteTask(id);
  }
}
