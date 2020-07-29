import {createElement} from '../render.js';

function createLoadMoreButtonTemplate() {
  return '<button class="load-more" type="button">load more</button>';
}

export default class LoadMoreButtonView {
  getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
