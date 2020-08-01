import {createElement} from "../utils.js";

const createNoTaskTemplate = () => {
  return `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
  </p>`;
};

export default class NoTask {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoTaskTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
