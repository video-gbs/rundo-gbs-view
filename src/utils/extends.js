(function () {
  // 拓展字符串长度，中文算2个字节
  String.prototype.byteLength = function () {
    var count = 0;
    for (var i = 0, l = this.length; i < l; i++) {
      count += this.charCodeAt(i) <= 128 ? 1 : 2;
    }
    return count;
  }

  // 生成UUID方法
  const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  Math.uuid = function (len, radix) {
    var chars = CHARS,
      uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };

  // 开发环境才触发的回调方法
  window.__dev = (fn) => {
    if(process.env.NODE_ENV === 'development') {
      fn();
    }
  };
})();
