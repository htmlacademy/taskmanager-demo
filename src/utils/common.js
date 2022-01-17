// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random

/**
 * @param {number} a - Первая граница диапазона. Значение по умолчанию - 0
 * @param {number} b - Вторая граница диапазона. Значение по умолчанию - 1
 * @returns {number} - Случайное целое число
 */
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
