// - Не люблю понятия "common" и "utils". Они слишком обобщенные. Понимаю, что не всегда можно от них избавиться,
// но лучше это делать. Например, `getRandomInteger` может уйти в `math.js`, а `isOnline` лучше убрать.

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// - Зачем эта абстракция? Она добавляет слой непонимания (что именно значит online не поймешь пока сюда не посмотришь)
// и не может быть заменена на что-то другое (мы хотим знать доступна ли сейчас сеть или нет).
export const isOnline = () => window.navigator.onLine;
