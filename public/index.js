// 获取配置文件
(function () {
  window.config = {}
  function readFile(url, callback) {
    let xmlhttp = new XMLHttpRequest();
    if (!xmlhttp) {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", url, false);
    xmlhttp.onload = function (res) {
      callback && callback(JSON.parse(res.target.response))
    };
    xmlhttp.send();
  }
  const time = new Date().getTime()
  readFile(`./config.json?t=${time}`, res => {
    window.config = { ...window.config, ...res }
  })
  readFile(`./statusCode.json?t=${time}`, res => {
    window.config = { ...window.config, ...{ statusCode: res } }
  })
})()
