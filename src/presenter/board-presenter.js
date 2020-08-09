import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import TaskListView from '../view/task-list-view.js';
import NoTaskView from '../view/no-task-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import TaskPresenter from './task-presenter.js';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';

const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  #boardContainer = null;

  #boardComponent = new BoardView();
  #sortComponent = new SortView();
  #taskListComponent = new TaskListView();
  #noTaskComponent = new NoTaskView();
  #loadMoreButtonComponent = new LoadMoreButtonView();

  #boardTasks = [];
  #renderedTaskCount = TASK_COUNT_PER_STEP;
  #taskPresenter = new Map();

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (boardTasks) => {
    this.#boardTasks = [...boardTasks];

    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#taskListComponent, RenderPosition.BEFOREEND);

    this.#renderBoard();
  }

  #handleTaskChange = (updatedTask) => {
    this.#boardTasks = updateItem(this.#boardTasks, updatedTask);
    this.#taskPresenter.get(updatedTask.id).init(updatedTask);
  }

  #renderSort = () => {
    render(this.#boardComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderTask = (task) => {
    const taskPresenter = new TaskPresenter(this.#taskListComponent, this.#handleTaskChange);
    taskPresenter.init(task);
    this.#taskPresenter.set(task.id, taskPresenter);
  }

  #renderTasks = (from, to) => {
    this.#boardTasks
      .slice(from, to)
      .forEach((boardTask) => this.#renderTask(boardTask));
  }

  #renderNoTasks = () => {
    render(this.#boardComponent, this.#noTaskComponent, RenderPosition.AFTERBEGIN);
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderTasks(this.#renderedTaskCount, this.#renderedTaskCount + TASK_COUNT_PER_STEP);
    this.#renderedTaskCount += TASK_COUNT_PER_STEP;

    if (this.#renderedTaskCount >= this.#boardTasks.length) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderLoadMoreButton = () => {
    render(this.#boardComponent, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  }

  #clearTaskList = () => {
    this.#taskPresenter.forEach((presenter) => presenter.destroy());
    this.#taskPresenter.clear();
    this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #renderTaskList = () => {
    this.#renderTasks(0, Math.min(this.#boardTasks.length, TASK_COUNT_PER_STEP));

    if (this.#boardTasks.length > TASK_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #renderBoard = () => {
    if (this.#boardTasks.every((task) => task.isArchive)) {
      this.#renderNoTasks();
      return;
    }

    this.#renderSort();
    this.#renderTaskList();
  }
}
