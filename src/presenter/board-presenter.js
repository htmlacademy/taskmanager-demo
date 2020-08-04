import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import TaskListView from '../view/task-list-view.js';
import NoTaskView from '../view/no-task-view.js';
import TaskView from '../view/task-view.js';
import TaskEditView from '../view/task-edit-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render, RenderPosition} from '../utils/render.js';

const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  #boardContainer = null;

  #boardComponent = new BoardView();
  #sortComponent = new SortView();
  #taskListComponent = new TaskListView();
  #noTaskComponent = new NoTaskView();

  #boardTasks = [];

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (boardTasks) => {
    this.#boardTasks = [...boardTasks];

    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#taskListComponent, RenderPosition.BEFOREEND);

    this.#renderBoard();
  }

  #renderSort = () => {
    // Метод для рендеринга сортировки
  }

  #renderTask = () => {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
  }

  #renderTasks = (from, to) => {
    // Метод для рендеринга N-задач за раз
  }

  #renderNoTasks = () => {
    // Метод для рендеринга заглушки
  }

  #renderLoadMoreButton = () => {
    // Метод, куда уйдёт логика по отрисовке кнопки допоказа задач,
    // сейчас в main.js является частью renderBoard
  }

  #renderBoard = () => {
    if (this.#boardTasks.every((task) => task.isArchive)) {
      this.#renderNoTasks();
      return;
    }

    this.#renderSort();

    this.#renderTasks(0, Math.min(this.#boardTasks.length, TASK_COUNT_PER_STEP));

    if (this.#boardTasks.length > TASK_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }
}
