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
  let now   =replaceDatePlaceholders()
  let updatedData = data.replace(/"2000-00-00T00:00:00Z"/g, `"${now}"`);
  // 使用模板和数据渲染小组件
  await self.widgets.updateByTag(widget.definition.tag, {template, updatedData});
}
// 替换日期占位符的函数
function replaceDatePlaceholders() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
  }, 1000);
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
},

);