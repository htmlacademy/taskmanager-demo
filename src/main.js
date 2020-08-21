import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import {render, RenderPosition} from './utils/render.js';
import {generateTask} from './mock/task.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import TasksModel from './model/tasks.js';
import FilterModel from './model/filter.js';
import {MenuItem} from './const.js';

const TASK_COUNT = 22;

const tasks = Array.from({length: TASK_COUNT}, generateTask);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
const siteMenuComponent = new SiteMenuView();

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);

const handleTaskNewFormClose = () => {
  siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  siteMenuComponent.getElement().querySelector(`[value=${MenuItem.STATISTICS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      // Скрыть статистику
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
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      filterPresenter.destroy();
      boardPresenter.destroy();
      // Показать статистику
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

// Для удобства отладки скроем Фильтры и доску
// filterPresenter.init();
// boardPresenter.init();
// и отобразим сразу статистику
render(siteMainElement, new StatisticsView(tasksModel.getTasks()), RenderPosition.BEFOREEND);
