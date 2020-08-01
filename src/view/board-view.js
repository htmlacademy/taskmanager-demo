import AbstractView from '../framework/view/abstract-view.js';

function createBoardTemplate() {
  return '<section class="board container"></section>';
}

export default class BoardView extends AbstractView {
  get template() {
    return createBoardTemplate();
  }
}
