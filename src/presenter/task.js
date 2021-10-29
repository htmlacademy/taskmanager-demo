/* eslint-disable lines-between-class-members */
import TaskView from '../view/task.js';
import TaskEditView from '../view/task-edit.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import {isTaskRepeating, isDatesEqual} from '../utils/task.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Task {
  #taskListContainer = null;
  #changeData = null;
  #changeMode = null;

  #taskComponent = null;
  #taskEditComponent = null;
  #mode = Mode.DEFAULT;

  #task = null;

  constructor(taskListContainer, changeData, changeMode) {
    this.#taskListContainer = taskListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (task) => {
    this.#task = task;

    const prevTaskComponent = this.#taskComponent;
    const prevTaskEditComponent = this.#taskEditComponent;

    this.#taskComponent = new TaskView(task);
    this.#taskEditComponent = new TaskEditView(task);

    this.#taskComponent.setEditClickHandler(this.#handleEditClick);
    this.#taskComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#taskComponent.setArchiveClickHandler(this.#handleArchiveClick);
    this.#taskEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#taskEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render(this.#taskListContainer, this.#taskComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#taskComponent, prevTaskComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#taskComponent, prevTaskEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevTaskComponent);
    remove(prevTaskEditComponent);
  }

  destroy = () => {
    remove(this.#taskComponent);
    remove(this.#taskEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#taskEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#taskEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#taskEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#taskComponent.shake(resetFormState);
        this.#taskEditComponent.shake(resetFormState);
        break;
    }
  }

  #replaceCardToForm = () => {
    replace(this.#taskEditComponent, this.#taskComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard = () => {
    replace(this.#taskComponent, this.#taskEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#taskEditComponent.reset(this.#task);
      this.#replaceFormToCard();
    }
  }

  #handleEditClick = () => this.#replaceCardToForm();

  #handleFavoriteClick = () => this.#changeData(
    UserAction.UPDATE_TASK,
    UpdateType.MINOR,
    {...this.#task, isFavorite: !this.#task.isFavorite},
  );

  #handleArchiveClick = () => this.#changeData(
    UserAction.UPDATE_TASK,
    UpdateType.MINOR,
    {...this.#task, isArchive: !this.#task.isArchive},
  );

  #handleFormSubmit = (update) => {
    // Проверяем, поменялись ли в задаче данные, которые попадают под фильтрацию,
    // а значит требуют перерисовки списка - если таких нет, это PATCH-обновление
    const isMinorUpdate =
      !isDatesEqual(this.#task.dueDate, update.dueDate) ||
      isTaskRepeating(this.#task.repeating) !== isTaskRepeating(update.repeating);

    this.#changeData(
      UserAction.UPDATE_TASK,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  }

  #handleDeleteClick = (task) => this.#changeData(
    UserAction.DELETE_TASK,
    UpdateType.MINOR,
    task,
  );
}
