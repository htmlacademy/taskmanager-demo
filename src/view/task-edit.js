import AbstractView from "./abstract.js";
import {COLORS} from "../const.js";
import {isTaskExpired, isTaskRepeating, humanizeTaskDueDate} from "../utils/task.js";
import {renderTemplate, RenderPosition} from "../utils/render.js";

const BLANK_TASK = {
  color: COLORS[0],
  description: ``,
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  isArchive: false,
  isFavorite: false
};

const createTaskEditDateTemplate = (dueDate, isDueDate) => {
  return `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${isDueDate ? `yes` : `no`}</span>
    </button>

    ${isDueDate ? `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${dueDate !== null ? humanizeTaskDueDate(dueDate) : ``}"
        />
      </label>
    </fieldset>` : ``}
  `;
};

const createTaskEditRepeatingTemplate = (repeating, isRepeating) => {
  return `<button class="card__repeat-toggle" type="button">
    repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
  </button>

  ${isRepeating ? `<fieldset class="card__repeat-days">
    <div class="card__repeat-days-inner">
      ${Object.entries(repeating).map(([day, repeat]) => `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}"
        name="repeat"
        value="${day}"
        ${repeat ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}"
        >${day}</label
      >`).join(``)}
    </div>
  </fieldset>` : ``}`;
};

const createTaskEditColorsTemplate = (currentColor) => {
  return COLORS.map((color) => `<input
    type="radio"
    id="color-${color}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${currentColor === color ? `checked` : ``}
  />
  <label
    for="color-${color}"
    class="card__color card__color--${color}"
    >${color}</label
  >`).join(``);
};

const createTaskEditTemplate = (task, option) => {
  const {color, description, dueDate, repeating} = task;
  const {isDueDate, isRepeating} = option;

  const deadlineClassName = isTaskExpired(dueDate)
    ? `card--deadline`
    : ``;
  const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);

  const repeatingClassName = isRepeating
    ? `card--repeat`
    : ``;
  const repeatingTemplate = createTaskEditRepeatingTemplate(repeating, isRepeating);

  const colorsTemplate = createTaskEditColorsTemplate(color);

  return `<article class="card card--edit card--${color} ${deadlineClassName} ${repeatingClassName}">
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
  </article>`;
};

export default class TaskEdit extends AbstractView {
  constructor(task) {
    super();
    this._task = task || BLANK_TASK;
    this._option = {
      isDueDate: Boolean(this._task.dueDate),
      isRepeating: isTaskRepeating(this._task.repeating)
    };

    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._enableDueDateToggler();
    this._enableRepeatingToggler();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, this._option);
  }

  _enableDueDateToggler() {
    const element = this.getElement();

    const dueDateToggleHandler = (evt) => {
      evt.preventDefault();

      // 1. Удаляем старую разметку
      element.querySelector(`.card__date-deadline-toggle`).remove();

      // Поле выбора может быть, а может не быть,
      // чтобы не нарваться на ошибку, удаление оборачиваем в условие
      if (element.querySelector(`.card__date-deadline`)) {
        element.querySelector(`.card__date-deadline`).remove();
      }

      // 2. Создаем и отрисовываем новую разметку
      // Новая разметка должна быть для противоположного признака isDueDate,
      // ведь мы реализовываем переключатель
      const dateTemplate = createTaskEditDateTemplate(this._task.dueDate, !this._option.isDueDate);

      renderTemplate(element.querySelector(`.card__dates`), dateTemplate, RenderPosition.AFTERBEGIN);

      // 3. Перезаписываем признак в _option
      this._option.isDueDate = !this._option.isDueDate;

      element
        .querySelector(`.card__date-deadline-toggle`)
        .addEventListener(`click`, dueDateToggleHandler);
    };

    element
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, dueDateToggleHandler);
  }

  _enableRepeatingToggler() {
    const element = this.getElement();

    const repeatingToggleHandler = (evt) => {
      evt.preventDefault();

      element.querySelector(`.card__repeat-toggle`).remove();

      if (element.querySelector(`.card__repeat-days`)) {
        element.querySelector(`.card__repeat-days`).remove();
      }

      // В случае с днями повторения нужно ещё позаботиться
      // о смене класса компонента формы,
      // чтобы полоса для повторяющихся задач была волнистой
      if (!this._option.isRepeating) {
        element.classList.add(`card--repeat`);
      } else {
        element.classList.remove(`card--repeat`);
      }

      const repeatingTemplate = createTaskEditRepeatingTemplate(this._task.repeating, !this._option.isRepeating);

      renderTemplate(element.querySelector(`.card__dates`), repeatingTemplate, RenderPosition.BEFOREEND);

      this._option.isRepeating = !this._option.isRepeating;

      element
        .querySelector(`.card__repeat-toggle`)
        .addEventListener(`click`, repeatingToggleHandler);
    };

    element
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, repeatingToggleHandler);
  }

  // Теперь нужно учесть, что выбор даты отключает возможность выбора дней повторения,
  // а выбор повторения - дату. А еще оба поля, если пустые, блокируют кнопку "Save".
  // И везде нужно помнить про обработчики, и их восстанавливать, а еще выбор цвета...
  // А-а-а!

  // И самое обидное, что мы повторяем всё то, что уже написали. Наш компонент уже
  // умеет генерировать шаблон на основе данных. Так почему бы это не использовать
  // для интерактивности? Ведь если по действию пользователя менять не UI, а данные,
  // а потом "попросить" компонент перерисоваться, результат (для пользователя)
  // будет тем же - интерактивностью

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._task);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }
}
