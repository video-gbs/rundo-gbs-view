class TextReplacePlugin1 {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('TextReplacePlugin', (compilation, callback) => {
      Object.keys(compilation.assets).forEach((file) => {
        const asset = compilation.assets[file]
        if (asset.source() && typeof asset.source() === 'string') {
          compilation.assets[file] = {
            source: function () {
              return asset.source().replace('/login/Assets/', '/Assets/')
            },
            size: function () {
              return this.source().length
            }
          }
        }
      })
      callback()
    })
  }
}

module.exports = TextReplacePlugin1


class TextReplacePlugin2 {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('TextReplacePlugin', (compilation, callback) => {
      Object.keys(compilation.assets).forEach((file) => {
        const asset = compilation.assets[file]
        if (asset.source() && typeof asset.source() === 'string') {
          compilation.assets[file] = {
            source: function () {
              return asset.source().replace('/login/Workers/', '/Workers/')
            },
            size: function () {
              return this.source().length
            }
          }
        }
      })
      callback()
    })
  }
}

module.exports = TextReplacePlugin2
