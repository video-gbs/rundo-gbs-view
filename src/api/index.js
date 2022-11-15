/**
 * 遍历methods文件夹下所有接口文件
 */
const req = require.context('./method', false, /\.js$/)
const jsnames = {}
const requireAllJs = function(rc) {
  rc.keys().forEach(k => {
    jsnames[k.replace('./', '').replace('.js', '')] = rc(k).default
  })
}
requireAllJs(req)

export default jsnames
