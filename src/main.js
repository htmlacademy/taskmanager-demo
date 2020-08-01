import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import TaskView from "./view/task.js";
import TaskEditView from "./view/task-edit.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import TaskListView from "./view/task-list.js";
import NoTaskView from "./view/no-task.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render, RenderPosition} from "./utils.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const taskListComponent = new TaskListView();

  render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), taskListComponent.getElement(), RenderPosition.BEFOREEND);

  // По условию заглушка должна показываться,
  // когда нет задач или все задачи в архиве.
  // Мы могли бы написать:
  // tasks.length === 0 || tasks.every((task) => task.isArchive)
  // Но благодаря тому, что на пустом массиве every вернёт true,
  // мы можем опустить "tasks.length === 0".
  // p.s. А метод some на пустом массиве наборот вернет false
  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new NoTaskView().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent.getElement(), new SortView().getElement(), RenderPosition.AFTERBEGIN);

  boardTasks
    .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

render(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

renderBoard(siteMainElement, tasks);
