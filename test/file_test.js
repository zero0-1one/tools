const file = require('../lib/file')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-like'))

describe('fileTools_test', function () {
  it('pathJoin', function () {
    let path = file.pathJoin(__dirname, 'file_test.js')
    expect(path).to.be.equal(__filename)
  })

  it('fileAccess', async function () {
    let isCanAccess = await file.fileAccess(__dirname)
    expect(isCanAccess).to.be.true
  })

  it('fileAccessSync', function () {
    let isCanAccess = file.fileAccessSync(__dirname)
    expect(isCanAccess).to.be.true
  })

  it('rmDirs, mkDirs', async function () {
    let dir = file.pathJoin(__dirname, '.test')
    await file.rmDirs(dir)
    expect(file.fileAccessSync(dir)).to.be.false

    let deepPath = file.pathJoin(dir, 'a/b/c')
    await file.mkDirs(deepPath)
    expect(file.fileAccessSync(dir)).to.be.true
    expect(file.fileAccessSync(deepPath)).to.be.true

    await file.rmDirs(dir, false)
    expect(file.fileAccessSync(dir)).to.be.true
    expect(file.fileAccessSync(deepPath)).to.be.false
  })

  it('rmDirsSync, mkDirsSync', function () {
    let dir = file.pathJoin(__dirname, '.test')
    file.rmDirsSync(dir)
    expect(file.fileAccessSync(dir)).to.be.false

    let deepPath = file.pathJoin(dir, 'a/b/c')
    file.mkDirsSync(deepPath)
    expect(file.fileAccessSync(dir)).to.be.true
    expect(file.fileAccessSync(deepPath)).to.be.true

    file.rmDirsSync(dir, false)
    expect(file.fileAccessSync(dir)).to.be.true
    expect(file.fileAccessSync(deepPath)).to.be.false
  })
})
