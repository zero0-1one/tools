const time = require('../lib/time')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-like'))

describe('timeTools_test', function () {
  it('timeAgo ', function () {
    time.setTimeEpoch(time.APP_EPOCH, true)
    expect(() => time.dayIdx()).to.throw()
    time.setTimeEpoch(time.APP_EPOCH, false)
    expect(() => time.dayIdx()).to.not.throw()
  })

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

  const time1 = '2020-09-28 00:00:00'
  const time2 = '2020-09-29 23:59:59.100'
  const time3 = '2020-09-27 12:00:00'
  it('dayTimeOutS, dayTimeOutMS', function () {
    expect(time.dayTimeOutS(time1)).to.be.equal(time.DAY_S)
    expect(time.dayTimeOutMS(time1)).to.be.equal(time.DAY_MS)
    expect(time.dayTimeOutS(time2)).to.be.equal(1)
    expect(time.dayTimeOutMS(time2)).to.be.equal(900)
    expect(time.dayTimeOutS(time3)).to.be.equal(time.DAY_S / 2)
    expect(time.dayTimeOutMS(time3)).to.be.equal(time.DAY_MS / 2)
  })

  it('weekTimeOutS, weekTimeOutMS', function () {
    expect(time.weekTimeOutS(time1)).to.be.equal(time.DAY_S * 7)
    expect(time.weekTimeOutMS(time1)).to.be.equal(time.DAY_MS * 7)
    expect(time.weekTimeOutS(time2)).to.be.equal(time.DAY_S * 5 + 1)
    expect(time.weekTimeOutMS(time2)).to.be.equal(time.DAY_MS * 5 + 900)
    expect(time.weekTimeOutS(time3)).to.be.equal(time.DAY_S / 2)
    expect(time.weekTimeOutMS(time3)).to.be.equal(time.DAY_MS / 2)
  })

  it('monthTimeOutS, monthTimeOutMS', function () {
    expect(time.monthTimeOutS(time1)).to.be.equal(time.DAY_S * 3)
    expect(time.monthTimeOutMS(time1)).to.be.equal(time.DAY_MS * 3)
    expect(time.monthTimeOutS(time2)).to.be.equal(time.DAY_S + 1)
    expect(time.monthTimeOutMS(time2)).to.be.equal(time.DAY_MS + 900)
    expect(time.monthTimeOutS(time3)).to.be.equal(time.DAY_S * 3 + time.DAY_S / 2)
    expect(time.monthTimeOutMS(time3)).to.be.equal(time.DAY_MS * 3 + time.DAY_MS / 2)
  })
})
