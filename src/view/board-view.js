import AbstractView from './abstract-view.js';

const createBoardTemplate = () => '<section class="board container"></section>';

export default class BoardView extends AbstractView {
  get template() {
    return createBoardTemplate();
  }
}
