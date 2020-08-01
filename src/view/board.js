import AbstractView from './abstract.js';

const createBoardTemplate = () => '<section class="board container"></section>';

export default class Board extends AbstractView {
  getTemplate() {
    return createBoardTemplate();
  }
}
