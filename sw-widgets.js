const WIDGET_TAG = 'hello';
import {getFormattedDate} from "./utils.js";





self.addEventListener("widgetresume", event => {
  // 小组件刚刚安装，使用renderWidget渲染它
  // 将event.widget对象传递给函数
  // event.waitUntil(renderWidget(event.widget));
});


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
  // const templateUrl = widget.definition.msAcTemplate;
  // const dataUrl = widget.definition.data;
  // 获取模板文本和数据
  // const template = await (await fetch(widget.definition.msAcTemplate)).json();

  const initialData={
    "id": 401117857,
    "season": 2019,
    "week": 1,
    "season_type": "regular",
    "formattedDate": "",
    "implement": "",
    "neutral_site": false,
    "conference_game": false,
    "attendance": null,
    "venue_id": 3852,
    "venue": "Navy-Marine Corps Memorial Stadium",
    "home_team": "Navy",
    "home_conference": "American Athletic",
    "home_points": 45,
    "home_line_scores": [
      10,
      14,
      14,
      7
    ],
    "away_team": "Holy Cross",
    "away_conference": null,
    "away_points": 7,
    "away_line_scores": [
      0,
      7,
      0,
      0
    ]
  }
  initialData.formattedDate=getFormattedDate();
  initialData.implement="widgetuninstall";
  // 使用模板和数据渲染小组件

  const templateUrl = widget.definition.msAcTemplate;
  const dataUrl = widget.definition.data;

  // Fetch the template text and data.
  const template = await (await fetch(templateUrl)).text();
  const data = await (await fetch(dataUrl)).text();
  // Render the widget with the template and data.
  await self.widgets.updateByTag(widget.definition.tag, {template, initialData});
}

async function onWidgetUninstall(widget) {
  //卸载时，注销周期同步。
  //如果这是最后一个小部件实例，那么注销周期性同步。
  if (widget.instances.length === 1 && "update" in widget.definition) {
    await self.registration.periodicSync.unregister(widget.definition.tag);
  }
}




