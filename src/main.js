import {render} from './framework/render.js';
import NewTaskButtonView from './view/new-task-button-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TasksModel from './model/tasks-model.js';
import FilterModel from './model/filter-model.js';
import TasksApiService from './tasks-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://21.objects.pages.academy/task-manager';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const tasksModel = new TasksModel({
  tasksApiService: new TasksApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  tasksModel,
  filterModel,
  onNewTaskDestroy: handleNewTaskFormClose
});
const filterPresenter = new FilterPresenter({
  filterContainer: siteMainElement,
  filterModel,
  tasksModel
});
const newTaskButtonComponent = new NewTaskButtonView({
  onClick: handleNewTaskButtonClick
});

function handleNewTaskFormClose() {
  newTaskButtonComponent.element.disabled = false;
}

function handleNewTaskButtonClick() {
  boardPresenter.createTask();
  newTaskButtonComponent.element.disabled = true;
}

render(newTaskButtonComponent, siteHeaderElement);

filterPresenter.init();
boardPresenter.init();
