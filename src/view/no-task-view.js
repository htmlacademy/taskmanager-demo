import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoTasksTextType = {
  [FilterType.ALL]: 'Click «ADD NEW TASK» in menu to create your first task',
  [FilterType.OVERDUE]: 'There are no overdue tasks now',
  [FilterType.TODAY]: 'There are no tasks today',
  [FilterType.FAVORITES]: 'There are no favorite tasks now',
  [FilterType.REPEATING]: 'There are no repeating tasks now',
  [FilterType.ARCHIVE]: 'There are no archive tasks now',
};

function createNoTaskTemplate(filterType) {
  const noTaskTextValue = NoTasksTextType[filterType];

  return (
    `<p class="board__no-tasks">
      ${noTaskTextValue}
    </p>`
  );
}
export default class NoTaskView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoTaskTemplate(this.#filterType);
  }
}
