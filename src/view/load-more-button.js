import AbstractView from "./abstract.js";

const createLoadMoreButtonTemplate = () => {
  return `<button class="load-more" type="button">load more</button>`;
};

export default class LoadMoreButton extends AbstractView {
  constructor() {
    super();

    // 4. Теперь обработчик - метод класса, а не стрелочная функция.
    // Поэтому при передаче в addEventListener он теряет контекст (this),
    // а с контекстом - доступ к свойствам и методам.
    // Чтобы такого не происходило, нужно насильно
    // привязать обработчик к контексту с помощью bind
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    // 3. А внутри абстрактного обработчика вызовем колбэк
    this._callback.click();
  }

  setClickHandler(callback) {
    // Мы могли бы сразу передать callback в addEventListener,
    // но тогда бы для удаления обработчика в будущем,
    // нам нужно было бы производить это снаружи, где-то там,
    // где мы вызывали setClickHandler, что не всегда удобно

    // 1. Поэтому колбэк мы запишем во внутреннее свойство
    this._callback.click = callback;
    // 2. В addEventListener передадим абстрактный обработчик
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
