const time = require('../lib/time')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-like'))

describe('timeTools_test', function () {
  it('timeAgo', function () {
    let now = Date.now()
    expect(time.timeAgo(now)).to.be.equal('刚刚')
    expect(time.timeAgo(now - 60 * 1000)).to.be.equal('1分钟前')
    expect(time.timeAgo(now - 3 * 60 * 1000)).to.be.equal('3分钟前')

    expect(time.timeAgo(now - time.HOUR_MS)).to.be.equal('1小时前')
    expect(time.timeAgo(now - 2 * time.HOUR_MS)).to.be.equal('2小时前')
    expect(time.timeAgo(now - time.DAY_MS)).to.be.equal('昨天')
    expect(time.timeAgo(now - 2 * time.DAY_MS)).to.be.equal('前天')
    expect(time.timeAgo(now - 3 * time.DAY_MS)).to.be.equal('3天前')
    expect(time.timeAgo(now - 364 * time.DAY_MS)).to.be.equal('364天前')
    expect(time.timeAgo(now - 365 * time.DAY_MS)).to.be.equal('1年前')
  })
})
