const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getTasks() {
    if (isOnline()) {
      return this._api.getTasks();
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  createTask(task) {
    if (isOnline()) {
      return this._api.createTask(task);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  updateTask(id, task) {
    if (isOnline()) {
      return this._api.updateTask(id, task);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  deleteTask(id) {
    if (isOnline()) {
      return this._api.deleteTask(id);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }
}
