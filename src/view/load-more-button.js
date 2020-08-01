import AbstractView from './abstract.js';

const createLoadMoreButtonTemplate = () => '<button class="load-more" type="button">load more</button>';

export default class LoadMoreButton extends AbstractView {
  getTemplate() {
    return createLoadMoreButtonTemplate();
  }
}
