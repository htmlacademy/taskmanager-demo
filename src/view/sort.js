import AbstractView from './abstract.js';

const createSortTemplate = () => (
  `<div class="board__sort-list">
    <a href="#" class="board__sort-item">SORT BY DEFAULT</a>
    <a href="#" class="board__sort-item">SORT BY DATE up</a>
    <a href="#" class="board__sort-item">SORT BY DATE down</a>
  </div>`
);

export default class Sort extends AbstractView {
  getTemplate() {
    return createSortTemplate();
  }
}
