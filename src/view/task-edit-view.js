import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {COLORS} from '../const.js';
import {humanizeTaskDueDate, isTaskRepeating} from '../utils/task.js';

const BLANK_TASK = {
  color: COLORS[0],
  description: '',
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false,
  },
  isArchive: false,
  isFavorite: false,
};

function createTaskEditDateTemplate(dueDate, isDueDate) {
  return (
    `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${isDueDate ? 'yes' : 'no'}</span>
    </button>

    ${isDueDate ? `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${humanizeTaskDueDate(dueDate)}"
        />
      </label>
    </fieldset>` : ''}
  `
  );
}

function createTaskEditRepeatingTemplate(repeating, isRepeating) {
  return (
    `<button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${isRepeating ? 'yes' : 'no'}</span>
    </button>

  ${isRepeating ? `<fieldset class="card__repeat-days">
    <div class="card__repeat-days-inner">
      ${Object.entries(repeating).map(([day, repeat]) => `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}"
        name="repeat"
        value="${day}"
        ${repeat ? 'checked' : ''}
      />
      <label class="card__repeat-day" for="repeat-${day}"
        >${day}</label
      >`).join('')}
    </div>
  </fieldset>` : ''}`
  );
}

function createTaskEditColorsTemplate(currentColor) {
  return COLORS.map((color) => `<input
    type="radio"
    id="color-${color}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${currentColor === color ? 'checked' : ''}
  />
  <label
    for="color-${color}"
    class="card__color card__color--${color}"
    >${color}</label
  >`).join('');
}

function createTaskEditTemplate(data) {
  const {color, description, dueDate, repeating, isDueDate, isRepeating} = data;

  const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);

  const repeatingClassName = isRepeating
    ? 'card--repeat'
    : '';

  const repeatingTemplate = createTaskEditRepeatingTemplate(repeating, isRepeating);

  const colorsTemplate = createTaskEditColorsTemplate(color);

  return (
    `<article class="card card--edit card--${color} ${repeatingClassName}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                ${dateTemplate}

                ${repeatingTemplate}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsTemplate}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
}

export default class TaskEditView extends AbstractStatefulView {
  #handleFormSubmit = null;

  constructor({task = BLANK_TASK, onFormSubmit}) {
    super();
    this._setState(TaskEditView.parseTaskToState(task));
    this.#handleFormSubmit = onFormSubmit;

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.card__date-deadline-toggle')
      .addEventListener('click', this.#dueDateToggleHandler);
    this.element.querySelector('.card__repeat-toggle')
      .addEventListener('click', this.#repeatingToggleHandler);
  }

  get template() {
    return createTaskEditTemplate(this._state);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(TaskEditView.parseStateToTask(this._state));
  };

  #dueDateToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isDueDate: !this._state.isDueDate,
    });
  };

  #repeatingToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isRepeating: !this._state.isRepeating,
    });
  };

  static parseTaskToState(task) {
    return {...task,
      isDueDate: task.dueDate !== null,
      isRepeating: isTaskRepeating(task.repeating),
    };
  }

  static parseStateToTask(state) {
    const task = {...state};

    if (!task.isDueDate) {
      task.dueDate = null;
    }

    if (!task.isRepeating) {
      task.repeating = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false,
      };
    }

    delete task.isDueDate;
    delete task.isRepeating;

    return task;
  }
}
