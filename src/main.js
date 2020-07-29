import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {renderTemplate, RenderPosition} from './render.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

renderTemplate(siteHeaderElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
