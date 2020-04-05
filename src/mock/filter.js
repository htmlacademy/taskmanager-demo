const generateFilters = () => {
  return [{
    name: `all`,
    count: 42,
  }, {
    name: `overdue`,
    count: 18,
  }, {
    name: `today`,
    count: 18,
  }, {
    name: `favorites`,
    count: 18,
  }, {
    name: `repeating`,
    count: 18,
  }, {
    name: `archive`,
    count: 18,
  }];
};


export {generateFilters};
