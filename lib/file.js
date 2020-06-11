const fs = require('fs')
const path = require('path')
const fsPromises = fs.promises

module.exports = {
  pathJoin(...args) {
    return path.join(...args)
  },

  mkDirsSync(dirPath) {
    if (!fs.existsSync(dirPath)) {
      this.mkDirsSync(path.dirname(dirPath))
      fs.mkdirSync(dirPath)
    }
  },

  //也可以用来判断 文件夹
  async fileAccess(filePath) {
    let isError = false
    await fsPromises.access(filePath).catch(() => (isError = true))
    return !isError
  },

  fileAccessSync(filePath) {
    try {
      fs.accessSync(filePath)
      return true
    } catch (e) {
      return false
    }
  },

  async mkDirs(dirPath) {
    if (!(await this.fileAccess(dirPath))) {
      await this.mkDirs(path.dirname(dirPath))
      await fsPromises.mkdir(dirPath)
    }
  },

  rmDirsSync(dirPath, rmSelf = true) {
    let files = []
    if (!fs.existsSync(dirPath)) return
    files = fs.readdirSync(dirPath)
    for (const file of files) {
      let curPath = path.join(dirPath, file)
      if (fs.statSync(curPath).isDirectory()) {
        this.rmDirsSync(curPath, true)
      } else {
        fs.unlinkSync(curPath)
      }
    }
    if (rmSelf) fs.rmdirSync(dirPath)
  },

  async rmDirs(dirPath, rmSelf = true) {
    if (!(await this.fileAccess(dirPath))) return
    let files = await fsPromises.readdir(dirPath)
    for (const file of files) {
      let curPath = path.join(dirPath, file)
      let stat = await fsPromises.stat(curPath)
      if (stat.isDirectory()) {
        await this.rmDirs(curPath, true)
      } else {
        await fsPromises.unlink(curPath)
      }
    }
    if (rmSelf) await fsPromises.rmdir(dirPath)
  },
}
