const base = require('./base')
module.exports = {
  jsonStruct(obj) {
    let type = typeof obj
    if (obj === null || obj === undefined || type == 'string' || type == 'number' || type == 'boolean') {
      return null
    }
    if (Array.isArray(obj)) {
      let sub = obj.map(v => this.jsonStruct(v))
      let isSame = true
      for (let i = 1; i < sub.length; i++) {
        if (!base.deepEqual(sub[0], sub[i])) {
          isSame = false
          break
        }
      }
      if (isSame) sub = sub[0]
      return {
        type: 'array',
        sub,
      }
    } else if (type == 'object') {
      let sub = {}
      for (const key in obj) {
        let s = this.jsonStruct(obj[key])
        if (s) sub[key] = s
      }
      return {
        type: 'obj',
        keys: Object.keys(obj).sort(),
        sub,
      }
    } else {
      throw new Error('不支持的类型: ' + type)
    }
  },

  jsonPack(obj, struct) {
    if (!struct) return obj
    let { type, keys, sub } = struct
    let data = []
    if (type == 'obj') {
      if (sub) {
        for (const key of keys) {
          data.push(this.jsonPack(obj[key], sub[key]))
        }
      } else {
        for (const key of keys) {
          data.push(obj[key])
        }
      }
    } else if (type == 'array') {
      if (Array.isArray(sub)) {
        obj.forEach((val, i) => {
          data.push(this.jsonPack(val, sub[i]))
        })
      } else {
        for (const val of obj) {
          data.push(this.jsonPack(val, sub))
        }
      }
    } else {
      throw new Error(
        `obj 与 struct 不匹配\nstruct:${JSON.stringify(struct, null, 2)}\nobj:${JSON.stringify(obj, null, 2)}`
      )
    }
    return data
  },

  jsonUnpack(data, struct) {
    if (!struct) return data
    let { type, keys, sub } = struct
    let obj
    if (type == 'obj') {
      obj = {}
      if (sub) {
        for (let i = 0; i < keys.length; i++) {
          obj[keys[i]] = this.jsonUnpack(data[i], sub[keys[i]])
        }
      } else {
        for (let i = 0; i < keys.length; i++) {
          obj[keys[i]] = data[i]
        }
      }
    } else if (type == 'array') {
      if (Array.isArray(sub)) {
        obj = data.map((v, i) => this.jsonUnpack(v, sub[i]))
      } else {
        obj = data.map(v => this.jsonUnpack(v, sub))
      }
    } else {
      throw new Error(
        `data 与 struct 不匹配\nstruct:${JSON.stringify(struct, null, 2)}\ndata:${JSON.stringify(data, null, 2)}`
      )
    }
    return obj
  },
}
