const CACHE_PREFIX = `taskmanager-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/normalize.css`,
            `/css/style.css`,
            `/fonts/HelveticaNeueCyr-Bold.woff`,
            `/fonts/HelveticaNeueCyr-Bold.woff2`,
            `/fonts/HelveticaNeueCyr-Medium.woff`,
            `/fonts/HelveticaNeueCyr-Medium.woff2`,
            `/fonts/HelveticaNeueCyr-Roman.woff`,
            `/fonts/HelveticaNeueCyr-Roman.woff2`,
            `/img/add-photo.svg`,
            `/img/close.svg`,
            `/img/sample-img.jpg`,
            `/img/wave.svg`,
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      // Получаем все названия кэшей
      caches.keys()
        .then(
            // Перебираем их и составляем набор промисов на удаление
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      // Удаляем только те кэши,
                      // которые начинаются с нашего префикса,
                      // но не совпадают по версии
                      if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }

                      // Остальные не обрабатываем
                      return null;
                    }
                ).filter(
                    (key) => key !== null
                )
            )
        )
  );
});

const fetchHandler = (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          // Если в кэше нашёлся ответ на запрос (request),
          // возвращаем его (cacheResponse) вместо запроса к серверу
          if (cacheResponse) {
            return cacheResponse;
          }

          // Если в кэше не нашёлся ответ,
          // повторно вызываем fetch
          // с тем же запросом (request),
          // и возвращаем его
          return fetch(request).then(
              (response) => {
                // Если ответа нет, или ответ со статусом отличным от 200 OK,
                // или ответ небезопасного тип (не basic), тогда просто передаём
                // ответ дальше, никак не обрабатываем
                if (!response || response.status !== 200 || response.type !== `basic`) {
                  return response;
                }

                // А если ответ удовлетворяет всем условиям, клонируем его
                const clonedResponse = response.clone();

                // Копию кладём в кэш
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse));

                // Оригинал передаём дальше
                return response;
              }
          );
        })
  );
};

self.addEventListener(`fetch`, fetchHandler);
