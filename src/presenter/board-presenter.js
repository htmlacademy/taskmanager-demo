import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import TaskListView from '../view/task-list-view.js';
import TaskView from '../view/task-view.js';
import TaskEditView from '../view/task-edit-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #tasksModel = null;

  #boardComponent = new BoardView();
  #taskListComponent = new TaskListView();

  #boardTasks = [];

  constructor({boardContainer, tasksModel}) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];

    render(this.#boardComponent, this.#boardContainer);
    render(new SortView(), this.#boardComponent.element);
    render(this.#taskListComponent, this.#boardComponent.element);

    for (let i = 0; i < this.#boardTasks.length; i++) {
      this.#renderTask(this.#boardTasks[i]);
    }

    render(new LoadMoreButtonView(), this.#boardComponent.element);
  }

  #renderTask(task) {
    const taskComponent = new TaskView({task});
    const taskEditComponent = new TaskEditView({task});

    const replaceCardToForm = () => {
      this.#taskListComponent.element.replaceChild(taskEditComponent.element, taskComponent.element);
    };

    const replaceFormToCard = () => {
      this.#taskListComponent.element.replaceChild(taskComponent.element, taskEditComponent.element);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    taskComponent.element.querySelector('.card__btn--edit').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    taskEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(taskComponent, this.#taskListComponent.element);
  }
}
