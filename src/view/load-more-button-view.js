import AbstractView from '../framework/view/abstract-view.js';

const createLoadMoreButtonTemplate = () => '<button class="load-more" type="button">load more</button>';

export default class LoadMoreButtonView extends AbstractView {
  get template() {
    return createLoadMoreButtonTemplate();
  }

  setClickHandler = (callback) => {
    // Мы могли бы сразу передать callback в addEventListener,
    // но тогда бы для удаления обработчика в будущем,
    // нам нужно было бы производить это снаружи, где-то там,
    // где мы вызывали setClickHandler, что не всегда удобно

    // 1. Поэтому колбэк мы запишем во внутреннее свойство
    this._callback.click = callback;
    // 2. В addEventListener передадим абстрактный обработчик
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    // 3. А внутри абстрактного обработчика вызовем колбэк
    this._callback.click();
  };
}
