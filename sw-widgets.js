const WIDGET_TAG = 'hello';
import {getFormattedDate} from "./utils.js";



let template = null;
let templateActions = [];
let initialData = null;


self.addEventListener("widgetresume", event => {
  // 小组件刚刚安装，使用renderWidget渲染它
  // 将event.widget对象传递给函数
  // event.waitUntil(renderWidget(event.widget));
});


// 监听widgetinstall事件
self.addEventListener("widgetinstall", event => {
  // 小组件刚刚安装，使用renderWidget渲染它
  // 将event.widget对象传递给函数
  event.waitUntil(renderWidget(event.widget,"widgetinstall"));
});

self.addEventListener("widgetuninstall", event => {
  event.waitUntil(onWidgetUninstall(event.widget));
});

async function renderWidget(widget,life_cycle) {
  // 从小组件定义中获取模板和数据URL
  // const templateUrl = widget.definition.msAcTemplate;
  // const dataUrl = widget.definition.data;
  // 获取模板文本和数据
  template = await (await fetch(widget.definition.msAcTemplate)).json();
  initialData = await (await fetch(widget.definition.data)).json();
  initialData.formattedDate=getFormattedDate();
  // initialData.implement=life_cycle;
  // 使用模板和数据渲染小组件

  try {
    await self.widgets.updateByTag(WIDGET_TAG, {
      template: JSON.stringify(template),
      data: JSON.stringify(initialData)
    });
  } catch (e) {
    console.log('Failed to update widget', e);
  }
}

async function onWidgetUninstall(widget) {
  //卸载时，注销周期同步。
  //如果这是最后一个小部件实例，那么注销周期性同步。
  if (widget.instances.length === 1 && "update" in widget.definition) {
    await self.registration.periodicSync.unregister(widget.definition.tag);
  }
}


// 当服务工作线程被激活时，
// 将小组件更新到初始状态
self.addEventListener("activate", event => {
  event.waitUntil(updateWidgets());
  // 设置定期更新小组件
  setInterval(updateWidgets, 1000); // 每分钟更新一次
});

async function updateWidgets(event) {
  // 更新hello小组件
  await updatePwampWidget();
}

async function updatePwampWidget() {
  // 获取与Web应用清单中定义的标签匹配的小组件
  const widget = await self.widgets.getByTag(WIDGET_TAG);
  if (!widget) {
    return;
  }
  template = await (await fetch(widget.definition.msAcTemplate)).json();
  initialData = await (await fetch(widget.definition.data)).json();
  initialData.formattedDate="2021";
  initialData.implement="111";
  // 使用模板和数据渲染小组件
  try {
    await self.widgets.updateByTag(widget.definition.tag, {
      template: JSON.stringify(template),
      data: JSON.stringify(initialData)
    });
  } catch (e) {
    console.log('Failed to update widget', e);
  }
}

