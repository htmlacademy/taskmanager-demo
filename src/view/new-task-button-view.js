import AbstractView from '../framework/view/abstract-view.js';

const createNewTaskButtonTemplate = () => '<button class="control__button">+ ADD NEW TASK</button>';

export default class NewTaskButtonView extends AbstractView {
  get template() {
    return createNewTaskButtonTemplate();
  }
}
