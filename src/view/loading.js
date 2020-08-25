import AbstractView from './abstract.js';

const createNoTaskTemplate = () => (
  `<p class="board__no-tasks">
    Loading...
  </p>`
);

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
