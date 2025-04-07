const WIDGET_TAG = 'hello';

// 监听widgetinstall事件
self.addEventListener("widgetinstall", event => {
  // 小组件刚刚安装，使用renderWidget渲染它
  // 将event.widget对象传递给函数
  event.waitUntil(renderWidget(event.widget));
});

self.addEventListener("widgetuninstall", event => {
  event.waitUntil(onWidgetUninstall(event.widget));
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
  const now = new Date();
  // 替换数据中的占位符
  return dataString.replace(/"2000-00-00T00:00:00Z"/g, `"${now}"`);
}

// 当服务工作线程被激活时，
// 将小组件更新到初始状态
self.addEventListener("activate", event => {
  // event.waitUntil(updateWidgets());
  // 设置定期更新小组件
  // setInterval(updateWidgets, 5000);
});

async function updateWidgets() {
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

