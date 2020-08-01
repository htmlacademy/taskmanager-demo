import SiteMenuView from './view/site-menu-view.js';
import {createFilterTemplate} from './view/filter-view.js';
import {createTaskTemplate} from './view/task-view.js';
import {createTaskEditTemplate} from './view/task-edit-view.js';
import {createLoadMoreButtonTemplate} from './view/load-more-button-view.js';
import {createBoardTemplate} from './view/board-view.js';
import {renderTemplate, renderElement, RenderPosition} from './render.js';
import {generateTask} from './mock/task.js';
import {generateFilter} from './mock/filter.js';

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = Array.from({length: TASK_COUNT}, generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

renderElement(siteHeaderElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilterTemplate(filters), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createBoardTemplate(), RenderPosition.BEFOREEND);

const boardElement = siteMainElement.querySelector('.board');
const taskListElement = boardElement.querySelector('.board__tasks');

renderTemplate(taskListElement, createTaskEditTemplate(tasks[0]), RenderPosition.BEFOREEND);

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  renderTemplate(taskListElement, createTaskTemplate(tasks[i]), RenderPosition.BEFOREEND);
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  renderTemplate(boardElement, createLoadMoreButtonTemplate(), RenderPosition.BEFOREEND);

  const loadMoreButton = boardElement.querySelector('.load-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderTemplate(taskListElement, createTaskTemplate(task), RenderPosition.BEFOREEND));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
