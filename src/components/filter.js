const createFilterMarkup = (name, count) => {
  return (
    `<input
      type="radio"
      id="filter__all"
      class="filter__input visually-hidden"
      name="filter"
      checked
    />
    <label for="filter__all" class="filter__label">
      ${name} <span class="filter__all-count">${count}</span></label
    >`
  );
};

export const createFilterTemplate = () => {
  const filterMarkup = createFilterMarkup(`all`, 42);

  return `<section class="main__filter filter container">
    ${filterMarkup}
    ${filterMarkup}
    ${filterMarkup}
    ${filterMarkup}
    ${filterMarkup}
    ${filterMarkup}
  </section>`;
};
