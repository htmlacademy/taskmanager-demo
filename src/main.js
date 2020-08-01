import SiteMenuView from './view/site-menu-view.js';
import FilterView from './view/filter-view.js';
import TaskView from './view/task-view.js';
import TaskEditView from './view/task-edit-view.js';
import LoadMoreButtonView from './view/load-more-button-view.js';
import BoardView from './view/board-view.js';
import SortView from './view/sort-view.js';
import TaskListView from './view/task-list-view.js';
import NoTaskView from './view/no-task-view.js';
import {render, RenderPosition} from './render.js';
import {generateTask} from './mock/task.js';
import {generateFilter} from './mock/filter.js';

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = Array.from({length: TASK_COUNT}, generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.element, taskComponent.element);
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.element, taskEditComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  taskComponent.element.querySelector('.card__btn--edit').addEventListener('click', () => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  taskEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(taskListElement, taskComponent.element, RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters).element, RenderPosition.BEFOREEND);

const boardComponent = new BoardView();
render(siteMainElement, boardComponent.element, RenderPosition.BEFOREEND);

// По условию заглушка должна показываться,
// когда нет задач или все задачи в архиве.
// Мы могли бы написать:
// tasks.length === 0 || tasks.every((task) => task.isArchive)
// Но благодаря тому, что на пустом массиве every вернёт true,
// мы можем опустить "tasks.length === 0".
// p.s. А метод some на пустом массиве наборот вернет false
if (tasks.every((task) => task.isArchive)) {
  render(boardComponent.element, new NoTaskView().element, RenderPosition.BEFOREEND);
} else {
  render(boardComponent.element, new SortView().element, RenderPosition.BEFOREEND);

  const taskListComponent = new TaskListView();
  render(boardComponent.element, taskListComponent.element, RenderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
    renderTask(taskListComponent.element, tasks[i]);
  }

  if (tasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(boardComponent.element, loadMoreButtonComponent.element, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      tasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((task) => renderTask(taskListComponent.element, task));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= tasks.length) {
        loadMoreButtonComponent.element.remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
}
