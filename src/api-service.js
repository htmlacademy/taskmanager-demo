const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTasks() {
    return this._load({url: 'tasks'})
      .then(ApiService.parseResponse);
  }

  updateTask(task) {
    return this._load({
      url: `tasks/${task.id}`,
      method: Method.PUT,
      body: JSON.stringify(this._adaptToServer(task)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.parseResponse);
  }

  addTask(task) {
    return this._load({
      url: 'tasks',
      method: Method.POST,
      body: JSON.stringify(this._adaptToServer(task)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.parseResponse);
  }

  deleteTask(task) {
    return this._load({
      url: `tasks/${task.id}`,
      method: Method.DELETE,
    });
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
      .then(ApiService.checkStatus)
      .catch(ApiService.catchError);
  }

  _adaptToServer(task) {
    const adaptedTask = Object.assign(
      {},
      task,
      {
        'due_date': task.dueDate instanceof Date ? task.dueDate.toISOString() : null, // На сервере дата хранится в ISO формате
        'is_archived': task.isArchive,
        'is_favorite': task.isFavorite,
        'repeating_days': task.repeating,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedTask.dueDate;
    delete adaptedTask.isArchive;
    delete adaptedTask.isFavorite;
    delete adaptedTask.repeating;

    return adaptedTask;
  }

  static checkStatus(response) {
    if (response.ok) {
      return response;
    }

    throw new Error(`${response.status}: ${response.statusText}`);
  }

  static parseResponse(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
