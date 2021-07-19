import AbstractView from './abstract.js';
import {getNoTaskText} from '../utils/task.js';

const createNoTaskTemplate = (filter) => {
  const noTaskTextValue = getNoTaskText(filter);
  return (
    `<p class="board__no-tasks">
      ${noTaskTextValue}
    </p>`);
};

export default class NoTask extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoTaskTemplate(this._data);
  }
}
