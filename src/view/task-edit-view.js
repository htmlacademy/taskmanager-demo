import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {COLORS} from '../const.js';
import {humanizeTaskDueDate, isTaskRepeating} from '../utils/task.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

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

  const isSubmitDisabled = (isDueDate && dueDate === null) || (isRepeating && !isTaskRepeating(repeating));

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
            <button class="card__save" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
}

export default class TaskEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #datepicker = null;

  constructor({task = BLANK_TASK, onFormSubmit}) {
    super();
    this._setState(TaskEditView.parseTaskToState(task));
    this.#handleFormSubmit = onFormSubmit;

    this._restoreHandlers();
  }

  get template() {
    return createTaskEditTemplate(this._state);
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более не нужный календарь
  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(task) {
    this.updateElement(
      TaskEditView.parseTaskToState(task),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.card__date-deadline-toggle')
      .addEventListener('click', this.#dueDateToggleHandler);
    this.element.querySelector('.card__repeat-toggle')
      .addEventListener('click', this.#repeatingToggleHandler);
    this.element.querySelector('.card__text')
      .addEventListener('input', this.#descriptionInputHandler);
    this.element.querySelector('.card__colors-wrap')
      .addEventListener('change', this.#colorChangeHandler);

    if (this._state.isRepeating) {
      this.element.querySelector('.card__repeat-days-inner')
        .addEventListener('change', this.#repeatingChangeHandler);
    }

    this.#setDatepicker();
  }

  #colorChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      color: evt.target.value,
    });
  };

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      description: evt.target.value,
    });
  };

  #dueDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dueDate: userDate,
    });
  };

  #dueDateToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isDueDate: !this._state.isDueDate,
      // Логика следующая: если выбор даты нужно показать,
      // то есть когда "!this._state.isDueDate === true",
      // тогда isRepeating должно быть строго false.
      isRepeating: !this._state.isDueDate ? false : this._state.isRepeating,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(TaskEditView.parseStateToTask(this._state));
  };

  #repeatingToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isRepeating: !this._state.isRepeating,
      // Аналогично, но наоборот, для повторения
      isDueDate: !this._state.isRepeating ? false : this._state.isDueDate,
    });
  };

  #repeatingChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      repeating: {...this._state.repeating, [evt.target.value]: evt.target.checked},
    });
  };

  #setDatepicker() {
    if (this._state.isDueDate) {
      // flatpickr есть смысл инициализировать только в случае,
      // если поле выбора даты доступно для заполнения
      this.#datepicker = flatpickr(
        this.element.querySelector('.card__date'),
        {
          dateFormat: 'j F',
          defaultDate: this._state.dueDate,
          onChange: this.#dueDateChangeHandler, // На событие flatpickr передаём наш колбэк
        },
      );
    }
  }

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
