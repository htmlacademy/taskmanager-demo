/* eslint-disable lines-between-class-members */
import {createElement} from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class Abstract {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  getTemplate = () => {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  removeElement() {
    this.#element = null;
  }

  shake(callback) {
    this.element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
