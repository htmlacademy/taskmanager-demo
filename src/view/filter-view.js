import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, isChecked) {
  const {type, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${type}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
    />
    <label for="filter__${type}" class="filter__label">
      ${type} <span class="filter__${type}-count">${count}</span></label
    >`
  );
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return (
    `<section class="main__filter filter container">
      ${filterItemsTemplate}
    </section>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
