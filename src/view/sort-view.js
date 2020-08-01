import {createElement} from '../render.js';

const createSortTemplate = () => (
  `<div class="board__sort-list">
    <a href="#" class="board__sort-item">SORT BY DEFAULT</a>
    <a href="#" class="board__sort-item">SORT BY DATE up</a>
    <a href="#" class="board__sort-item">SORT BY DATE down</a>
  </div>`
);

export default class SortView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSortTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
