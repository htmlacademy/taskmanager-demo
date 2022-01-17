/**
 * This callback will be called by _notify method
 * @callback observerCallback
 * @param {string} event - Event type
 * @param {*} payload - Extra information the callback may need
 */
export default class AbstractObservable {
  /**
   * @type {Set<observerCallback>} - Set of callbacks
   */
  #observers = new Set();

  /**
   * @param {observerCallback} observer
   */
  addObserver(observer) {
    this.#observers.add(observer);
  }

  /**
   * @param {observerCallback} observer
   */
  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  /**
   * @param {string} event - Event type
   * @param {*} payload - Extra information the callback may need
   */
  _notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}
