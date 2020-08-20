import SiteMenuView from './view/site-menu-view.js';
import {render, RenderPosition} from './utils/render.js';
import {generateTask} from './mock/task.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TasksModel from './model/tasks-model.js';
import FilterModel from './model/filter-model.js';

const TASK_COUNT = 22;

const tasks = Array.from({length: TASK_COUNT}, generateTask);

const tasksModel = new TasksModel();
tasksModel.tasks = tasks;

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

render(siteHeaderElement, new SiteMenuView(), RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);

filterPresenter.init();
boardPresenter.init();

document.querySelector('#control__new-task').addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createTask();
});
