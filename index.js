const base = require('./lib/base')
const web = require('./lib/web')
const time = require('./lib/time')
const jsonPack = require('./lib/jsonPack')
module.exports = {
  ...base,
  ...web,
  ...time,
  ...jsonPack,
}
