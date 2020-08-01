import {createElement} from '../render.js';

const createBoardTemplate = () => '<section class="board container"></section>';

export default class BoardView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createBoardTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
