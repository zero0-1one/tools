'use strict'
const base = require('../lib/base')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-like'))

describe('baseTools_test', function () {
  it('mid', function () {
    expect(base.mid(-2, -10, 5)).to.be.equal(-2)
    expect(base.mid(-2, 3, 5)).to.be.equal(3)
    expect(base.mid(-2, 10, 5)).to.be.equal(5)
  })

  it('mid with padding', function () {
    expect(base.mid(10, 60, 110, 20)).to.equal(60)
    expect(base.mid(10, 200, 110, 20)).to.below(base.mid(10, 430, 110, 20))
    expect(base.mid(10, -100, 110, 20)).to.above(base.mid(10, -230, 110, 20))
  })

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
      { key: 'c', val: 3 },
    ]
    let obj = {
      a: { key: 'a', val: 1 },
      b: { key: 'b', val: 2 },
      c: { key: 'c', val: 3 },
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
    expect(status).to.be.equal('resolved')
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
    expect(status).to.be.equal('rejected')
  })

  it('createWaiting timeout', async function () {
    let waiting = base.createWaiting(100)
    let status = ''
    waiting
      .then(() => {
        status = 'resolved'
      })
      .catch(e => {
        status = e.message
      })
    await base.sleep(300)
    waiting.resolve()
    expect(status).to.be.equal('waiting timeout')
  })

  it('doOrder 不相关', async function () {
    let owner = {}
    let order = []
    await Promise.all([
      base.doOrder('a', owner, async () => {
        await base.sleep(100)
        order.push('a')
      }),
      base.doOrder('b', owner, async () => {
        order.push('b')
      }),
    ])
    expect(order).to.deep.equal(['b', 'a'])
  })

  it('doOrder 相关', async function () {
    let owner = {}
    let order = []
    await Promise.all([
      base.doOrder('a', owner, async () => {
        await base.sleep(100)
        order.push('a')
      }),
      base.doOrder('a', owner, async () => {
        order.push('b')
      }),
    ])
    expect(order).to.deep.equal(['a', 'b'])
  })

  it('doOrder 超时', async function () {
    let owner = {}
    let order = []
    let results = await Promise.all([
      base.doOrder('a', owner, async () => {
        await base.sleep(100)
        order.push('a')
        return 'a'
      }),
      base.doOrder(
        'a',
        owner,
        async () => {
          order.push('b')
          return 'b'
        },
        200
      ),
      base
        .doOrder(
          'a',
          owner,
          async () => {
            order.push('c')
            return 'c'
          },
          10
        )
        .catch(e => e.message),
      base.doOrder('a', owner, async () => {
        order.push('d')
        return 'd'
      }),
    ]).catch(() => {})
    expect(results).to.deep.equal(['a', 'b', 'doOrder timeout', 'd'])
    expect(order).to.deep.equal(['a', 'b', 'd'])
  })

  it('format', function () {
    let exp = 'xxx a xxx b xxx a'
    expect(base.format('xxx {1} xxx {2} xxx {1}', 'a', 'b')).to.be.equal(exp)
    expect(base.format('xxx {a} xxx {b} xxx {a}', { a: 'a', b: 'b' })).to.be.equal(exp)
  })

  it('objGet, objSet', function () {
    let obj = { a: 1, b: ['c', { d: 2 }, 'e'] }
    expect(base.objGet(obj, 'a')).to.be.equal(1)
    expect(base.objGet(obj, 'b.1')).to.deep.equal({ d: 2 })
    expect(base.objGet(obj, 'x')).to.be.undefined
    expect(base.objGet(obj, 'b/2', '/')).to.be.equal('e')

    base.objSet(obj, 'x', 'x')
    base.objSet(obj, 'b.1.y', 'y')
    base.objSet(obj, 'b/2', [1, 2, 3], '/')

    expect(base.objGet(obj, 'x')).to.be.equal('x')
    expect(base.objGet(obj, 'b.1.y')).to.be.equal('y')
    expect(base.objGet(obj, 'b.2')).to.deep.equal([1, 2, 3])
  })

  it('repeatStr', function () {
    expect(base.repeatStr('a', 0)).to.be.equal('')
    expect(base.repeatStr('a', 1)).to.be.equal('a')
    expect(base.repeatStr('a', 5)).to.be.equal('aaaaa')

    expect(base.repeatStr('a', 0, ',')).to.be.equal('')
    expect(base.repeatStr('a', 1, ',')).to.be.equal('a')
    expect(base.repeatStr('a', 5, ',')).to.be.equal('a,a,a,a,a')
  })

  it.only('forCycle', function () {
    let array = [...'abcdefghijklmnop']
    let walk = []
    base.forCycle(array, 0, v => walk.push(v))
    expect(walk.join('')).to.be.equal('abcdefghijklmnop')

    walk = []
    base.forCycle(array, 2, v => walk.push(v))
    expect(walk.join('')).to.be.equal('cdefghijklmnopab')

    walk = []
    base.forCycle(array, 2, v => {
      walk.push(v)
      if (walk.length >= 3) return 'break'
    })
    expect(walk.join('')).to.be.equal('cde')
  })
})
