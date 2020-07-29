import {createElement} from '../render.js';

const createLoadMoreButtonTemplate = () => '<button class="load-more" type="button">load more</button>';

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
