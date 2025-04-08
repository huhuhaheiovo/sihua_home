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

  // Fetch the template text and data.
  const template = await (await fetch(templateUrl)).json();
  let data = await (await fetch(dataUrl)).json();
   data.implement="widgetinstall";
  // Render the widget with the template and data.
  await self.widgets.updateByTag(widget.definition.tag, {template, data});
}




