import {nanoid} from "nanoid";
import TasksModel from "../model/tasks.js";

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (Provider.isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          const items = createStoreStructure(tasks.map(TasksModel.adaptToServer));
          this._store.setItems(items);
          return tasks;
        });
    }

    const storeTasks = Object.values(this._store.getItems());

    return Promise.resolve(storeTasks.map(TasksModel.adaptToClient));
  }

  updateTask(task) {
    if (Provider.isOnline()) {
      return this._api.updateTask(task)
        .then((updatedTask) => {
          this._store.setItem(updatedTask.id, TasksModel.adaptToServer(updatedTask));
          return updatedTask;
        });
    }

    this._store.setItem(task.id, TasksModel.adaptToServer(Object.assign({}, task)));

    return Promise.resolve(task);
  }

  addTask(task) {
    if (Provider.isOnline()) {
      return this._api.addTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, TasksModel.adaptToServer(newTask));
          return newTask;
        });
    }

    // На случай локального создания данных мы должны сами создать `id`.
    // Иначе наша модель будет не полной, и это может привнести баги
    const localNewTaskId = nanoid();
    const localNewTask = Object.assign({}, task, {id: localNewTaskId});

    this._store.setItem(localNewTask.id, TasksModel.adaptToServer(localNewTask));

    return Promise.resolve(localNewTask);
  }

  deleteTask(task) {
    if (Provider.isOnline()) {
      return this._api.deleteTask(task)
        .then(() => this._store.removeItem(task.id));
    }

    this._store.removeItem(task.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storeTasks = Object.values(this._store.getItems());

      return this._api.sync(storeTasks)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdTasks = getSyncedTasks(response.created);
          const updatedTasks = getSyncedTasks(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdTasks, ...updatedTasks]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
