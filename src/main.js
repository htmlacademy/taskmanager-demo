import SiteMenuView from './view/site-menu-view.js';
import FilterView from './view/filter-view.js';
import {render, RenderPosition} from './utils/render.js';
import {generateTask} from './mock/task.js';
import BoardPresenter from './presenter/board-presenter.js';
import TasksModel from './model/tasks-model.js';
import FilterModel from './model/filter-model.js';

const TASK_COUNT = 22;

const tasks = Array.from({length: TASK_COUNT}, generateTask);
const filters = [
  {
    type: 'all',
    name: 'ALL',
    count: 0,
  },
];

const tasksModel = new TasksModel();
tasksModel.tasks = tasks;

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel);

render(siteHeaderElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters, 'all'), RenderPosition.BEFOREEND);

boardPresenter.init();
