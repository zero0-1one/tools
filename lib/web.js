const base = require('./base')
const crypto = require('crypto')

module.exports = {
  //获取本机ip地址
  getIPAdress(family = 'IPv4') {
    let interfaces = require('os').networkInterfaces()
    for (let devName in interfaces) {
      let items = interfaces[devName]
      for (let i = 0; i < items.length; i++) {
        let alias = items[i]
        if (alias.family === family && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address
        }
      }
    }
  },

  getIPAdressLike(reg, family = 'IPv4') {
    let interfaces = require('os').networkInterfaces()
    for (let devName in interfaces) {
      let items = interfaces[devName]
      for (let i = 0; i < items.length; i++) {
        let alias = items[i]
        if (alias.family === family && reg.test(alias.address)) {
          return alias.address
        }
      }
    }
  },

  checkMobile(mobile) {
    return /^1\d{10}$/.test(mobile)
  },

  checkEmail(email) {
    return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i.test(email)
  },

  checkAuthCode(code, len) {
    return code.length == len && /^\d+$/.test(code)
  },

  generateAuthCode(len) {
    return base
      .randomInt(1, Math.pow(10, len) - 1)
      .toString()
      .padStart(len, '0')
  },

  hash(str, algorithm, encoding = 'hex') {
    let hash = crypto.createHash(algorithm)
    hash.update(str)
    return hash.digest(encoding)
  },

  md5(str, encoding = 'hex') {
    let hash = crypto.createHash('md5')
    hash.update(str)
    return hash.digest(encoding)
  },

  sha1(str, encoding = 'hex') {
    let hash = crypto.createHash('sha1')
    hash.update(str)
    return hash.digest(encoding)
  },

  hmac(str, key, algorithm = 'sha256', encoding = 'hex') {
    let hmac = crypto.createHmac(algorithm, key)
    hmac.update(str)
    return hmac.digest(encoding)
  },

  passwordHash(password, algorithm = 'sha256', key = '') {
    key = key || base.randomStr(6)
    return '#zo-pwd|' + algorithm + '|' + key + '|' + this.hmac(password, key, algorithm, 'base64')
  },

  passwordVerify(password, passwordHash) {
    if (!passwordHash.startsWith('#zo-pwd|')) throw new Error('不是zo-pwd类型的密码')
    let data = passwordHash.split('|')
    return this.passwordHash(password, data[1], data[2]) === passwordHash
  },

  // 获取随机整数
  getRandNumber(count, minLen = 6) {
    let len = Math.max(minLen, Math.ceil(Math.log10(count * 5)))
    let min = Math.pow(10, len - 1)
    let max = Math.pow(10, len) - 1
    return base.randomInt(min, max)
  },

  getRandNumberNoPretty(count, minLen) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let id = this.getRandNumber(count, minLen)
      let set = new Set([...id.toString()])
      if (set.size > 2) return id //保留靓号
    }
  },

  getBirthdayByIdentity(identity) {
    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/
    var arr_data = identity.match(re_eighteen)
    var year = arr_data[2]
    var month = arr_data[3]
    var day = arr_data[4]
    var birthday = new Date(year + '/' + month + '/' + day)
    if (birthday.getFullYear() == year && birthday.getMonth() + 1 == month && birthday.getDate() == day) {
      return birthday
    }
  },

  checkIdentity(identity) {
    identity = identity.toUpperCase()
    if (!/^\d{17}(\d|X)$/.test(identity)) {
      return false
    }
    let city = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外',
    }
    if (!city[identity.substring(0, 2)]) {
      return false
    }
    if (!this.getBirthdayByIdentity(identity)) {
      return false
    }
    let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2] //校验位
    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += identity[i] * factor[i]
    }
    if (parity[sum % 11] != identity[17]) {
      return false
    }
    return true
  },
}
