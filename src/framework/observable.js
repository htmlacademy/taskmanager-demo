/**
 * Класс, реализующий паттерн Наблюдатель.
 */
export default class Observable {
  /** @type {Set<observerCallback>} Множество функций типа observerCallback */
  #observers = new Set();

  /**
   * Метод, позволяющий подписаться на событие
   * @param {observerCallback} observer Функция, которая будет вызвана при наступлении события
   */
  addObserver(observer) {
    this.#observers.add(observer);
  }

  /**
   * Метод, позволяющий отписаться от события
   * @param {observerCallback} observer Функция, которую больше не нужно вызывать при наступлении события
   */
  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  /**
   * Метод для оповещения подписчиков о наступлении события
   * @param {*} event Тип события
   * @param {*} payload Дополнительная информация
   */
  _notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}

/**
 * Функция, которая будет вызвана при наступлении события
 * @callback observerCallback
 * @param {*} event Тип события
 * @param {*} [payload] Дополнительная информация
 */
