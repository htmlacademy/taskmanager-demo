export const Color = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`
};

export const COLORS = Object.values(Color);

export const SortType = {
  DEFAULT: `default`,
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`
};

export const UserAction = {
  UPDATE_TASK: `UPDATE_TASK`,
  ADD_TASK: `ADD_TASK`,
  DELETE_TASK: `DELETE_TASK`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  ARCHIVE: `archive`
};

export const MenuItem = {
  ADD_NEW_TASK: `ADD_NEW_TASK`,
  TASKS: `TASKS`,
  STATISTICS: `STATISTICS`
};
