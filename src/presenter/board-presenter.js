import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import TaskListView from '../view/task-list-view.js';
import NoTaskView from '../view/no-task-view.js';
import TaskView from '../view/task-view.js';
import TaskEditView from '../view/task-edit-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render, RenderPosition} from '../utils/render.js';

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
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
  }

  #renderSort = () => {
    // Метод для рендеринга сортировки
  }

  #renderTask = () => {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
  }

  #renderTasks = () => {
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
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
  }
}
