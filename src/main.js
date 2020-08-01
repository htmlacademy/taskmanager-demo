import {render} from './framework/render.js';
import NewTaskButtonView from './view/new-task-button-view.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import TasksModel from './model/tasks-model.js';
import {generateFilter} from './mock/filter.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
const tasksModel = new TasksModel();
const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  tasksModel,
});

const filters = generateFilter(tasksModel.tasks);

render(new NewTaskButtonView(), siteHeaderElement);
render(new FilterView({filters}), siteMainElement);

boardPresenter.init();
