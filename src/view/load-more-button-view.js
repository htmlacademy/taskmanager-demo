import AbstractView from './abstract-view.js';

const createLoadMoreButtonTemplate = () => '<button class="load-more" type="button">load more</button>';

export default class LoadMoreButtonView extends AbstractView {
  get template() {
    return createLoadMoreButtonTemplate();
  }
}
