import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import TaskListView from '../view/task-list-view.js';
import NoTaskView from '../view/no-task-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import TaskPresenter from './task-presenter.js';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {sortTaskUp, sortTaskDown} from '../utils/task.js';
import {SortType} from '../const.js';

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
  #currentSortType = SortType.DEFAULT;
  #sourcedBoardTasks = [];

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (boardTasks) => {
    this.#boardTasks = [...boardTasks];
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this.#sourcedBoardTasks = [...boardTasks];

    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#taskListComponent, RenderPosition.BEFOREEND);

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#taskPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleTaskChange = (updatedTask) => {
    this.#boardTasks = updateItem(this.#boardTasks, updatedTask);
    this.#sourcedBoardTasks = updateItem(this.#sourcedBoardTasks, updatedTask);
    this.#taskPresenter.get(updatedTask.id).init(updatedTask);
  }

  #sortTasks = (sortType) => {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE_UP:
        this.#boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this.#boardTasks.sort(sortTaskDown);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#boardTasks = [...this.#sourcedBoardTasks];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
    // - Очищаем список
    // - Рендерим список заново
  }

  #renderSort = () => {
    render(this.#boardComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderTask = (task) => {
    const taskPresenter = new TaskPresenter(this.#taskListComponent, this.#handleTaskChange, this.#handleModeChange);
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
