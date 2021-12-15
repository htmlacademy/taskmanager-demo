const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class UiBlocker {
  #element;
  #startTime;
  #endTime;
  #isWaiting = false

  constructor() {
    this.#element = document.createElement('div');
    this.#element.classList.add('ui-blocker');
    document.body.append(this.#element);
  }

  start = () => {
    this.#isWaiting = true;
    this.#startTime = Date.now();
    setTimeout(() => {
      if (this.#isWaiting) {
        this.#blockUi();
      }
    }, TimeLimit.LOWER_LIMIT);
  }

  end = () => {
    this.#isWaiting = false;
    this.#endTime = Date.now();
    const duration = this.#endTime - this.#startTime;

    if (duration < TimeLimit.LOWER_LIMIT) {
      return;
    }

    if (duration >= TimeLimit.UPPER_LIMIT) {
      this.#unblockUi();
    } else {
      setTimeout(this.#unblockUi, TimeLimit.UPPER_LIMIT - duration);
    }
  }


  #blockUi = () => {
    this.#element.classList.add('ui-blocker--on');
  }

  #unblockUi = () => {
    this.#element.classList.remove('ui-blocker--on');
  }
}
