import AbstractObservable from '../utils/abstract-observable.js';
import {FilterType} from '../const.js';

export default class Filter extends AbstractObservable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this.notify(updateType, filter);
  }
}
