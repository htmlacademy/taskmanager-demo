import dayjs from 'dayjs';
import {FilterType} from '../const';

export const isTaskExpired = (dueDate) =>
  dueDate === null ? false : dayjs().isAfter(dueDate, 'D');

export const isTaskExpiringToday = (dueDate) =>
  dueDate === null ? false : dayjs(dueDate).isSame(dayjs(), 'D');

export const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean);

export const formatTaskDueDate = (dueDate) => {
  if (!dueDate) {
    return '';
  }

  return dayjs(dueDate).format('D MMMM');
};

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortTaskUp = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  if (weight !== null) {
    return weight;
  }

  return dayjs(taskA.dueDate).diff(dayjs(taskB.dueDate));
};

export const sortTaskDown = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  if (weight !== null) {
    return weight;
  }

  return dayjs(taskB.dueDate).diff(dayjs(taskA.dueDate));
};

export const isDatesEqual = (dateA, dateB) =>
  (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');

export const getNoTaskText = (filter) => {
  switch (filter) {
    case FilterType.FAVORITES:
      return 'There are no favorite tasks now';
    case FilterType.TODAY:
      return 'There are no tasks today';
    case FilterType.OVERDUE:
      return 'There are no overdue tasks now';
    case FilterType.REPEATING:
      return 'There are no repeating tasks now';

    default:
      return 'Click «ADD NEW TASK» in menu to create your first task';
  }
};
