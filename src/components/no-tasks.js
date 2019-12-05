import AbstractComponent from "./abstract-component.js";

const createNoTasksTemplate = () => {
  return (
    `<p class="board__no-tasks">
      Click «ADD NEW TASK» in menu to create your first task
    </p>`
  );
};


export default class NoTasks extends AbstractComponent {
  getTemplate() {
    return createNoTasksTemplate();
  }
}
