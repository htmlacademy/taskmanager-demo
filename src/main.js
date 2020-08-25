import SiteMenuView from "./view/site-menu.js";
import StatisticsView from "./view/statistics.js";
import {generateTask} from "./mock/task.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import TasksModel from "./model/tasks.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";
import Api from "./api.js";

const TASK_COUNT = 22;
const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/task-manager`;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const api = new Api(END_POINT, AUTHORIZATION);

api.getTasks().then((tasks) => {
  console.log(tasks);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuView();

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);

const handleTaskNewFormClose = () => {
  siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      remove(statisticsComponent);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      boardPresenter.createTask(handleTaskNewFormClose);
      siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = true;
      break;
    case MenuItem.TASKS:
      boardPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(tasksModel.getTasks());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();
