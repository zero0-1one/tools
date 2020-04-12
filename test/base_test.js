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
})
