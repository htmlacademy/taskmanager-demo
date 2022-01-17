/**
 * Колбэк, который будет вызван методом _notify
 * @callback observerCallback
 * @param {string} event - Тип события
 * @param {*} [payload] - Дополнительная информация
 */
export default class AbstractObservable {
  /**
   * @type {Set<observerCallback>} - Множество колбэков
   */
  #observers = new Set();

  /**
   * @param {observerCallback} observer - Новый колбэк
   */
  addObserver(observer) {
    this.#observers.add(observer);
  }

  /**
   * @param {observerCallback} observer - Колбэк, который нужно удалить
   */
  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  /**
   * @param {string} event - Тип события
   * @param {*} [payload] - Дополнительная информация
   */
  _notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}
