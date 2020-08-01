import {filter} from '../utils/filter.js';

export const generateFilter = (tasks) => Object.entries(filter).map(
  ([filterName, filterTasks]) => ({
    name: filterName,
    count: filterTasks(tasks).length,
  }),
);
