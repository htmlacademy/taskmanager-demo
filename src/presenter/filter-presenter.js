import FilterView from '../view/filter-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #tasksModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, tasksModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#tasksModel = tasksModel;

    this.#tasksModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const tasks = this.#tasksModel.tasks;

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        count: filter[FilterType.ALL](tasks).length,
      },
      {
        type: FilterType.OVERDUE,
        name: 'Overdue',
        count: filter[FilterType.OVERDUE](tasks).length,
      },
      {
        type: FilterType.TODAY,
        name: 'Today',
        count: filter[FilterType.TODAY](tasks).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](tasks).length,
      },
      {
        type: FilterType.REPEATING,
        name: 'Repeating',
        count: filter[FilterType.REPEATING](tasks).length,
      },
      {
        type: FilterType.ARCHIVE,
        name: 'Archive',
        count: filter[FilterType.ARCHIVE](tasks).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
