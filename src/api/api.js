import TasksModel from '../model/tasks.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

// - Это God Object, в реальном проекте нельзя создавать 1 объект, в котором будут все ручки до бэка. Его надо было
// оставить как обертку поверх API для сериализации / десериализации и обработки ошибок
export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    // - А что делать если человек использует приложение не аутентифицированным, далее произвел аутентификацию?
    // Это API создается 1 раз, как Singleton и чтобы добавить аутентификацию придется перезагружать страницу и
    // ранить код заново.
    this._authorization = authorization;
  }

  getTasks() {
    return this._load({url: 'tasks'})
      .then(Api.toJSON)
      .then((tasks) => tasks.map(TasksModel.adaptToClient));
  }

  updateTask(task) {
    return this._load({
      // - Все URL надо выносить в константы, чтобы можно было потом их конкатинировать и не ошибаться
      url: `tasks/${task.id}`,
      method: Method.PUT,
      body: JSON.stringify(TasksModel.adaptToServer(task)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(TasksModel.adaptToClient);
  }

  addTask(task) {
    return this._load({
      url: 'tasks',
      method: Method.POST,
      body: JSON.stringify(TasksModel.adaptToServer(task)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(TasksModel.adaptToClient);
  }

  deleteTask(task) {
    return this._load({
      url: `tasks/${task.id}`,
      method: Method.DELETE,
    });
  }

  sync(data) {
    return this._load({
      url: 'tasks/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }


  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  // - Статические функции не используются нигде (и не должны), кроме этого класса, значит, они должны быть обычными
  // неэкспортируемыми функциями.
  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
