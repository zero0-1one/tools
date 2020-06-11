const base = require('./lib/base')
const web = require('./lib/web')
const time = require('./lib/time')
const jsonPack = require('./lib/jsonPack')
const buffer = require('./lib/buffer')
const file = require('./lib/file')
module.exports = {
  ...base,
  ...web,
  ...time,
  ...jsonPack,
  ...buffer,
  ...file
}
