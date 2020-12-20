const web = require('../lib/web')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-like'))

describe('webTools_test', function () {
  it('getIPAdressLike ', function () {
    let ip = web.getIPAdressLike(/^127\./)
    expect(ip).to.be.equal('127.0.0.1')
  })
})
