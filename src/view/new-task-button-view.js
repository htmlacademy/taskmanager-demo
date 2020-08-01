import {createElement} from '../render.js';

const createNewTaskButtonTemplate = () => '<button class="control__button">+ ADD NEW TASK</button>';

export default class NewTaskButtonView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNewTaskButtonTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
