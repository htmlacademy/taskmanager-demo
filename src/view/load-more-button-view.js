import AbstractView from '../framework/view/abstract-view.js';

function createLoadMoreButtonTemplate() {
  return '<button class="load-more" type="button">load more</button>';
}

export default class LoadMoreButtonView extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createLoadMoreButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
