import {filter} from '../utils/filter.js';

function generateFilter(tasks) {
  return Object.entries(filter).map(
    ([filterType, filterTasks]) => ({
      type: filterType,
      count: filterTasks(tasks).length,
    }),
  );
}

export {generateFilter};
