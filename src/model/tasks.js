import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class Tasks extends AbstractObservable {
  constructor(apiService) {
    super();
    this._tasks = [];
    this._apiService = apiService;
  }

  init() {
    return this._apiService.getTasks()
      .then((tasks) => {
        this._tasks = tasks.map(this._adaptToClient);
      })
      .catch(() => {})
      .finally(() => {
        this._notify(UpdateType.INIT);
      });
  }

  getTasks() {
    return this._tasks;
  }

  updateTask(updateType, update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      return Promise.reject('Can\'t update unexisting task');
    }

    return this._apiService.updateTask(update)
      .then((response) => {
        const updatedTask = this._adaptToClient(response);
        this._tasks = [
          ...this._tasks.slice(0, index),
          updatedTask,
          ...this._tasks.slice(index + 1),
        ];

        this._notify(updateType, updatedTask);
      })
      .catch(() => {
        throw new Error('Can\'t update task');
      });
  }

  addTask(updateType, update) {
    return this._apiService.addTask(update)
      .then((response) => {
        const newTask = this._adaptToClient(response);
        this._tasks = [
          newTask,
          ...this._tasks,
        ];

        this._notify(updateType, newTask);
      })
      .catch(() => {
        throw new Error('Can\'t add task');
      });
  }

  deleteTask(updateType, update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      return Promise.reject('Can\'t delete unexisting task');
    }

    return this._apiService.deleteTask(update)
      .then(() => {
        // Обратите внимание, метод удаления задачи на сервере
        // ничего не возвращает. Это и верно,
        // ведь что можно вернуть при удалении задачи?
        this._tasks = [
          ...this._tasks.slice(0, index),
          ...this._tasks.slice(index + 1),
        ];

        this._notify(updateType);
      })
      .catch(() => {
        throw new Error('Can\'t delete task');
      });
  }

  _adaptToClient(task) {
    const adaptedTask = Object.assign(
      {},
      task,
      {
        dueDate: task['due_date'] !== null ? new Date(task['due_date']) : task['due_date'], // На клиенте дата хранится как экземпляр Date
        isArchive: task['is_archived'],
        isFavorite: task['is_favorite'],
        repeating: task['repeating_days'],
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedTask['due_date'];
    delete adaptedTask['is_archived'];
    delete adaptedTask['is_favorite'];
    delete adaptedTask['repeating_days'];

    return adaptedTask;
  }
}
