// 再次升级版本号，强制清除之前的旧逻辑
const CACHE_NAME = 'laowang-v5-offline-king';

// 初始必须存死的文件（App的小命都在这几个文件里）
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com'
];

// 1. 安装阶段：强行把核心文件塞进手机硬盘
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在强制写入核心缓存...');
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting(); // 别等了，立刻上位
});

// 2. 激活阶段：把旧版本的破烂缓存全扔了
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim(); // 宣布接管所有页面
});

// 3. 拦截请求：这是最关键的“离线优先”逻辑
self.addEventListener('fetch', (event) => {
  // 只管 http 类的请求
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // --- 核心逻辑 A：如果硬盘里有，直接给，一秒都不许等网络 ---
      if (cachedResponse) {
        return cachedResponse;
      }

      // --- 核心逻辑 B：硬盘里没有，再去网上下载，下完顺手存起来 ---
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // --- 核心逻辑 C：如果断网了，且没存首页，强行返回存好的 index.html ---
        // 这样可以防止出现你截图里的“无法访问”页面
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});