import {createElement} from '../render.js';

function createNoTaskTemplate() {
  return (
    `<p class="board__no-tasks">
      Click «ADD NEW TASK» in menu to create your first task
    </p>`
  );
}
export default class NoTaskView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoTaskTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
