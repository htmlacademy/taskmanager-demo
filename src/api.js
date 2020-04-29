const API = class {
  getTasks() {
    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks`);
  }
};

export default API;
