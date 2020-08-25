import {remove, render, RenderPosition} from '../framework/render.js';
import TaskEditView from '../view/task-edit-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewTaskPresenter {
  #taskListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #taskEditComponent = null;

  constructor({taskListContainer, onDataChange, onDestroy}) {
    this.#taskListContainer = taskListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#taskEditComponent !== null) {
      return;
    }

    this.#taskEditComponent = new TaskEditView({
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    render(this.#taskEditComponent, this.#taskListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#taskEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#taskEditComponent);
    this.#taskEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (task) => {
    this.#handleDataChange(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      task,
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
