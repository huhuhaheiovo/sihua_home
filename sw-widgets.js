// 引入iztro库
importScripts('./iztro.min.js');

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
  data.sihua=siHuaInfo();
  console.log(data)
  // Render the widget with the template and data.
  try {
    await self.widgets.updateByTag(widget.definition.tag, {
      template: JSON.stringify(template),
      data: JSON.stringify(data)
    });
  } catch (e) {
    console.log('Failed to update widget', e);
  }
}




async function siHuaInfo() {
  const selectedDate = new Date();
  const selectedAstrolabe = iztro.astro.bySolar(selectedDate, 2, '男', true, 'zh-CN');
  const selectedHoroscope = selectedAstrolabe.horoscope(selectedDate);
  const selectedSiHua = selectedHoroscope.daily;

  // 定义四化类型
  const sihuaTypes = ['禄', '权', '科', '忌'];
  const sihuaClasses = ['sihua-lu', 'sihua-quan', 'sihua-ke', 'sihua-ji'];

  // 生成带颜色的四化星文本
  return selectedSiHua.mutagen.map((star, index) => {
    return `${sihuaClasses[index]}${star}(${sihuaTypes[index]})`;
  }).join('、');
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




