import dayjs from "dayjs";

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const isTaskExpired = (dueDate) => {
  return dueDate === null ? false : dayjs().isAfter(dueDate, `D`);
};

export const isTaskExpiringToday = (dueDate) => {
  return dueDate === null ? false : dayjs(dueDate).isSame(dayjs(), `D`);
};

export const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some(Boolean);
};

export const humanizeTaskDueDate = (dueDate) => {
  return dayjs(dueDate).format(`D MMMM`);
};
