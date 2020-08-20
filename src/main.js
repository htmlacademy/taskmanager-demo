import {render} from './framework/render.js';
import NewTaskButtonView from './view/new-task-button-view.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import TasksModel from './model/tasks-model.js';
import FilterModel from './model/filter-model.js';

const filters = [
  {
    type: 'all',
    count: 0,
  },
];

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
const tasksModel = new TasksModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  tasksModel,
});

render(new NewTaskButtonView(), siteHeaderElement);
render(new FilterView({
  filters,
  currentFilterType: 'all',
  onFilterTypeChange: () => {}
}), siteMainElement);

boardPresenter.init();
