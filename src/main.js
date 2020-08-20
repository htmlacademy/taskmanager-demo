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
const boardPresenter = new BoardPresenter(siteMainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);
const newTaskButtonComponent = new NewTaskButtonView();

const handleNewTaskFormClose = () => {
  newTaskButtonComponent.element.disabled = false;
};

const handleNewTaskButtonClick = () => {
  boardPresenter.createTask(handleNewTaskFormClose);
  newTaskButtonComponent.element.disabled = true;
};

render(newTaskButtonComponent, siteHeaderElement);
newTaskButtonComponent.setClickHandler(handleNewTaskButtonClick);

filterPresenter.init();
boardPresenter.init();
