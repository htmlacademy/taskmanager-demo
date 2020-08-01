import {createElement} from '../render.js';

function createLoadMoreButtonTemplate() {
  return '<button class="load-more" type="button">load more</button>';
}

export default class LoadMoreButtonView {
  #element = null;

  get template() {
    return createLoadMoreButtonTemplate();
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
