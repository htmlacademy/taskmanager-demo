import NewTaskButtonView from './view/new-task-button-view.js';
import {render} from './render.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

render(new NewTaskButtonView(), siteHeaderElement);
