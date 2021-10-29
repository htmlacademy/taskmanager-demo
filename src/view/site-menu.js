import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

// Функцию для генерации HTML-разметки можно превратить в метод класса,
// однако делать мы этого не будем, чтобы не раздувать diff изменений
const createSiteMenuTemplate = () => (
  `<section class="control__btn-wrap">
    <input
      type="radio"
      name="control"
      id="control__new-task"
      class="control__input visually-hidden"
      value="${MenuItem.ADD_NEW_TASK}"
    />
    <label for="control__new-task" class="control__label control__label--new-task"
      >+ ADD NEW TASK</label
    >
    <input
      type="radio"
      name="control"
      id="control__task"
      class="control__input visually-hidden"
      value="${MenuItem.TASKS}"
      checked
    />
    <label for="control__task" class="control__label">TASKS</label>
    <input
      type="radio"
      name="control"
      id="control__statistic"
      class="control__input visually-hidden"
      value="${MenuItem.STATISTICS}"
    />
    <label for="control__statistic" class="control__label"
      >STATISTICS</label
    >
  </section>`
);

export default class SiteMenu extends AbstractView {
  getTemplate = () => createSiteMenuTemplate();

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('change', this.#menuClickHandler);
  }

  setMenuItem = (menuItem) => {
    const item = this.element.querySelector(`[value=${menuItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }
}
