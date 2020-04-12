'use strict'
const base = require('../lib/base')
const jsonPack = require('../lib/jsonPack')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-like'))

describe('jsonPack_test', function () {
  it('jsonPack , jsonUnpack', function () {
    let obj = { a: 1, b: { d: { e: 'ee', f: 2 }, g: 'gg' }, c: [{ k: 3 }, { k: 4 }, { k: 5 }] }
    let struct1 = {
      type: 'obj',
      keys: ['a', 'b', 'c'],
      sub: {
        b: {
          type: 'obj',
          keys: ['d', 'g'],
          sub: {
            d: { type: 'obj', keys: ['e', 'f'] },
          },
        },
      },
    }
    let struct2 = base.deepCopy(struct1)
    struct2.sub.c = {
      type: 'array',
      sub: {
        type: 'obj',
        keys: ['k'],
      },
    }
    let struct3 = base.deepCopy(struct1)
    struct3.sub.c = {
      type: 'array',
      sub: [
        {
          type: 'obj',
          keys: ['k'],
        },
        null,
        {
          type: 'obj',
          keys: ['k'],
        },
      ],
    }

    let data1 = jsonPack.jsonPack(obj, struct1)
    let data2 = jsonPack.jsonPack(obj, struct2)
    let data3 = jsonPack.jsonPack(obj, struct3)
    expect(data1).to.be.deep.equal([1, [['ee', 2], 'gg'], [{ k: 3 }, { k: 4 }, { k: 5 }]])
    expect(data2).to.be.deep.equal([1, [['ee', 2], 'gg'], [[3], [4], [5]]])
    expect(data3).to.be.deep.equal([1, [['ee', 2], 'gg'], [[3], { k: 4 }, [5]]])

    let obj1 = jsonPack.jsonUnpack(data1, struct1)
    let obj2 = jsonPack.jsonUnpack(data2, struct2)
    let obj3 = jsonPack.jsonUnpack(data3, struct3)
    expect(obj1).to.be.deep.equal(obj)
    expect(obj2).to.be.deep.equal(obj)
    expect(obj3).to.be.deep.equal(obj)
  })
})
