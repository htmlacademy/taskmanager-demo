import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

const createSortTemplate = (currentSortType) => (
  `<div class="board__sort-list">
    <a href="#" class="board__sort-item ${currentSortType === SortType.DEFAULT ? 'board__sort-item--active' : ''}" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
    <a href="#" class="board__sort-item ${currentSortType === SortType.DATE_UP ? 'board__sort-item--active' : ''}" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
    <a href="#" class="board__sort-item ${currentSortType === SortType.DATE_DOWN ? 'board__sort-item--active' : ''}" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
  </div>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
