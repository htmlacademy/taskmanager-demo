import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const createSortTemplate = () => {
  return `<div class="board__filter-list">
    <a href="#" class="board__filter" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
    <a href="#" class="board__filter" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
    <a href="#" class="board__filter" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
  </div>`;
};

export default class Sort extends AbstractView {
  getTemplate() {
    return createSortTemplate();
  }
}
