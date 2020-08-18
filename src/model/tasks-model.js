import Observable from '../framework/observable.js';
import {generateTask} from '../mock/task.js';

export default class TasksModel extends Observable {
  #tasks = Array.from({length: 22}, generateTask);

  get tasks() {
    return this.#tasks;
  }
}
