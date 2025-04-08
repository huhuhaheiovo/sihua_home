



// 监听widgetinstall事件
self.addEventListener("widgetinstall", event => {
  // 小组件刚刚安装，使用renderWidget渲染它
  event.waitUntil(renderWidget(event.widget));
});

async function renderWidget(widget) {
  // 从小组件定义中获取模板和数据URL
  const templateUrl = widget.definition.msAcTemplate;
  const dataUrl = widget.definition.data;

  // Fetch the template text and data.
  const template = await (await fetch(templateUrl)).json();
  const data = await (await fetch(dataUrl)).json();
  let dataJson=data;
  dataJson.implement="开始";
  const divElement =document.getElementById("a");
  divElement.innerHTML = "新的内容";
  // Render the widget with the template and data.
  try {
    await self.widgets.updateByTag(widget.definition.tag, {
      template: JSON.stringify(template),
      data: JSON.stringify(dataJson)
    });
  } catch (e) {
    console.log('Failed to update widget', e);
  }
}





// Update the widgets to their initial states
// when the service worker is activated.
self.addEventListener("activate", event => {
  event.waitUntil(updateWidgets());
});

async function updateWidgets() {
  // Get the widget that match the tag defined in the web app manifest.
  const widget = await self.widgets.getByTag("hello");
  if (!widget) {
    return;
  }

  // 从小组件定义中获取模板和数据URL
  const templateUrl = widget.definition.msAcTemplate;
  const dataUrl = widget.definition.data;

  // Fetch the template text and data.
  const template = await (await fetch(templateUrl)).json();
  const data = await (await fetch(dataUrl)).json();
  let dataJson=data;
  dataJson.implement="activate";
  // Render the widget with the template and data.
  try {
    await self.widgets.updateByTag(widget.definition.tag, {
      template: JSON.stringify(template),
      data: JSON.stringify(dataJson)
    });
  } catch (e) {
    console.log('Failed to update widget', e);
  }
}




