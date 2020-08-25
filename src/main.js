import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import {render, RenderPosition, remove} from './utils/render.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import TasksModel from './model/tasks.js';
import FilterModel from './model/filter.js';
import {MenuItem, UpdateType} from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://15.ecmascript.pages.academy/task-manager';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const api = new Api(END_POINT, AUTHORIZATION);

const tasksModel = new TasksModel();
const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuView();
const boardPresenter = new BoardPresenter(siteMainElement, tasksModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);

const handleTaskNewFormClose = () => {
  siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  siteMenuComponent.getElement().querySelector(`[value=${MenuItem.STATISTICS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      remove(statisticsComponent);
      filterPresenter.destroy();
      filterPresenter.init();
      boardPresenter.destroy();
      boardPresenter.init();
      boardPresenter.createTask(handleTaskNewFormClose);
      siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = true;
      siteMenuComponent.getElement().querySelector(`[value=${MenuItem.STATISTICS}]`).disabled = true;
      break;
    case MenuItem.TASKS:
      filterPresenter.init();
      boardPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      filterPresenter.destroy();
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(tasksModel.getTasks());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.init();
boardPresenter.init();

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(UpdateType.INIT, tasks);
    render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    tasksModel.setTasks(UpdateType.INIT, []);
    render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });
