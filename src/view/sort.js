import AbstractView from './abstract.js';
import {SortType} from '../const.js';

const createSortTemplate = () => (
  `<div class="board__sort-list">
    <a href="#" class="board__sort-item" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
    <a href="#" class="board__sort-item" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
    <a href="#" class="board__sort-item" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
  </div>`
);

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
