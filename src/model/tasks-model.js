import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

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

    this._notify(UpdateType.INIT);
  }

  async updateTask(updateType, update) {
    const index = this.#tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#tasksApiService.updateTask(update);
      const updatedTask = this.#adaptToClient(response);
      this.#tasks = [
        ...this.#tasks.slice(0, index),
        updatedTask,
        ...this.#tasks.slice(index + 1),
      ];
      this._notify(updateType, updatedTask);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  }

  async addTask(updateType, update) {
    try {
      const response = await this.#tasksApiService.addTask(update);
      const newTask = this.#adaptToClient(response);
      this.#tasks = [newTask, ...this.#tasks];
      this._notify(updateType, newTask);
    } catch(err) {
      throw new Error('Can\'t add task');
    }
  }

  async deleteTask(updateType, update) {
    const index = this.#tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    try {
      // Обратите внимание, метод удаления задачи на сервере
      // ничего не возвращает. Это и верно,
      // ведь что можно вернуть при удалении задачи?
      await this.#tasksApiService.deleteTask(update);
      this.#tasks = [
        ...this.#tasks.slice(0, index),
        ...this.#tasks.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
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
