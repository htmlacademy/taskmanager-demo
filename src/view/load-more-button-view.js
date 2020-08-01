import AbstractView from '../framework/view/abstract-view.js';

function createLoadMoreButtonTemplate() {
  return '<button class="load-more" type="button">load more</button>';
}

export default class LoadMoreButtonView extends AbstractView {
  get template() {
    return createLoadMoreButtonTemplate();
  }
}
