import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import axios from './utils/axios'
import '@mdi/font/css/materialdesignicons.css'
import store from './store'
import localforage from 'localforage'
import Message from 'vuetify-message-snackbar';
import adapter from 'webrtc-adapter';


Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(Message, {
  closeButtonContent: '关闭',
  autoTransitionSetting: true,
});


export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
})

Vue.prototype.$axios = axios;

//运用正则解析XML
// Vue.prototype.transXml = function (data) {
//   let regExp = new RegExp("(?<=:(?!\/).*?\/).*!", 'g');
//   let res = data.data.match(regExp);
//   let fin = JSON.parse(res[0]);
//   return fin
// };

//运用x2js解析XML
Vue.prototype.transXml = function (xmlres) {
  let x2js = require('x2js');
  let x2jsone = new x2js();
  let xml = x2jsone.xml2js(xmlres.data)['string']['__text'];
  let rep = JSON.parse(xml);
  return rep
};

//调用安卓插入原生日历 参数（标题，描述，分钟 eg: '巡检'，'04#'，30）
Vue.prototype.setcalendar = function (title, description, minuteData) {
  var calanderURL = 'content://com.android.calendar/calendars';
  var Uri = plus.android.importClass('android.net.Uri');
  var Calendar = plus.android.importClass('java.util.Calendar');
  var main = plus.android.runtimeMainActivity();
  var userCursor = plus.android.invoke(main.getContentResolver(), 'query', Uri.parse(calanderURL), null, null, null, null);
  var userCursor_count = plus.android.invoke(userCursor, 'getCount');
  var TimeZone = plus.android.importClass('java.util.TimeZone');
  var TimeZone_str = plus.android.invoke(TimeZone.getDefault(), 'getID');
  var ContentValues = plus.android.importClass("android.content.ContentValues");
  if (userCursor_count <= 0) {//如果没有日历账户
    var account = new ContentValues();
    var buildUpon = plus.android.invoke(Uri.parse(calanderURL), 'buildUpon');
    var CalendarContract = plus.android.importClass('android.provider.CalendarContract');
    plus.android.invoke(buildUpon, 'appendQueryParameter', CalendarContract.CALLER_IS_SYNCADAPTER, 'true');
    plus.android.invoke(buildUpon, 'appendQueryParameter', 'account_name', 'someone@something.com');
    plus.android.invoke(buildUpon, 'appendQueryParameter', 'account_type', 'com.android.exchange');
    //设置账户信息
    account.put('name', 'someone');
    account.put('account_name', 'someone@something.com');
    account.put('account_type', 'com.android.exchange');
    account.put('calendar_displayName', 'someone_calendar');
    account.put('visible', 1);
    account.put('calendar_color', '-9206951');
    account.put('calendar_access_level', '700');
    account.put('sync_events', 1);
    account.put('calendar_timezone', TimeZone_str);
    account.put('ownerAccount', 'someone@something.com');
    account.put('canOrganizerRespond', 0);
    //保存账户信息
    plus.android.invoke(main.getContentResolver(), 'insert', plus.android.invoke(buildUpon, 'build'), account);
    //重新定义userCursor
    userCursor = plus.android.invoke(main.getContentResolver(), 'query', Uri.parse(calanderURL), null, null, null, null);
    //重新定义userCursor_count
    userCursor_count = userCursor_count + 1;
  }
  plus.android.invoke(userCursor, 'moveToLast');
  var calId = plus.android.invoke(userCursor, 'getString', plus.android.invoke(userCursor, 'getColumnIndex', '_id'));
  var events = new ContentValues();
  var mCalendar = Calendar.getInstance();
  // plus.android.invoke(mCalendar, 'set', Calendar.HOUR_OF_DAY, hourData);
  // plus.android.invoke(mCalendar, 'set', Calendar.MINUTE, minuteData);
  var start = plus.android.invoke(plus.android.invoke(mCalendar, 'getTime'), 'getTime');
  mCalendar.setTimeInMillis(start + minuteData * 60 * 1000);
  var end = plus.android.invoke(plus.android.invoke(mCalendar, 'getTime'), 'getTime');
  events.put('title', title);
  events.put('description', description);
  events.put('calendar_id', calId);
  events.put('dtstart', end);
  events.put('dtend', end);
  events.put('hasAlarm', 1);
  events.put('eventTimezone', TimeZone_str);
  var newEvent = plus.android.invoke(main.getContentResolver(), 'insert', Uri.parse('content://com.android.calendar/events'), events);
  var id = plus.android.invoke(newEvent, 'getLastPathSegment');
  var values = new ContentValues();
  values.put('event_id', id);
  values.put('minutes', '0');
  values.put('method', '1');
  plus.android.invoke(main.getContentResolver(), 'insert', Uri.parse('content://com.android.calendar/reminders'), values);
};

//调用安卓后台计时器计时 参数(秒,音量，BEEP秒数，震动秒数 5,0.3,3,5000,currentProcess,currentItemNum)
Vue.prototype.setAlarm = function (num, vol, beep, vinum, currentProcess, currentItemNum) {
  plus.nativeUI.toast('#' + currentItemNum + '釜' + ':' + currentProcess + ' ' + '计时开始');
  var main = plus.android.runtimeMainActivity();
  var ALARM_RECEIVER = "alarm_receiver_" + Math.ceil(Math.random() * 10000000);
  var vibrator = plus.android.importClass('android.os.Vibrator');
  var receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
    onReceive: function (context, intent) {
      if (intent != null) {
        plus.push.createMessage("提醒", "alarm", {"title": "闹铃提醒"});
        plus.device.setVolume(vol);
        plus.device.beep(beep);
        var vib = main.getSystemService(Context.VIBRATOR_SERVICE);
        vib.vibrate(vinum);
        plus.nativeUI.alert('#' + currentItemNum + '釜' + ':' + currentProcess + ' ' + '计时时间到');
        main.unregisterReceiver(receiver); //取消监听
        plus.device.setWakelock(false);
      }
    }
  });
  var IntentFilter = plus.android.importClass('android.content.IntentFilter');
  var filter = new IntentFilter(ALARM_RECEIVER);
  main.registerReceiver(receiver, filter);
  var Calendar = plus.android.importClass('java.util.Calendar');
  var calendar = Calendar.getInstance();
  // 11点4分执行
  //calendar.set(Calendar.HOUR_OF_DAY, 11);
  //calendar.set(Calendar.MINUTE, 4);
  //calendar.set(Calendar.SECOND, 0);
  // 过5s 执行
  calendar.setTimeInMillis(Date.parse(new Date()));
  calendar.add(Calendar.SECOND, num);
  // --- 设置闹铃时间 end ---
  // --- 设置闹铃 ---
  var Intent = plus.android.importClass('android.content.Intent');
  var intent = new Intent(ALARM_RECEIVER);
  //
  var PendingIntent = plus.android.importClass('android.app.PendingIntent');
  var uninum = Math.ceil(Math.random() * 10000000);
  var sender = PendingIntent.getBroadcast(main, uninum, intent, 0);
  //
  var AlarmManager = plus.android.importClass("android.app.AlarmManager");
  var Context = plus.android.importClass("android.content.Context");
  var alarm = main.getSystemService(Context.ALARM_SERVICE);
  // 一次
  alarm.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), sender);
  plus.device.setWakelock(true);
};

localforage.config({
  name: 'RL-Data',
  storeName: 'Data'
});

/* eslint-disable no-new */
new Vue({
  router,
  store,
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app');
