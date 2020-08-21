import SiteMenuView from './view/site-menu-view.js';
import {render, RenderPosition} from './utils/render.js';
import {generateTask} from './mock/task.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TasksModel from './model/tasks-model.js';
import FilterModel from './model/filter-model.js';
import {MenuItem} from './const.js';

const TASK_COUNT = 22;

const tasks = Array.from({length: TASK_COUNT}, generateTask);

const tasksModel = new TasksModel();
tasksModel.tasks = tasks;

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
const siteMenuComponent = new SiteMenuView();

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      // Скрыть статистику
      // Показать фильтры
      // Показать доску
      // Показать форму добавления новой задачи
      // Убрать выделение с ADD NEW TASK после сохранения
      break;
    case MenuItem.TASKS:
      // Показать фильтры
      // Показать доску
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      // Скрыть фильтры
      // Скрыть доску
      // Показать статистику
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();

document.querySelector('#control__new-task').addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createTask();
});
