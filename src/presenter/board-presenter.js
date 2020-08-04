import {render, RenderPosition, remove} from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import TaskListView from '../view/task-list-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoTaskView from '../view/no-task-view.js';
import TaskPresenter from './task-presenter.js';
import {updateItem} from '../utils/common.js';

const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  #boardContainer = null;
  #tasksModel = null;

  #boardComponent = new BoardView();
  #taskListComponent = new TaskListView();
  #loadMoreButtonComponent = null;
  #sortComponent = null;
  #noTaskComponent = new NoTaskView();

  #boardTasks = [];
  #renderedTaskCount = TASK_COUNT_PER_STEP;
  #taskPresenters = new Map();

  constructor({boardContainer, tasksModel}) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];

    this.#renderBoard();
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderTasks(this.#renderedTaskCount, this.#renderedTaskCount + TASK_COUNT_PER_STEP);
    this.#renderedTaskCount += TASK_COUNT_PER_STEP;
    if (this.#renderedTaskCount >= this.#boardTasks.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#taskPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleTaskChange = (updatedTask) => {
    this.#boardTasks = updateItem(this.#boardTasks, updatedTask);
    this.#taskPresenters.get(updatedTask.id).init(updatedTask);
  };

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи
    // - Очищаем список
    // - Рендерим список заново
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderTask(task) {
    const taskPresenter = new TaskPresenter({
      taskListContainer: this.#taskListComponent.element,
      onDataChange: this.#handleTaskChange,
      onModeChange: this.#handleModeChange
    });
    taskPresenter.init(task);
    this.#taskPresenters.set(task.id, taskPresenter);
  }

  #renderTasks(from, to) {
    this.#boardTasks
      .slice(from, to)
      .forEach((task) => this.#renderTask(task));
  }

  #renderNoTasks() {
    render(this.#noTaskComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoadMoreButton() {
    this.#loadMoreButtonComponent = new LoadMoreButtonView({
      onClick: this.#handleLoadMoreButtonClick
    });

    render(this.#loadMoreButtonComponent, this.#boardComponent.element);
  }

  #clearTaskList() {
    this.#taskPresenters.forEach((presenter) => presenter.destroy());
    this.#taskPresenters.clear();
    this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #renderTaskList() {
    render(this.#taskListComponent, this.#boardComponent.element);
    this.#renderTasks(0, Math.min(this.#boardTasks.length, TASK_COUNT_PER_STEP));

    if (this.#boardTasks.length > TASK_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#boardTasks.every((task) => task.isArchive)) {
      this.#renderNoTasks();
      return;
    }

    this.#renderSort();
    this.#renderTaskList();
  }
}
