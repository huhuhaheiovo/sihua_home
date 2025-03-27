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

// 处理小组件安装事件
self.addEventListener("widgetinstall", event => {
  // 小组件刚刚被安装，使用renderWidget渲染它
  // 将event.widget对象传递给函数
  event.waitUntil(renderWidget(event.widget));
});

async function renderWidget(widget) {
  try {
    // 从小组件定义中获取模板URL
    const templateUrl = widget.definition.ms_ac_template;
    
    // 获取当前日期的四化数据
    const today = new Date();
    const heavenlyStem = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
    const earthlyBranch = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
    const sihuaTypes = ['禄', '权', '科', '忌'];
    
    // 简化的四化数据模拟
    const dailySihua = `${heavenlyStem[today.getDate() % 10]}${earthlyBranch[today.getDate() % 12]}日 • 天同(禄)、天机(权)、太阳(科)、武曲(忌)`;
    
    // 获取模板文本
    const template = await (await fetch(templateUrl)).text();
    
    // 创建数据对象
    const data = {
      dailySihua: dailySihua,
      userId: "user1"
    };
    
    // 使用模板和数据渲染小组件
    if (self.widgets) {
      await self.widgets.updateByTag(widget.definition.tag, {template, data});
      console.log('小组件更新成功');
    } else {
      console.error('widgets API不可用');
    }
  } catch (error) {
    console.error('渲染小组件时出错:', error);
  }
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
  
  // 立即激活Service Worker，不等待刷新
  self.skipWaiting();
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
  
  // 立即接管客户端
  event.waitUntil(self.clients.claim());
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
  try {
    // 获取当前日期的四化数据
    const today = new Date();
    const heavenlyStem = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
    const earthlyBranch = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
    
    // 简化的四化数据模拟
    const dailySihua = `${heavenlyStem[today.getDate() % 10]}${earthlyBranch[today.getDate() % 12]}日 • 天同(禄)、天机(权)、太阳(科)、武曲(忌)`;
    
    // 准备数据对象
    const data = {
      dailySihua: dailySihua,
      userId: "user1"
    };
    
    // 获取模板内容
    const templateResponse = await fetch('/widgets/widget-template.json');
    const template = await templateResponse.text();
    
    // 如果支持Windows小组件API，发送更新通知
    if (self.widgets) {
      await self.widgets.updateByTag('sihua', {template, data});
      console.log('小组件数据已更新');
    } else {
      console.error('widgets API不可用');
    }
  } catch (error) {
    console.error('更新小组件数据时出错:', error);
  }
} 