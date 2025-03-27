const CACHE_NAME = 'sihua-widget-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/pattern.min.css',
  'https://cdn.jsdelivr.net/npm/iztro/dist/iztro.min.js'
];

// 安装Service Worker并缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('已打开缓存');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活新版本Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截网络请求，优先从缓存中获取
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存命中，直接返回
        if (response) {
          return response;
        }

        // 克隆请求，因为请求只能使用一次
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // 检查是否有效的响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应，因为响应也只能使用一次
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
}); 