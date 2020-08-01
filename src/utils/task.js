import dayjs from "dayjs";

export const isTaskExpired = (dueDate) => {
  return dueDate === null ? false : dayjs().isAfter(dueDate, `D`);
};

export const isTaskExpiringToday = (dueDate) => {
  return dueDate === null ? false : dayjs(dueDate).isSame(dayjs(), `D`);
};

export const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some(Boolean);
};

export const formatTaskDueDate = (dueDate) => {
  if (!dueDate) {
    return ``;
  }

  return dayjs(dueDate).format(`D MMMM`);
};
