const createFilterMarkup = (name, count) => {
  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      checked
    />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

export const createFilterTemplate = () => {
  const filtersMarkup = [{
    name: `all`,
    count: 18,
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
  }].map((it) => createFilterMarkup(it.name, it.count)).join(`\n`);

  return `<section class="main__filter filter container">
    ${filtersMarkup}
  </section>`;
};
