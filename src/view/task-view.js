import AbstractView from '../framework/view/abstract-view.js';
import {humanizeTaskDueDate, isTaskExpired, isTaskRepeating} from '../utils.js';

function createTaskTemplate(task) {
  const {color, description, dueDate, repeating, isArchive, isFavorite} = task;

  const date = humanizeTaskDueDate(dueDate);

  const deadlineClassName = isTaskExpired(dueDate)
    ? 'card--deadline'
    : '';

  const repeatClassName = isTaskRepeating(repeating)
    ? 'card--repeat'
    : '';

  const archiveClassName = isArchive
    ? 'card__btn--archive card__btn--disabled'
    : 'card__btn--archive';

  const favoriteClassName = isFavorite
    ? 'card__btn--favorites card__btn--disabled'
    : 'card__btn--favorites';

  return (
    `<article class="card card--${color} ${deadlineClassName} ${repeatClassName}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn ${archiveClassName}">
              archive
            </button>
            <button
              type="button"
              class="card__btn ${favoriteClassName}"
            >
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
}

export default class TaskView extends AbstractView {
  #task = null;

  constructor({task}) {
    super();
    this.#task = task;
  }

  get template() {
    return createTaskTemplate(this.#task);
  }
}
