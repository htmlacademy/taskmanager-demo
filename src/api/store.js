// - Вы абстрагируете Storage (типа "Адаптер" из Clean Architecture) и при этом пользуетесь интерфейсом localstorage.
// Я не вижу кейсов при которых замена имплементации данного storage не заставила бы рефакторить данный код.
// А значит в реальном проекте правильнее было бы сделать этот класс LocalStorageStore и прямо здесь работать с localstorage,
// а вот уже адаптеры (если вообще нужно) делать на уровне, где разные виды Store (LocalStorageStore,
// HTTPStore, IndexDBStore, etc.) используются (в нашем случае в Provider).
export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(
      this._storeKey,
      JSON.stringify(items),
    );
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(
        Object.assign({}, store, {
          [key]: value,
        }),
      ),
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(store),
    );
  }
}
