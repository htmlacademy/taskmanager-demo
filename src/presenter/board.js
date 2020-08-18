import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import TaskListView from "../view/task-list.js";
import NoTaskView from "../view/no-task.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import TaskPresenter from "./task.js";
import {updateItem} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortTaskUp, sortTaskDown} from "../utils/task.js";
import {SortType} from "../const.js";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer, tasksModel) {
    this._tasksModel = tasksModel;
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._taskPresenter = {};

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _getTasks() {
    switch (this._currentSortType) {
      case SortType.DATE_UP:
        return this._tasksModel.getTasks().slice().sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return this._tasksModel.getTasks().slice().sort(sortTaskDown);
    }

    return this._tasksModel.getTasks();
  }

  _handleModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleTaskChange(updatedTask) {
    // Здесь будем вызывать обновление модели
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTaskList();
    this._renderTaskList();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {
    const taskCount = this._getTasks().length;
    const newRenderedTaskCount = Math.min(taskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    const tasks = this._getTasks().slice(this._renderedTaskCount, newRenderedTaskCount);

    this._renderTasks(tasks);
    this._renderedTaskCount = newRenderedTaskCount;

    if (this._renderedTaskCount >= taskCount) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _clearTaskList() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }

  _renderTaskList() {
    const taskCount = this._getTasks().length;
    const tasks = this._getTasks().slice(0, Math.min(taskCount, TASK_COUNT_PER_STEP));

    this._renderTasks(tasks);

    if (taskCount > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderBoard() {
    if (this._getTasks().every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTaskList();
  }
}
