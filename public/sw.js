// 升级版本号，强制手机更新缓存
const CACHE_NAME = 'laowang-v3-auto';

// 1. 安装时：只存最核心的入口文件
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 强制立即生效
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        'https://cdn.tailwindcss.com'
      ]);
    })
  );
});

// 2. 激活时：清理旧版本的垃圾缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 核心逻辑：拦截所有请求 -> 有缓存读缓存 -> 没缓存去下载并自动存起来
self.addEventListener('fetch', (event) => {
  // 只缓存 http/https 请求，忽略 chrome-extension 等其他协议
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // A. 如果缓存里有，直接返回缓存 (秒开的关键)
      if (cachedResponse) {
        return cachedResponse;
      }

      // B. 如果缓存里没有，去网络下载
      return fetch(event.request).then((networkResponse) => {
        // 检查下载是否成功
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // C. 下载成功后，克隆一份存到缓存里 (为下次断网做准备)
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // D. 如果断网了且也没缓存，这里可以返回一个离线提示页(可选)
        // 目前咱们只要保证前面缓存逻辑对，通常不会走到这一步
      });
    })
  );
});