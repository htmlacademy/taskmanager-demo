import AbstractObservable from '../utils/abstract-observable.js';

export default class TasksModel extends AbstractObservable {
  #tasks = [];

  set tasks(tasks) {
    this.#tasks = [...tasks];
  }

  get tasks() {
    return this.#tasks;
  }
}
