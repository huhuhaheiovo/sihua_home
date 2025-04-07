const WIDGET_TAG = 'pwamp';
const HELLO_WIDGET_TAG = 'hello-world';

// 监听widgetinstall事件
self.addEventListener("widgetinstall", event => {
  // 小组件刚刚安装，使用renderWidget渲染它
  // 将event.widget对象传递给函数
  event.waitUntil(renderWidget(event.widget));
});

async function renderWidget(widget) {
  // 从小组件定义中获取模板和数据URL
  const templateUrl = widget.definition.msAcTemplate;
  const dataUrl = widget.definition.data;

  // 获取模板文本和数据
  const template = await (await fetch(templateUrl)).text();
  let data = await (await fetch(dataUrl)).text();
  
  // 替换数据中的日期占位符
  data = replaceDatePlaceholders(data);

  // 使用模板和数据渲染小组件
  await self.widgets.updateByTag(widget.definition.tag, {template, data});
}

// 替换日期占位符的函数
function replaceDatePlaceholders(dataString) {
  // 创建当前日期对象
  const now = new Date().toDateString();
  
  // 获取ISO格式的日期字符串
  // const isoDate = now.toDateString()
  
  // 格式化日期为 yyyy-mm-dd hh:mm:ss
  // const pad = (num) => String(num).padStart(2, '0');
  // const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  
  // 替换数据中的占位符
  let updatedData = dataString.replace(/"2000-00-00T00:00:00Z"/g, `"${now}"`);
  // updatedData = updatedData.replace(/"2000-00-00T00:00:00Z"/g, `"${formattedDate}"`);
  return updatedData;
}

// 当服务工作线程被激活时，
// 将小组件更新到初始状态
self.addEventListener("activate", event => {
  event.waitUntil(updateWidgets());
  
  // 设置定期更新小组件 - 每10秒更新一次
  setInterval(async () => {
    // 获取所有注册的小组件
    const widgets = await self.widgets.getAll();
    // 更新每个小组件
    for (const widget of widgets) {
      await renderWidget(widget);
    }
  }, 10000);
});

async function updateWidgets() {
  // 更新pwamp小组件
  await updatePwampWidget();
  // 更新hello-world小组件
  await updateHelloWorldWidget();
}

async function updatePwampWidget() {
  // 获取与Web应用清单中定义的标签匹配的小组件
  const widget = await self.widgets.getByTag(WIDGET_TAG);
  if (!widget) {
    return;
  }

  // 使用小组件定义，获取模板和数据
  const template = await (await fetch(widget.definition.msAcTemplate)).text();
  let data = await (await fetch(widget.definition.data)).text();
  
  // 替换数据中的日期占位符
  data = replaceDatePlaceholders(data);

  // 使用模板和数据渲染小组件
  await self.widgets.updateByTag(widget.definition.tag, {template, data});
}

async function updateHelloWorldWidget() {
  // 获取hello-world小组件
  const widget = await self.widgets.getByTag(HELLO_WIDGET_TAG);
  if (!widget) {
    return;
  }

  // 获取模板和数据
  const template = await (await fetch(widget.definition.msAcTemplate)).text();
  let data = await (await fetch(widget.definition.data)).text();
  
  // 替换数据中的日期占位符
  data = replaceDatePlaceholders(data);

  // 渲染小组件
  await self.widgets.updateByTag(widget.definition.tag, {template, data});
}

self.addEventListener('widgetclick', (event) => {
  switch (event.action) {
    case 'previous-song':
      // 播放上一首歌的应用逻辑...
      break;
    case 'next-song':
      // 播放下一首歌的应用逻辑...
      break;
  }
});