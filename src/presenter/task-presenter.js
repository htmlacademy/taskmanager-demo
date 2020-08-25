import {render, replace, remove} from '../framework/render.js';
import TaskView from '../view/task-view.js';
import TaskEditView from '../view/task-edit-view.js';
import {UserAction, UpdateType} from '../const.js';
import {isTaskRepeating, isDatesEqual} from '../utils/task.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TaskPresenter {
  #taskListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #taskComponent = null;
  #taskEditComponent = null;

  #task = null;
  #mode = Mode.DEFAULT;

  constructor({taskListContainer, onDataChange, onModeChange}) {
    this.#taskListContainer = taskListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(task) {
    this.#task = task;

    const prevTaskComponent = this.#taskComponent;
    const prevTaskEditComponent = this.#taskEditComponent;

    this.#taskComponent = new TaskView({
      task: this.#task,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
      onArchiveClick: this.#handleArchiveClick
    });
    this.#taskEditComponent = new TaskEditView({
      task: this.#task,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render(this.#taskComponent, this.#taskListContainer);
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

  destroy() {
    remove(this.#taskComponent);
    remove(this.#taskEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#taskEditComponent.reset(this.#task);
      this.#replaceFormToCard();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#taskEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#taskEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  #replaceCardToForm() {
    replace(this.#taskEditComponent, this.#taskComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#taskComponent, this.#taskEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#taskEditComponent.reset(this.#task);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      {...this.#task, isFavorite: !this.#task.isFavorite},
    );
  };

  #handleArchiveClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      {...this.#task, isArchive: !this.#task.isArchive},
    );
  };

  #handleFormSubmit = (update) => {
    // Проверяем, поменялись ли в задаче данные, которые попадают под фильтрацию,
    // а значит требуют перерисовки списка - если таких нет, это PATCH-обновление
    const isMinorUpdate =
      !isDatesEqual(this.#task.dueDate, update.dueDate) ||
      isTaskRepeating(this.#task.repeating) !== isTaskRepeating(update.repeating);

    this.#handleDataChange(
      UserAction.UPDATE_TASK,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  };

  #handleDeleteClick = (task) => {
    this.#handleDataChange(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      task,
    );
  };
}
