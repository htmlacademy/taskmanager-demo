import dayjs from 'dayjs';

/**
 * @param {Date|null} dueDate - Date that should be checked
 * @returns {boolean} Tells if the date is in the past
 */
export const isTaskExpired = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'D');

/**
 * @param {Date|null} dueDate - Date that should be checked
 * @returns {boolean} Tells if the date is today date
 */
export const isTaskExpiringToday = (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');

/**
 * @param {Object.<string, boolean>} repeating - Object with repeating days
 * @returns {boolean} Tells if the task is repeating
 */
export const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean);

/**
 * @param {Date|null} dueDate - Date that should be formated
 * @returns {string} Formated date or empty string
 */
export const formatTaskDueDate = (dueDate) => dueDate ? dayjs(dueDate).format('D MMMM') : '';

/**
 * @param {Date|null} dateA - First date
 * @param {Date|null} dateB - Second date
 * @returns {0|-1|1|null} Comparison weight of dates
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
 * @param {Date|null} taskA - First date
 * @param {Date|null} taskB - Second date
 * @returns {0|-1|1} Comparison weight of dates
 */
export const sortTaskUp = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  return weight ?? dayjs(taskA.dueDate).diff(dayjs(taskB.dueDate));
};

/**
 * @param {Date|null} taskA - First date
 * @param {Date|null} taskB - Second date
 * @returns {0|-1|1} Comparison weight of dates
 */
export const sortTaskDown = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  return weight ?? dayjs(taskB.dueDate).diff(dayjs(taskA.dueDate));
};

/**
 * @param {Date|null} dateA - First date
 * @param {Date|null} dateB - Second date
 * @returns {boolean} Tells if the dates are equal
 */
export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
