import AbstractView from './abstract.js';

const createLoadMoreButtonTemplate = () => '<button class="load-more" type="button">load more</button>';

export default class LoadMoreButton extends AbstractView {
  getTemplate = () => createLoadMoreButtonTemplate();

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}
