import dayjs from 'dayjs';

export const isTaskExpired = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'D');

export const isTaskExpiringToday = (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');

export const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean);

export const formatTaskDueDate = (dueDate) => dueDate ? dayjs(dueDate).format('D MMMM') : '';
