import dayjs from 'dayjs';

const DATE_FORMAT = 'D MMMM';

function humanizeTaskDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function isTaskExpired(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

function isTaskRepeating(repeating) {
  return Object.values(repeating).some(Boolean);
}

function isTaskExpiringToday(dueDate) {
  return dueDate && dayjs(dueDate).isSame(dayjs(), 'D');
}

export {humanizeTaskDueDate, isTaskExpired, isTaskRepeating, isTaskExpiringToday};
