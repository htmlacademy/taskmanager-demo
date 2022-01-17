import dayjs from 'dayjs';

/**
 * @param {Date|null} dueDate - Дата, которую нужно проверить
 * @returns {boolean} Находится ли дата в прошлом
 */
export const isTaskExpired = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'D');

/**
 * @param {Date|null} dueDate - Дата, которую нужно проверить
 * @returns {boolean} Является ли дата сегодняшней датой
 */
export const isTaskExpiringToday = (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');

/**
 * @param {Object.<string, boolean>} repeating - Объект с днями повторения
 * @returns {boolean} Является ли задача повторяющейся
 */
export const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean);

/**
 * @param {Date|null} dueDate - Дата, которую нужно отформатировать
 * @returns {string} Отформатированная дата или пустая строка
 */
export const formatTaskDueDate = (dueDate) => dueDate ? dayjs(dueDate).format('D MMMM') : '';

/**
 * @param {Date|null} dateA - Первая дата
 * @param {Date|null} dateB - Вторая дата
 * @returns {0|-1|1|null} Сравнительный вес дат
 */
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

/**
 * @param {Date|null} taskA - Первая дата
 * @param {Date|null} taskB - Вторая дата
 * @returns {0|-1|1} Сравнительный вес дат
 */
export const sortTaskUp = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  return weight ?? dayjs(taskA.dueDate).diff(dayjs(taskB.dueDate));
};

/**
 * @param {Date|null} taskA - Первая дата
 * @param {Date|null} taskB - Вторая дата
 * @returns {0|-1|1} Сравнительный вес дат
 */
export const sortTaskDown = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  return weight ?? dayjs(taskB.dueDate).diff(dayjs(taskA.dueDate));
};

/**
 * @param {Date|null} dateA - Первая дата
 * @param {Date|null} dateB - Вторая дата
 * @returns {boolean} Равны ли даты
 */
export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
