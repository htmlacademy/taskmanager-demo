import {render} from './framework/render.js';
import NewTaskButtonView from './view/new-task-button-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TasksModel from './model/tasks-model.js';
import FilterModel from './model/filter-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const tasksModel = new TasksModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(siteMainElement, tasksModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);

render(new NewTaskButtonView(), siteHeaderElement);

filterPresenter.init();
boardPresenter.init();
