// 导入pako
import pako from 'pako'

// b64Data-->传入加密的数据进行解密
function unzip(b64Data) {
  let strData = atob(b64Data)
  // Convert binary string to character-number array
  const charData = strData.split('').map(function (x) {
    return x.charCodeAt(0)
  })
  // Turn number array into byte-array
  const binData = new Uint8Array(charData)
  // // unzip
  const data = pako.inflate(binData)
  // Convert gunzipped byteArray back to ascii string:
  strData = String.fromCharCode.apply(null, new Uint16Array(data))
  return strData
}

// 加密
function zip(str) {
  if (typeof str !== 'string') {
    str = JSON.stringify(str)
  }
  const binaryString = pako.gzip(str, { to: 'string' })
  return btoa(binaryString)
}

export { unzip, zip }
