import dayjs from 'dayjs';

const humanizeTaskDueDate = (dueDate) => dueDate ? dayjs(dueDate).format('D MMMM') : '';

const isTaskExpired = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'D');

const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean);

const isTaskExpiringToday = (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');

export {humanizeTaskDueDate, isTaskExpired, isTaskRepeating, isTaskExpiringToday};
