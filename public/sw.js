const CACHE_NAME = 'laowang-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com'
];

// 安装 APP 时，把核心文件存起来
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 打开 APP 时，优先用存好的文件，没网也能开
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});