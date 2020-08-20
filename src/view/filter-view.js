import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const {type, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${type}"
      class="filter__input visually-hidden"
      name="filter"
      ${type === currentFilterType ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
      value="${type}"
    />
    <label for="filter__${type}" class="filter__label">
      ${type} <span class="filter__${type}-count">${count}</span></label
    >`
  );
}

function createFilterTemplate(filterItems, currentFilterType) {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<section class="main__filter filter container">
      ${filterItemsTemplate}
    </section>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

}
