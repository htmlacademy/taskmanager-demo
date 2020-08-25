import TaskEditView from '../view/task-edit-view.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class TaskNewPresenter {
  #taskListContainer = null;
  #changeData = null;
  #taskEditComponent = null;
  #destroyCallback = null;

  constructor(taskListContainer, changeData) {
    this.#taskListContainer = taskListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#taskEditComponent !== null) {
      return;
    }

    this.#taskEditComponent = new TaskEditView();
    this.#taskEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#taskEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#taskListContainer, this.#taskEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#taskEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#taskEditComponent);
    this.#taskEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving = () => {
    this.#taskEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#taskEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#taskEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (task) => {
    this.#changeData(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      task,
    );
  }

  #handleDeleteClick = () => {
    this.destroy();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
