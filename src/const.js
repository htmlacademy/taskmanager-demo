// + Использование enum и условный "паттерн-мэтчинг"– шикарные темы, приятно видеть
export const Color = {
  BLACK: 'black',
  YELLOW: 'yellow',
  BLUE: 'blue',
  GREEN: 'green',
  PINK: 'pink',
};

export const COLORS = Object.values(Color);

export const SortType = {
  DEFAULT: 'default',
  DATE_DOWN: 'date-down',
  DATE_UP: 'date-up',
};

// - Константы, которые относяться к таскам лежат в глобальном файле -> Он невероятно распухнет на среднем проекте
export const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

// - Не вижу причины, почему этот enum должен иметь названия c маленькой буквы
export const FilterType = {
  ALL: 'all',
  OVERDUE: 'overdue',
  TODAY: 'today',
  FAVORITES: 'favorites',
  REPEATING: 'repeating',
  ARCHIVE: 'archive',
};

export const MenuItem = {
  ADD_NEW_TASK: 'ADD_NEW_TASK',
  TASKS: 'TASKS',
  STATISTICS: 'STATISTICS',
};
