import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

function createSortTemplate() {
  return (
    `<div class="board__sort-list">
      <a href="#" class="board__sort-item" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__sort-item" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__sort-item" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
    </div>`
  );
}

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }
}
