let APP_EPOCH = new Date('2020-01-01 00:00:00')
let APP_EPOCH_VALUE = APP_EPOCH.valueOf()

const HOUR_S = 60 * 60 //一小时的秒数
const HOUR_MS = HOUR_S * 1000 //一小时的毫秒数
const DAY_S = HOUR_S * 24 //一天的秒数
const DAY_MS = HOUR_MS * 24 //一天的毫秒数
const WEEK_S = DAY_S * 7 //一周的秒数
const WEEK_MS = DAY_MS * 7 //一周的毫秒数
const YEAR_S = DAY_S * 365 //一年的秒数
const YEAR_MS = DAY_MS * 365 //一年的毫秒数

module.exports = {
  //初始化
  setTimeEpoch(epoch) {
    this.APP_EPOCH = APP_EPOCH = new Date(epoch)
    this.APP_EPOCH_VALUE = APP_EPOCH_VALUE = APP_EPOCH.valueOf()
  },

  APP_EPOCH,
  APP_EPOCH_VALUE,
  HOUR_S,
  HOUR_MS,
  DAY_S,
  DAY_MS,
  WEEK_S,
  WEEK_MS,
  YEAR_S,
  YEAR_MS,

  dateFormat(format, time) {
    var o = {
      'M+': time.getMonth() + 1, //month
      'd+': time.getDate(), //day
      'h+': time.getHours(), //hour
      'm+': time.getMinutes(), //minute
      's+': time.getSeconds(), //second
      'q+': Math.floor((time.getMonth() + 3) / 3), //quarter
      S: time.getMilliseconds(), //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
      if (new RegExp('(' + k + ')').test(format))
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return format
  },

  //当前时间 时间戳(s)
  nowS() {
    return Math.floor(Date.now() / 1000)
  },

  //当前时间 时间戳(ms)
  nowMS() {
    return Date.now()
  },

  getDayBegin(time) {
    if (!(time instanceof Date)) {
      time = time === undefined ? new Date() : new Date(time)
    }
    return new Date(time.getFullYear(), time.getMonth(), time.getDate())
  },

  getWeekBegin(time) {
    time = this.getDayBegin(time)
    let w = time.getDay()
    w = w == 0 ? 7 : w //0为星期天
    return new Date(time.valueOf() - (w - 1) * DAY_MS)
  },

  getMonthBegin(time) {
    if (!(time instanceof Date)) {
      time = time === undefined ? new Date() : new Date(time)
    }
    return new Date(time.getFullYear(), time.getMonth(), 1)
  },

  //获取相对APP_EPOCH日过去的秒数
  // time  时间, 可以是时间戳,字符串,或Date对象
  // UINT32（四字节） 能存储136年
  secIdx(time) {
    if (!(time instanceof Date)) {
      time = time === undefined ? new Date() : new Date(time)
    }
    let sec = (time.valueOf() - APP_EPOCH_VALUE) / 1000
    return Math.floor(sec)
  },

  //获取相对APP_EPOCH日过去的分钟数
  // time  时间, 可以是时间戳,字符串,或Date对象
  // UINT16（2字节） 能存储45天
  minIdx(time) {
    if (!(time instanceof Date)) {
      time = time === undefined ? new Date() : new Date(time)
    }
    let min = (time.valueOf() - APP_EPOCH_VALUE) / (60 * 1000)
    return Math.floor(min)
  },

  //获取相对APP_EPOCH日过去的小时数
  // time  时间, 可以是时间戳,字符串,或Date对象
  // UINT16（2字节） 能存储7.4年
  hourIdx(time) {
    if (!(time instanceof Date)) {
      time = time === undefined ? new Date() : new Date(time)
    }
    let hour = (time.valueOf() - APP_EPOCH_VALUE) / (24 * 60 * 1000)
    return Math.floor(hour)
  },

  //获取相对APP_EPOCH日过去的天数
  // time  时间, 可以是时间戳,字符串,或Date对象
  // UINT16（2字节） 能存储179年
  dayIdx(time) {
    if (!(time instanceof Date)) {
      time = time === undefined ? new Date() : new Date(time)
    }
    let day = (time.valueOf() - APP_EPOCH_VALUE) / DAY_MS
    return Math.floor(day)
  },

  //获取相对APP_EPOCH日过去的周数
  weekIdx(time) {
    return (this.getWeekBegin(time).valueOf() - this.getWeekBegin(APP_EPOCH).valueOf()) / (7 * DAY_MS)
  },

  //获取相对APP_EPOCH日过去的月数
  monthIdx(time) {
    if (!(time instanceof Date)) {
      time = time === undefined ? new Date() : new Date(time)
    }
    return (time.getFullYear() - APP_EPOCH.getFullYear()) * 12 + time.getMonth() - APP_EPOCH.getMonth()
  },

  secIdxToDate(secIdx) {
    return new Date(APP_EPOCH_VALUE + secIdx * 1000)
  },

  minIdxToDate(minIdx) {
    return new Date(APP_EPOCH_VALUE + minIdx * 60000)
  },

  hourIdxToDate(hourIdx) {
    return new Date(APP_EPOCH_VALUE + hourIdx * HOUR_MS)
  },

  //返回当天凌晨的时间点
  dayIdxToDate(dayIdx) {
    return new Date(APP_EPOCH_VALUE + dayIdx * DAY_MS)
  },

  weekIdxToDate(weekIdx) {
    return this.getWeekBegin(APP_EPOCH_VALUE + weekIdx * 7 * DAY_MS)
  },

  monthIdxToDate(monthIdx) {
    let year = APP_EPOCH.getFullYear() + Math.floor(monthIdx / 12)
    let month = APP_EPOCH.getMonth() + (monthIdx % 12)
    if (month > 12) {
      month -= 12
      year += 1
    }
    return new Date(year, month, 1)
  },

  // UTC 相对于当前时区的时间差值 (单位分钟)
  zoneOffset() {
    return new Date().getTimezoneOffset()
  },
}
