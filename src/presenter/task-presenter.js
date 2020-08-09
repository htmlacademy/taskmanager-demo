import {render, replace} from '../framework/render.js';
import TaskView from '../view/task-view.js';
import TaskEditView from '../view/task-edit-view.js';

export default class TaskPresenter {
  #taskListContainer = null;

  #taskComponent = null;
  #taskEditComponent = null;

  #task = null;

  constructor({taskListContainer}) {
    this.#taskListContainer = taskListContainer;
  }

  init(task) {
    this.#task = task;

    this.#taskComponent = new TaskView({
      task: this.#task,
      onEditClick: this.#handleEditClick,
    });
    this.#taskEditComponent = new TaskEditView({
      task: this.#task,
      onFormSubmit: this.#handleFormSubmit,
    });

    render(this.#taskComponent, this.#taskListContainer);
  }

  #replaceCardToForm() {
    replace(this.#taskEditComponent, this.#taskComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#taskComponent, this.#taskEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };
}
