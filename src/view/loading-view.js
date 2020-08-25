import AbstractView from './abstract-view.js';

const createNoTaskTemplate = () => (
  `<p class="board__no-tasks">
    Loading...
  </p>`
);

export default class LoadingView extends AbstractView {
  get template() {
    return createNoTaskTemplate();
  }
}
