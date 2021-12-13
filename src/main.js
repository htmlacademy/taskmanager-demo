import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import TasksModel from './model/tasks.js';
import FilterModel from './model/filter.js';
import {isOnline} from './utils/common.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {toast} from './utils/toast.js';
import {MenuItem, UpdateType, FilterType} from './const.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

// - Вкусовщина, но: не люблю, когда сетапят код сразу в файле. Во всех качественных языках есть специальная функция
// main, которая воспроизводиться при начале работы приложения. Если надо сделать что-то до инициализации main
// используется функция `init` (как в Go) или подобное. Это позволяет контролировать флоу сетапинга приложения не на
// уровне импорта файлов, конкретно вручную программистом. Поэтому я бы обернул здесь все в `function main() {...}` и
// вызвал ее.

// - Эти константы должны быть частью внешней конфигурации (например, env)
const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://15.ecmascript.pages.academy/task-manager';
const STORE_PREFIX = 'taskmanager-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

// - Нет проверок ни здесь, ни далее по коду на NULL
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const tasksModel = new TasksModel();
const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuView();
const boardPresenter = new BoardPresenter(siteMainElement, tasksModel, filterModel, apiWithProvider);
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
      // - Если это будет true, то почему мы делаем все то, что делаем выше?
      if (!isOnline()) {
        // - А если сеть появится пока человек заполняет поля, почему мы его не пускаем?
        toast('You can\'t create new task offline');
        siteMenuComponent.setMenuItem(MenuItem.TASKS);
        break;
      }
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

filterPresenter.init();
boardPresenter.init();

apiWithProvider.getTasks()
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

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
