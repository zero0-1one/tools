module.exports = {
  arrayToBase64(data, type) {
    let typeArray = type.from(data)
    return Buffer.from(typeArray.buffer).toString('base64')
  },

  typeArrayToBase64(data) {
    return Buffer.from(data.buffer).toString('base64')
  },

  base64ToArray(str, type) {
    let typeArray = this.base64ToTypeArray(str, type)
    return Array.from(typeArray)
  },

  base64ToTypeArray(str, type) {
    let b = Buffer.from(str, 'base64')
    if (b.length % type.BYTES_PER_ELEMENT != 0) throw TypeError(`buffer 长度未被 ${type.BYTES_PER_ELEMENT} 整除`)
    return new type(b.buffer, b.byteOffset, b.length / type.BYTES_PER_ELEMENT)
  },
}
