import Observable from '../framework/observable.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #tasks = [];

  constructor({tasksApiService}) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  get tasks() {
    return this.#tasks;
  }

  async init() {
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#tasks = tasks.map(this.#adaptToClient);
    } catch(err) {
      this.#tasks = [];
    }
  }

  updateTask(updateType, update) {
    const index = this.#tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#tasks = [
      ...this.#tasks.slice(0, index),
      update,
      ...this.#tasks.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addTask(updateType, update) {
    this.#tasks = [
      update,
      ...this.#tasks,
    ];

    this._notify(updateType, update);
  }

  deleteTask(updateType, update) {
    const index = this.#tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#tasks = [
      ...this.#tasks.slice(0, index),
      ...this.#tasks.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #adaptToClient(task) {
    const adaptedTask = {...task,
      dueDate: task['due_date'] !== null ? new Date(task['due_date']) : task['due_date'], // На клиенте дата хранится как экземпляр Date
      isArchive: task['is_archived'],
      isFavorite: task['is_favorite'],
      repeating: task['repeating_days'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedTask['due_date'];
    delete adaptedTask['is_archived'];
    delete adaptedTask['is_favorite'];
    delete adaptedTask['repeating_days'];

    return adaptedTask;
  }
}
