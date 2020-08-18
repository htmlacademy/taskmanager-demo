import {render, RenderPosition, remove} from '../framework/render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import TaskListView from '../view/task-list-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoTaskView from '../view/no-task-view.js';
import TaskPresenter from './task-presenter.js';
import {sortTaskUp, sortTaskDown} from '../utils/task.js';
import {SortType} from '../const.js';

const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  #boardContainer = null;
  #tasksModel = null;

  #boardComponent = new BoardView();
  #taskListComponent = new TaskListView();
  #loadMoreButtonComponent = null;
  #sortComponent = null;
  #noTaskComponent = new NoTaskView();

  #renderedTaskCount = TASK_COUNT_PER_STEP;
  #taskPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor({boardContainer, tasksModel}) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  get tasks() {
    switch (this.#currentSortType) {
      case SortType.DATE_UP:
        return [...this.#tasksModel.tasks].sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return [...this.#tasksModel.tasks].sort(sortTaskDown);
    }

    return this.#tasksModel.tasks;
  }

  init() {
    this.#renderBoard();
  }

  #handleLoadMoreButtonClick = () => {
    const taskCount = this.tasks.length;
    const newRenderedTaskCount = Math.min(taskCount, this.#renderedTaskCount + TASK_COUNT_PER_STEP);
    const tasks = this.tasks.slice(this.#renderedTaskCount, newRenderedTaskCount);

    this.#renderTasks(tasks);
    this.#renderedTaskCount = newRenderedTaskCount;

    if (this.#renderedTaskCount >= taskCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#taskPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleTaskChange = (updatedTask) => {
    // Здесь будем вызывать обновление модели
    this.#taskPresenters.get(updatedTask.id).init(updatedTask);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTaskList();
    this.#renderTaskList();
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

  #renderTasks(tasks) {
    tasks.forEach((task) => this.#renderTask(task));
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
    const taskCount = this.tasks.length;
    const tasks = this.tasks.slice(0, Math.min(taskCount, TASK_COUNT_PER_STEP));

    render(this.#taskListComponent, this.#boardComponent.element);
    this.#renderTasks(tasks);

    if (taskCount > TASK_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    if (this.tasks.every((task) => task.isArchive)) {
      this.#renderNoTasks();
      return;
    }

    this.#renderSort();
    this.#renderTaskList();
  }
}
