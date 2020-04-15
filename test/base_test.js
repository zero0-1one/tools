'use strict'
const base = require('../lib/base')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-like'))

describe('baseTools_test', function () {
  it('deepCopy', function () {
    let a = [1, null, 2, { a: 1, b: 2, c: ['a', 1] }]
    let b = [1, null, 2, { b: 2, c: ['a', 1], a: 1 }]
    let c = base.deepCopy(a)
    let d = base.deepCopy(b)

    expect(a).to.deep.equal(b)
    expect(a).to.deep.equal(c)
    expect(a).to.deep.equal(d)
  })

  it('deepEqual', function () {
    let a = [1, null, 2, { a: 1, b: 2, c: ['a', 1] }]
    let b = [1, null, 2, { b: 2, c: ['a', 1], a: 1 }]
    expect(base.deepEqual(a, b)).to.be.true
    let c = base.deepCopy(a)
    let d = base.deepCopy(b)
    c[3].b = 'new'
    delete d[3].a
    expect(base.deepEqual(a, c)).to.be.false
    expect(base.deepEqual(b, d)).to.be.false
  })

  it('arrayToObj  objToArray', function () {
    let array = [
      { key: 'a', val: 1 },
      { key: 'b', val: 2 },
      { key: 'c', val: 3 }
    ]
    let obj = {
      a: { key: 'a', val: 1 },
      b: { key: 'b', val: 2 },
      c: { key: 'c', val: 3 }
    }
    expect(base.arrayToObj(array, 'key')).to.be.deep.equal(obj)
    expect(base.objToArray(obj)).to.be.deep.equal(array)
    expect(base.objToArray(obj, ['a', 'c'])).to.be.deep.equal([array[0], array[2]])
  })

  it('createWaiting resolve', async function () {
    let waiting = base.createWaiting()
    let status = ''
    waiting
      .then(() => {
        status = 'resolved'
      })
      .catch(() => {
        status = 'rejected'
      })
    waiting.resolve()
    await waiting
    expect(status).to.be.equal('resolved').to.be.equal(waiting.status)
  })

  it('createWaiting reject', async function () {
    let waiting = base.createWaiting()
    let status = ''
    waiting
      .then(() => {
        status = 'resolved'
      })
      .catch(() => {
        status = 'rejected'
      })
    waiting.reject()
    await waiting.catch(() => {})
    expect(status).to.be.equal('rejected').to.be.equal(waiting.status)
  })

  it('createWaiting timeout', async function () {
    let waiting = base.createWaiting(100)
    let status = ''
    waiting
      .then(() => {
        status = 'resolved'
      })
      .catch(e => {
        status = e
      })
    await base.sleep(300)
    waiting.resolve()
    expect(status).to.be.equal('timeout')
    expect(waiting.status).to.be.equal('rejected')
  })
})
