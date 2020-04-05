const createFilterMarkup = () => {
  return (
    `<input
      type="radio"
      id="filter__all"
      class="filter__input visually-hidden"
      name="filter"
      checked
    />
    <label for="filter__all" class="filter__label">
      All <span class="filter__all-count">13</span></label
    >`
  );
};

export const createFilterTemplate = () => {
  const filterMarkup = createFilterMarkup();

  return `<section class="main__filter filter container">
    ${filterMarkup}
    ${filterMarkup}
    ${filterMarkup}
    ${filterMarkup}
    ${filterMarkup}
    ${filterMarkup}
  </section>`;
};
