import nanoid from "nanoid";
import Task from "../models/task";

const getSyncedTasks =
  (items) => items.filter(({success}) => success).map(({payload}) => payload.task);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getTasks() {
    if (this._isOnLine()) {
      return this._api.getTasks().then(
          (tasks) => {
            tasks.forEach((task) => this._store.setItem(task.id, task.toRAW()));
            return tasks;
          }
      );
    }

    const storeTasks = Object.values(this._store.getAll());

    this._isSynchronized = false;

    return Promise.resolve(Task.parseTasks(storeTasks));
  }

  createTask(task) {
    if (this._isOnLine()) {
      return this._api.createTask(task).then(
          (newTask) => {
            this._store.setItem(newTask.id, newTask.toRAW());
            return newTask;
          }
      );
    }

    // Нюанс в том, что при создании мы не указываем id задачи, нам его в ответе присылает сервер.
    // Но на случай временного хранения мы должны позаботиться и о временном id
    const fakeNewTaskId = nanoid();
    const fakeNewTask = Task.parseTask(Object.assign({}, task.toRAW(), {id: fakeNewTaskId}));

    this._isSynchronized = false;
    this._store.setItem(fakeNewTask.id, Object.assign({}, fakeNewTask.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewTask);
  }

  updateTask(id, task) {
    if (this._isOnLine()) {
      return this._api.updateTask(id, task).then(
          (newTask) => {
            this._store.setItem(newTask.id, newTask.toRAW());
            return newTask;
          }
      );
    }

    const fakeUpdatedTask = Task.parseTask(Object.assign({}, task.toRAW(), {id}));

    this._isSynchronized = false;
    this._store.setItem(id, Object.assign({}, fakeUpdatedTask.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedTask);
  }

  deleteTask(id) {
    if (this._isOnLine()) {
      return this._api.deleteTask(id).then(
          () => {
            this._store.removeItem(id);
          }
      );
    }

    this._isSynchronized = false;
    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storeTasks = Object.values(this._store.getAll());

      return this._api.sync(storeTasks)
        .then((response) => {
          // Удаляем из хранилища задачи, что были созданы
          // или изменены в оффлайне. Они нам больше не нужны
          storeTasks.filter((task) => task.offline).forEach((task) => {
            this._store.removeItem(task.id);
          });

          // Забираем из ответа синхронизированные задачи
          const createdTasks = getSyncedTasks(response.created);
          const updatedTasks = getSyncedTasks(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент,
          // вдруг сеть пропадёт
          [...createdTasks, ...updatedTasks].forEach((task) => {
            this._store.setItem(task.id, task);
          });

          // Помечаем, что всё синхронизировано
          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
