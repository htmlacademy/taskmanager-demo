import SiteMenuView from './view/site-menu.js';
import FilterView from './view/filter.js';
import {render, RenderPosition} from './utils/render.js';
import {generateTask} from './mock/task.js';
import {generateFilter} from './mock/filter.js';
import BoardPresenter from './presenter/board.js';
import TasksModel from './model/tasks.js';

const TASK_COUNT = 22;

const tasks = Array.from({length: TASK_COUNT}, generateTask);
const filters = generateFilter(tasks);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel);

render(siteHeaderElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters), RenderPosition.BEFOREEND);

boardPresenter.init();
