import {FilterType} from '../const';
import {isTaskExpired, isTaskExpiringToday, isTaskRepeating} from './task';

const filter = {
  [FilterType.ALL]: (tasks) => tasks.filter((task) => !task.isArchive),
  [FilterType.OVERDUE]: (tasks) => tasks.filter((task) => isTaskExpired(task.dueDate) && !task.isArchive),
  [FilterType.TODAY]: (tasks) => tasks.filter((task) => isTaskExpiringToday(task.dueDate) && !task.isArchive),
  [FilterType.FAVORITES]: (tasks) => tasks.filter((task) => task.isFavorite && !task.isArchive),
  [FilterType.REPEATING]: (tasks) => tasks.filter((task) => isTaskRepeating(task.repeating) && !task.isArchive),
  [FilterType.ARCHIVE]: (tasks) => tasks.filter((task) => task.isArchive),
};

export {filter};
