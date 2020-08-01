import AbstractView from './abstract-view.js';

const createNoTaskTemplate = () => (
  `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
  </p>`
);

export default class NoTaskView extends AbstractView {
  get template() {
    return createNoTaskTemplate();
  }
}
