import {createElement} from '../render.js';

const createTaskListTemplate = () => '<div class="board__tasks"></div>';

export default class TaskListView {
  #element = null;

  get template() {
    return createTaskListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
