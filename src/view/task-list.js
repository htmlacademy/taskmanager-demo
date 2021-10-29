import AbstractView from './abstract.js';

const createTaskListTemplate = () => '<div class="board__tasks"></div>';

export default class TaskList extends AbstractView {
  get template() {
    return createTaskListTemplate();
  }
}
