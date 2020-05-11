const buffer = require('../lib/buffer')
const chai = require('chai')
const expect = chai.expect

describe('buffer_test', function () {
  it.only('arrayToBase64  base64ToArray', function () {
    let data = [1, 2, 6666, 890]
    let str = buffer.arrayToBase64(data, Uint16Array)
    let data2 = buffer.base64ToArray(str, Uint16Array)
    expect(data).to.deep.equal(data2)
  })

  it.only('arrayToBase64  base64ToArray', function () {
    let data = Uint16Array.from([1, 2, 6666, 890])
    let str = buffer.typeArrayToBase64(data)

    let data2 = buffer.base64ToTypeArray(str, Uint16Array)
    expect(data).to.deep.equal(data2)
  })
})
