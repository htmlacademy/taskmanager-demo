import AbstractView from '../framework/view/abstract-view.js';

function createSortTemplate() {
  return (
    `<div class="board__sort-list">
      <a href="#" class="board__sort-item">SORT BY DEFAULT</a>
      <a href="#" class="board__sort-item">SORT BY DATE up</a>
      <a href="#" class="board__sort-item">SORT BY DATE down</a>
    </div>`
  );
}

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }
}
