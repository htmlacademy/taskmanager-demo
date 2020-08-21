import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {isDatesEqual} from "./task.js";
import {Color} from "../const.js";

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const colorToHex = {
  [Color.BLACK]: `#000000`,
  [Color.BLUE]: `#0c5cdd`,
  [Color.GREEN]: `#31b55c`,
  [Color.PINK]: `#ff3cb9`,
  [Color.YELLOW]: `#ffe125`
};

// Используем особенности Set, чтобы удалить дубли в массиве
export const makeItemsUniq = (items) => [...new Set(items)];

export const parseChartDate = (date) => dayjs(date).format(`D MMM`);

export const countTasksByColor = (tasks, color) => {
  return tasks.filter((task) => task.color === color).length;
};

export const countTasksInDateRange = (dates, tasks) => {
  return dates.map(
      (date) => tasks.filter(
          (task) => isDatesEqual(task.dueDate, date)
      ).length
  );
};

export const countCompletedTaskInDateRange = (tasks, dateFrom, dateTo) => {
  return tasks.reduce((counter, task) => {
    if (task.dueDate === null) {
      return counter;
    }

    // С помощью day.js проверям, сколько задач с дедлайном
    // попадают в диапазон дат
    if (
      dayjs(task.dueDate).isSame(dateFrom) ||
      dayjs(task.dueDate).isBetween(dateFrom, dateTo) ||
      dayjs(task.dueDate).isSame(dateTo)
    ) {
      return counter + 1;
    }

    return counter;
  }, 0);
};

export const getDatesInRange = (dateFrom, dateTo) => {
  const dates = [];
  let stepDate = new Date(dateFrom);

  // Нам нужно получить все даты из диапазона,
  // чтобы корректно отразить их на графике.
  // Для этого проходим в цикле от даты "от"
  // до даты "до" и каждый день, что между,
  // заносим в результирующий массив dates
  while (dayjs(stepDate).isSameOrBefore(dateTo)) {
    dates.push(new Date(stepDate));
    stepDate.setDate(stepDate.getDate() + 1);
  }

  return dates;
};
