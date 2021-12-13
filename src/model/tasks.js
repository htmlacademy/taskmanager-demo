import AbstractObserver from '../utils/abstract-observer.js';

export default class Tasks extends AbstractObserver {
  constructor() {
    super();
    this._tasks = [];
  }

  setTasks(updateType, tasks) {
    this._tasks = tasks.slice();

    this._notify(updateType);
  }

  getTasks() {
    return this._tasks;
  }

  updateTask(updateType, update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      // - Может лучше "" или `` вместо экранирования?
      throw new Error('Can\'t update unexisting task');
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      update,
      ...this._tasks.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addTask(updateType, update) {
    this._tasks = [
      update,
      ...this._tasks,
    ];

    this._notify(updateType, update);
  }

  deleteTask(updateType, update) {
    // - Может просто `this._tasks.filter`?
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      ...this._tasks.slice(index + 1),
    ];

    this._notify(updateType);
  }

  // - Не помню как конкретно принято в MVP, но объеденять бизнес логику с маппингом данных из источника данных – плохая
  // практика (вы, наверное, рассказываете про SOLID, не правда ли?). Под каждый истоник данных (сейчас у нас это 1 API)
  // должен быть свой класс маппер (TaskAPIDataMapper), который умеет мапить модель к структуре данных API.
  static adaptToClient(task) {
    const adaptedTask = Object.assign(
      {},
      task,
      {
        dueDate: task.due_date !== null ? new Date(task.due_date) : task.due_date, // На клиенте дата хранится как экземпляр Date
        isArchive: task['is_archived'],
        isFavorite: task['is_favorite'],
        repeating: task['repeating_days'],
      },
    );

    // - Так нельзя. Создайте DTO класс (типа TaskServerDTO) в конструкторе которого принимайте нужные поля.
    // Ненужные ключи мы удаляем
    delete adaptedTask['due_date'];
    delete adaptedTask['is_archived'];
    delete adaptedTask['is_favorite'];
    delete adaptedTask['repeating_days'];

    return adaptedTask;
  }

  static adaptToServer(task) {
    const adaptedTask = Object.assign(
      {},
      task,
      {
        'due_date': task.dueDate instanceof Date ? task.dueDate.toISOString() : null, // На сервере дата хранится в ISO формате
        'is_archived': task.isArchive,
        'is_favorite': task.isFavorite,
        'repeating_days': task.repeating,
      },
    );

    // - Тоже самое.
    // Ненужные ключи мы удаляем
    delete adaptedTask.dueDate;
    delete adaptedTask.isArchive;
    delete adaptedTask.isFavorite;
    delete adaptedTask.repeating;

    return adaptedTask;
  }
}
