const CACHE_NAME = 'sihua-widget-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/pattern.min.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable_icon.png',
  '/icons/widget-icon.png',
  '/icons/widget-screenshot.png',
  '/widgets/widget-template.json',
  'https://cdn.jsdelivr.net/npm/iztro/dist/iztro.min.js'
];

// Listen to the widgetinstall event.
self.addEventListener("widgetinstall", event => {
  // The widget just got installed, render it using renderWidget.
  // Pass the event.widget object to the function.
  event.waitUntil(renderWidget(event.widget));
});

async function renderWidget(widget) {
  // Get the template and data URLs from the widget definition.
  const templateUrl = widget.definition.msAcTemplate;
  const dataUrl = widget.definition.data;

  // Fetch the template text and data.
  const template = await (await fetch(templateUrl)).text();
  const data = await (await fetch(dataUrl)).text();

  // Render the widget with the template and data.
  await self.widgets.updateByTag(widget.definition.tag, {template, data});
}

// 安装Service Worker并缓存资源
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活Service Worker并清理旧缓存
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// 拦截网络请求并返回缓存资源
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如果找到了缓存的响应，则返回
        if (response) {
          return response;
        }
        
        // 否则发起网络请求
        return fetch(event.request).then(
          function(response) {
            // 检查我们是否收到有效的响应
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应，因为响应是一个流，只能使用一次
            var responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        );
      })
    );
});

// Windows小组件更新事件处理
self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'sihua-widget-update') {
    event.waitUntil(updateWidgetData());
  }
});

// 处理小组件数据更新
async function updateWidgetData() {
  // 这里可以添加获取最新四化数据的逻辑，如有需要的话
  // 目前我们的应用直接在前端计算四化数据，不需要后端更新
  console.log('小组件数据已更新');
  
  // 如果支持Windows小组件API，发送更新通知
  if (self.windows && self.windows.widgets) {
    self.windows.widgets.updateByTag('sihua');
  }
} 