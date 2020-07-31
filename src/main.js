import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createFilterTemplate} from './view/filter-view.js';
import {createTaskTemplate} from './view/task-view.js';
import {createTaskEditTemplate} from './view/task-edit-view.js';
import {createLoadMoreButtonTemplate} from './view/load-more-button-view.js';
import {createBoardTemplate} from './view/board-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import {generateTask} from './mock/task.js';

const TASK_COUNT = 3;

const tasks = Array.from({length: TASK_COUNT}, generateTask);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

renderTemplate(siteHeaderElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createBoardTemplate(), RenderPosition.BEFOREEND);

const boardElement = siteMainElement.querySelector('.board');
const taskListElement = boardElement.querySelector('.board__tasks');

renderTemplate(taskListElement, createTaskEditTemplate(), RenderPosition.BEFOREEND);

for (let i = 0; i < TASK_COUNT; i++) {
  renderTemplate(taskListElement, createTaskTemplate(tasks[i]), RenderPosition.BEFOREEND);
}

renderTemplate(boardElement, createLoadMoreButtonTemplate(), RenderPosition.BEFOREEND);
