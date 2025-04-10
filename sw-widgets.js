// 引入iztro库
importScripts('./iztro.min.js');
importScripts('./utils.js');


// 监听widgetinstall事件
self.addEventListener("widgetinstall", event => {
  // 小组件刚刚安装，使用renderWidget渲染它
  event.waitUntil(onWidgetInstall(event.widget));
});

self.addEventListener("widgetuninstall", event => {
  event.waitUntil(onWidgetUninstall(event.widget));
});


self.addEventListener("widgetresume", event => {
  event.waitUntil(onWidgetInstall(event.widget));
});

async function onWidgetInstall(widget) {
  // Register a periodic sync, if this wasn't done already.
  // We use the same tag for the sync registration and the widget to
  // avoid registering several periodic syncs for the same widget.
  const tags = await self.registration.periodicSync.getTags();
  if (!tags.includes(widget.definition.tag)) {
    await self.registration.periodicSync.register(widget.definition.tag, {
      minInterval: widget.definition.update
    });
  }

  // And also update the instance.
  await updateWidget(widget);
}


async function onWidgetUninstall(widget) {
  // On uninstall, unregister the periodic sync.
  // If this was the last widget instance, then unregister the periodic sync.
  if (widget.instances.length === 1 && "update" in widget.definition) {
    await self.registration.periodicSync.unregister(widget.definition.tag);
  }
}

// Listen to periodicsync events to update all widget instances
// periodically.
self.addEventListener("periodicsync", async event => {
  const widget = await self.widgets.getByTag(event.tag);
  if (widget && "update" in widget.definition) {
    event.waitUntil(updateWidget(widget));
  }
});


async function updateWidget(widget) {
  // 从小组件定义中获取模板和数据URL
  const templateUrl = widget.definition.msAcTemplate;
  const dataUrl = widget.definition.data;
  // Fetch the template text and data.
  const template = await (await fetch(templateUrl)).json();
  const data = await (await fetch(dataUrl)).json();
  const sihua=siHuaInfo();
  const zhou=weekStr();
  const selectedAstrolabe = iztro.astro.bySolar(getFormattedDate(),getChineseHour(),'男', true, 'zh-CN');
  data.sihua=sihua;
  data.lunarDate="农历："+selectedAstrolabe.lunarDate;
  data.time=selectedAstrolabe.time;
  data.zhou=zhou;
  if(zhou==="星期五"){
    data.isFriday="是周五"
  }else {
    data.isFriday="不是周五"
  }
  //组件状态
  // data.implement=num+1
  try {
    await self.widgets.updateByTag(widget.definition.tag, {
      template: JSON.stringify(template),
      data: JSON.stringify(data)
    });
  } catch (e) {
    console.log('Failed to update widget', e);
  }
}


 function siHuaInfo() {
  const selectedDate = new Date();
  const selectedAstrolabe = iztro.astro.bySolar(selectedDate, 2, '男', true, 'zh-CN');
  const selectedHoroscope = selectedAstrolabe.horoscope(selectedDate);
  const selectedSiHua = selectedHoroscope.daily;
  // 定义四化类型
  const sihuaTypes = ['禄', '权', '科', '忌'];
  // 生成带颜色的四化星文本
  const siHuaText = selectedSiHua.mutagen.map((star, index) => {
    return `${star}(${sihuaTypes[index]})`;
  }).join('、');
  return siHuaText;
}

function weekStr(){
  const today = new Date();
  const day = today.getDay(); // 0 表示星期日，1 表示星期一，以此类推
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const z=weekDays[day]
  return z;
}

/**
 * 获取当前时间对应的中国传统十二时辰
 * @returns {string} 时辰名称及序号
 */
function getChineseHour() {
  const now = new Date();
  const hour = now.getHours();
  const chineseHours = [
    { name: '子时', period: '23:00-01:00', index: 1 },
    { name: '丑时', period: '01:00-03:00', index: 2 },
    { name: '寅时', period: '03:00-05:00', index: 3 },
    { name: '卯时', period: '05:00-07:00', index: 4 },
    { name: '辰时', period: '07:00-09:00', index: 5 },
    { name: '巳时', period: '09:00-11:00', index: 6 },
    { name: '午时', period: '11:00-13:00', index: 7 },
    { name: '未时', period: '13:00-15:00', index: 8 },
    { name: '申时', period: '15:00-17:00', index: 9 },
    { name: '酉时', period: '17:00-19:00', index: 10 },
    { name: '戌时', period: '19:00-21:00', index: 11 },
    { name: '亥时', period: '21:00-23:00', index: 12 }
  ];
  
  let currentHour;
  
  if (hour >= 23 || hour < 1) {
    currentHour = chineseHours[0]; // 子时
  } else if (hour >= 1 && hour < 3) {
    currentHour = chineseHours[1]; // 丑时
  } else if (hour >= 3 && hour < 5) {
    currentHour = chineseHours[2]; // 寅时
  } else if (hour >= 5 && hour < 7) {
    currentHour = chineseHours[3]; // 卯时
  } else if (hour >= 7 && hour < 9) {
    currentHour = chineseHours[4]; // 辰时
  } else if (hour >= 9 && hour < 11) {
    currentHour = chineseHours[5]; // 巳时
  } else if (hour >= 11 && hour < 13) {
    currentHour = chineseHours[6]; // 午时
  } else if (hour >= 13 && hour < 15) {
    currentHour = chineseHours[7]; // 未时
  } else if (hour >= 15 && hour < 17) {
    currentHour = chineseHours[8]; // 申时
  } else if (hour >= 17 && hour < 19) {
    currentHour = chineseHours[9]; // 酉时
  } else if (hour >= 19 && hour < 21) {
    currentHour = chineseHours[10]; // 戌时
  } else if (hour >= 21 && hour < 23) {
    currentHour = chineseHours[11]; // 亥时
  }
  return currentHour.index;
}

