const WIDGET_TAG = 'sihua';

// 存储模板和初始数据
// 这些将在小组件首次安装时设置
let template = null;
let templateActions = [];
let initialData = null;

// 向客户端发送消息
async function sendClientMessage(data) {
  const allClients = await clients.matchAll({
    includeUncontrolled: true,
    type: 'all'
  });
  allClients.forEach(client => {
    client.postMessage(data);
  });
}

// 确保在Service Worker激活时更新小组件到初始状态
// 小组件可能在SW激活前安装，如果此时不更新
// 小组件将为空白状态
self.addEventListener('activate', (event) => {
  event.waitUntil(renderEmptyWidget());
});

// 监听widgetinstall事件，在小组件首次安装时更新
self.addEventListener('widgetinstall', (event) => {
  event.waitUntil(renderEmptyWidget(event));
});

// 监听widgetclick事件，响应用户在小组件中的操作
self.addEventListener('widgetclick', (event) => {
  switch (event.action) {
    case 'openapp':
      event.waitUntil(sendClientMessage({ action: 'openapp' }));
      break;
    case 'refresh':
      event.waitUntil(sendClientMessage({ action: 'refresh' }));
      break;
  }
});

// 监听来自客户端的消息，当日期更新时更新小组件
self.onmessage = (event) => {
  switch (event.data.action) {
    case 'update':
      event.waitUntil(renderUpdatedWidget(event.data));
      break;
  }
};

async function renderEmptyWidget(event) {
  if (!self.widgets) {
    return;
  }

  if (!template && event && event.widget) {
    // 如果传入事件，那是一个WidgetEvent
    // 可以用它访问小组件模板和数据
    // 并存储以便后续使用
    try {
      template = await (await fetch(event.widget.definition.msAcTemplate)).json();
      // 单独存储actions以便需要时添加/删除
      templateActions = template.actions || [];
      initialData = await (await fetch(event.widget.definition.data)).json();
    } catch (e) {
      console.error('从定义加载模板或数据失败:', e);
    }
  } else if (!template && !event) {
    // 如果没有事件且本地没有存储（不应该发生），
    // 可以通过小组件定义获取信息
    try {
      const widget = await self.widgets.getByTag(WIDGET_TAG);
      // 小组件可能尚未安装，退出
      if (!widget) {
        return;
      }

      template = await (await fetch(widget.definition.msAcTemplate)).json();
      // 单独存储actions以便需要时添加/删除
      templateActions = template.actions || [];
      initialData = await (await fetch(widget.definition.data)).json();
    } catch (e) {
      console.error('通过标签获取模板或数据失败:', e);
    }
  }

  try {
    await self.widgets.updateByTag(WIDGET_TAG, {
      template: JSON.stringify(template),
      data: JSON.stringify(initialData)
    });
  } catch (e) {
    console.error('更新小组件失败', e);
  }
}

async function renderUpdatedWidget(data) {
  if (!self.widgets || !template) {
    return;
  }

  const payload = {
    template: JSON.stringify(template),
    data: JSON.stringify(data)
  };

  try {
    await self.widgets.updateByTag(WIDGET_TAG, payload);
  } catch (e) {
    console.error('更新小组件失败', e);
  }
}

// 获取当前日期的四化数据
async function getSiHuaData() {
  const today = new Date();
  const heavenlyStem = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
  const earthlyBranch = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
  const sihuaTypes = ['禄', '权', '科', '忌'];
  
  // 简化的四化数据模拟
  return {
    heavenlyStem: heavenlyStem[today.getDate() % 10],
    earthlyBranch: earthlyBranch[today.getDate() % 12],
    dailySihua: `${heavenlyStem[today.getDate() % 10]}${earthlyBranch[today.getDate() % 12]}日 • 天同(禄)、天机(权)、太阳(科)、武曲(忌)`,
    userId: "user1"
  };
} 