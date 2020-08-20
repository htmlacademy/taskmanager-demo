import AbstractView from '../framework/view/abstract-view.js';

function createNewTaskButtonTemplate() {
  return '<button class="control__button">+ ADD NEW TASK</button>';
}

export default class NewTaskButtonView extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewTaskButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
