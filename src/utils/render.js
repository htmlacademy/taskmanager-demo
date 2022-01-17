import AbstractView from '../view/abstract-view.js';

/**
 * @enum {string} Перечисление возможных позиций для отрисовки
 */
export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};
/**
 * @param {HTMLElement|AbstractView} container - Контейнер, в котором будет отрисован новый элемент
 * @param {HTMLElement|AbstractView} element - Элемент или компонент, который должен был отрисован
 * @param {string} place - Позиция нового элемента относительно контейнера
 */
export const render = (container, element, place) => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
  }
};

/**
 * @param {string} template - Разметка в виде строки
 * @returns {HTMLElement} Созданный элемент
 */
export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 * @param {HTMLElement|AbstractView} newElement - Элемент или компонент, который нужно показать
 * @param {HTMLElement|AbstractView} oldElement - Элемент или компонент, который нужно скрыть
 */
export const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newChild, oldChild);
};

/**
 * @param {AbstractView} component - Компонент, который нужно удалить
 */
export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};
