//未使用  |  可做分割符
const BASE_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#@$%&()*+,-./:;<=>?[]^_`{}~'
const BASE_CHARS_MAP = {}
for (let i = 0; i < BASE_CHARS.length; i++) {
  BASE_CHARS_MAP[BASE_CHARS[i]] = i
}

module.exports = {
  BASE_CHARS: BASE_CHARS,
  BASE_CHARS_MAP: BASE_CHARS_MAP,

  toBaseNum(num, radix = BASE_CHARS.length) {
    let str = ''
    do {
      let mod = num % radix
      num = (num - mod) / radix
      str = BASE_CHARS[mod] + str
    } while (num != 0)
    return str
  },

  fromBaseNum(str, radix = BASE_CHARS.length) {
    let num = 0
    for (let i = 0; i < str.length; i++) {
      num = num * radix + BASE_CHARS_MAP[str[i]]
    }
    return num
  },

  //首字母大写
  ucfirst(str) {
    return str[0].toUpperCase() + str.slice(1)
  },

  format(str, ...args) {
    for (var i = 0; i < args.length; i++) {
      str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i])
    }
    return str
  },

  dateFormat(format, time) {
    var o = {
      'M+': time.getMonth() + 1, //month
      'd+': time.getDate(), //day
      'h+': time.getHours(), //hour
      'm+': time.getMinutes(), //minute
      's+': time.getSeconds(), //second
      'q+': Math.floor((time.getMonth() + 3) / 3), //quarter
      S: time.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
      if (new RegExp('(' + k + ')').test(format))
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return format
  },

  //随机 [min, max] 区间内的整数
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  //def = [
  //  [0.1, 10, 30], [0.6, 40, 100]
  //]
  randomIntSegment(def, multi = 1) {
    let r = Math.random()
    for (const d of def) {
      if (r <= d[0]) return this.randomInt(d[1] * multi, d[2] * multi)
    }
  },

  randomStr(len, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let str = ''
    for (let i = 0; i < len; i++) {
      str += chars.charAt(this.randomInt(0, chars.length - 1))
    }
    return str
  },

  //高效的二分法重复字符串
  repeatStr(target, n) {
    let s = target
    let total = ''
    while (n > 0) {
      if (n % 2 == 1) total += s
      if (n == 1) break
      s += s
      n = n >> 1
    }
    return total
  },

  shuffle(array, randomInt) {
    if (randomInt == undefined) {
      randomInt = this.randomInt
    }
    const max = array.length - 1
    for (let i = 0; i < max; i++) {
      let index = randomInt(i, max)
      let temp = array[index]
      array[index] = array[i]
      array[i] = temp
    }
  },

  //适用于 只包含基本类型属性的obj
  deepCopy(obj, reserveTypes = ['function']) {
    let type = typeof obj
    if (reserveTypes.includes(type)) return obj
    if (obj === undefined || obj === null || type == 'string' || type == 'number' || type == 'boolean') {
      return obj
    } else if (Array.isArray(obj)) {
      let a = new Array(obj.length)
      obj.forEach((v, i) => (a[i] = this.deepCopy(v))) // 使用 forEach 不使用 for of! 防止拷贝只设置了 length 的'空'数组
      return a
    } else if (type == 'object') {
      let copy = {}
      for (const key in obj) {
        copy[key] = this.deepCopy(obj[key])
      }
      return copy
    } else {
      throw new TypeError('未实现的copy类型: ' + type)
    }
  },

  //深度赋值  pathMode b如:  {'a.b.c':1} 深度赋值 {a:{b:{c:1}}}  不存在则会创建对应 Object(但不会创建数组)
  //数组可以使用  a.0.c  赋值, 但当 a 不存在时候创建的是 Object, 而不是 Array.  (因为数字可能会很大)
  deepAssign(target, source, pathMode = true) {
    let pathData = []
    for (const [k, v] of Object.entries(source)) {
      if (pathMode && k.includes('.')) {
        pathData.push([k, v])
        continue
      }
      if (v && !Array.isArray(v) && typeof v == 'object' && !Array.isArray(target[k]) && typeof target[k] == 'object') {
        this.deepAssign(target[k], v)
      } else {
        target[k] = v
      }
    }
    for (const [path, value] of pathData) {
      let names = path.split('.')
      names = names.map(v => v.trim())
      let temp = target
      for (let i = 0; i < names.length - 1; i++) {
        if (names[i] in temp) {
          temp = temp[names[i]]
        } else {
          temp[names[i]] = temp = {}
        }
      }
      let field = names.pop()
      temp[field] = value
    }
    return target
  },

  deepEqual(a, b) {
    let type = typeof a
    if (type != typeof b) return false
    if (a === null || a === undefined || type == 'string' || type == 'number' || type == 'boolean') {
      return a === b
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length != b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (!this.deepEqual(a[i], b[i])) return false
      }
    } else if (type == 'object') {
      let keys = Object.keys(a).sort()
      if (!this.deepEqual(keys, Object.keys(b).sort())) return false
      for (const key of keys) {
        if (!this.deepEqual(a[key], b[key])) return false
      }
    } else {
      throw new Error('不支持的类型: ' + type)
    }
    return true
  },

  //深度冻结
  deepFreeze(obj) {
    if (!obj) {
      return obj
    }
    Object.freeze(obj)
    let propNames = Object.getOwnPropertyNames(obj)
    propNames.forEach(name => {
      let prop = obj[name]
      if (typeof prop == 'object' && prop !== null && !Object.isFrozen(prop)) {
        //Object.isFrozen(prop) 防止obj循环引用，导致死循环
        this.deepFreeze(prop)
      }
    })
    return obj
  },

  //获取一个obj唯一key字符串, (obj数据必须是 JSON 安全的)
  //如果: deepEqual(obj1, obj2) 则: getKeyStr(obj1) ===  getKeyStr(obj2)  反之亦然
  getKeyStr(obj) {
    return JSON.stringify(this._getOrderObj(obj))
  },

  //转换成有序的表达 只返回 数组 或简单值(null, string, number, boolean)
  //其中数组 第一个元素代表类型 1:数组, 2:object
  _getOrderObj(obj) {
    let type = typeof obj
    if (obj === null || type == 'string' || type == 'number' || type == 'boolean') {
      return obj
    }
    if (Array.isArray(obj)) {
      return [1, obj.map(v => this._getOrderObj(v))]
    } else if (obj.__proto__ === Object.prototype) {
      let keys = Object.keys(obj)
      keys.sort()
      let order = []
      for (let key of keys) {
        if (obj[key] === undefined) continue //undefined 出现在这里可以认为是安全的
        order.push([key, this._getOrderObj(obj[key])])
      }
      return [2, order]
    } else {
      throw new Error('可能存在非安全转换:' + JSON.stringify(obj))
    }
  },

  createWaiting(timeout) {
    let refResolve
    let refReject
    let waiting = new Promise((resolve, reject) => {
      refResolve = resolve
      refReject = reject
    })
    waiting.resolve = refResolve
    waiting.reject = refReject
    if (timeout !== undefined) {
      setTimeout(() => {
        waiting.reject('timeout')
      }, timeout)
    }
    return waiting
  },

  async sleep(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  },

  //按顺序执行异步
  async doOrder(name, owner, cb) {
    let wait = null
    let self = this.createWaiting()
    if (owner[name]) {
      wait = owner[name]
    }
    owner[name] = self //更新最后一个任务
    try {
      if (wait) await wait
      return await cb()
    } finally {
      if (owner[name] === self) delete owner[name]
      process.nextTick(() => self.resolve())
    }
  },

  //组合
  _forComb(comb, range, n, cb) {
    if (n == 0) {
      cb([...comb])
    }
    if (range.length == 0) {
      return
    }
    if (n > 0) {
      let e = range.pop()
      this._forComb(comb, range, n, cb) //不使用 e
      comb.push(e)
      this._forComb(comb, range, n - 1, cb) //使用 e
      comb.pop()
      range.push(e)
    }
  },

  forComb(range, n, cb) {
    this._forComb([], range, n, cb)
  },

  combNum(m, n) {
    //m  n 比较大时候累乘 会丢失精度 所以采用下面新算法  "乘" 一次,  就 "除" 一次
    let num = 1
    for (let i = 1; i <= n; i++) {
      num *= m--
      num /= i
    }
    return num
  },

  arrayToObj(array, keyName, cb) {
    let obj = {}
    if (cb) {
      for (const row of array) {
        obj[row[keyName]] = cb(row)
      }
    } else {
      for (const row of array) {
        obj[row[keyName]] = row
      }
    }
    return obj
  },

  objToArray(obj, keys) {
    keys = keys || Object.keys(obj)
    return keys.map(key => obj[key])
  }
}
