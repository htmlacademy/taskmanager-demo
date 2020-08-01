import AbstractView from './abstract-view.js';

const createTaskListTemplate = () => '<div class="board__tasks"></div>';

export default class TaskListView extends AbstractView {
  get template() {
    return createTaskListTemplate();
  }
}
