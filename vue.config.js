'use strict'
const Run3DSource = './node_modules/@rjgf/run3d-engine/Source'
const Run3DWorkers = '../Build/Cesium/Workers'
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const timeStamp = new Date().getTime()

const assetsCDN = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    'ElementUI': 'ELEMENT',
    axios: 'axios'
  },
  css: [],
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js'
  ]
}

function resolve(dir) {
  return path.join(__dirname, dir)
}

// const name = defaultSettings.title || '后台管理系统'

const port = process.env.port || process.env.npm_config_port || 8080

// 转发配置数组
const urls = [

  // dev  本地

  // {
  //   target: 'http://xard-gbs-uat.runjian.com:8080',
  //   proxy: '/api/utils-template'
  // },
  // {
  //   target: 'http://xard-gbs-uat.runjian.com:8080',
  //   proxy: '/api/alarm-manage'
  // },
  // {
  //   target: 'http://xard-gbs-uat.runjian.com:8080',
  //   proxy: '/api/expansion'
  // },
  // uat 测试
  // {
  //   target: 'http://xard-gbs-uat.runjian.com:8080',
  //   proxy: '/api'

  // }
  {
    target: 'https://xard-gbs-test.runjian.com:8080',
    proxy: '/api'
  },
  // dev  本地
  // {
  //   target: 'http://116.205.143.13/tiles/gdhpjd',
  //   proxy: 'map/api'
  // }
  // {
  //   target: 'http://xard-gbs-dev.runjian.com:8080',
  //   proxy: '/api'
  // }
  // 测试新接口
  // {
  //   target: 'http://172.20.0.75:9090',
  //   proxy: '/rbac'
  // },
  // {
  //   target: 'http://172.20.0.75:9090',
  //   proxy: '/expansion'
  // }
]


/**
 * 遍历转发数组，生成转发json，在vue.config.js中调用
 * @returns {Object} 转发配置
 */
function getProxys() {
  const proxys = {}
  urls.forEach((item) => {
    if (item.proxy && item.proxy !== '') {
      proxys[item.proxy] = {
        target: item.target,
        changeOrigin: true,
        pathRewrite: {
          //打包
          // [`^` + item.proxy]: ''
          //本地
          [`^` + item.proxy]: item.proxy
        }
      }
    }
  })
  return proxys
}
module.exports = {
  transpileDependencies: ['@wanglin1994/video-timeline'],
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    historyApiFallback: {
      index: '/index.html'
    },
    proxy: getProxys()
  },

  configureWebpack: {
    name: '',
    output: {
      sourcePrefix: "",
      path: path.resolve(__dirname, 'dist'),
      filename: `[name].${timeStamp}.js`
    },
    amd: {
      toUrlUndefined: true,
    },
    module: {},
    resolve: {
      fallback: {
        "https": false,
        "zlib": false,
        "http": false,
        "url": false,
        "path": require.resolve("path-browserify"),
      },
      // fallback: {

      //   "https": require.resolve("https-browserify"),
      //   "zlib": require.resolve("browserify-zlib"),
      //   "path": require.resolve("path-browserify"),
      //   "url": require.resolve("url/")
      // },
      // extensions: [".ts", ".tsx", ".js", ".json",'cjs','mjs'],
      alias: {
        // '@': path.resolve(__dirname, 'src/')
        '@': resolve('src'),
      },
      mainFiles: ['index', 'Cesium']
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new CopyWebpackPlugin([{
        from: path.join(Run3DSource, Run3DWorkers),
        to: "Workers"
      }, ]),
      new CopyWebpackPlugin([{
        from: path.join(Run3DSource, "Assets"),
        to: "Assets"
      }], ),
      new CopyWebpackPlugin([{
        from: path.join(Run3DSource, "Widgets"),
        to: "Widgets"
      }], ),
      new CopyWebpackPlugin([{
        from: path.join(Run3DSource, "ThirdParty/Workers"),
        to: "ThirdParty/Workers",
      }, ], ),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify(""),
      }),
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 20,
        // minChunkSize: 100
      }),

      new CopyWebpackPlugin(
        [{
            from: 'node_modules/@liveqing/liveplayer/dist/component/crossdomain.xml'
          },
          {
            from: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer.swf'
          },
          {
            from: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer-lib.min.js',
            to: 'js/'
          }
        ]
      ),
      // new CopyWebpackPlugin([
      //   {
      //     from: 'node_modules/@easydarwin/easyplayer/dist/component/EasyPlayer.swf',
      //     to: './libs/EasyPlayer/'
      //   },
      //   {
      //     from: 'node_modules/@easydarwin/easyplayer/dist/component/crossdomain.xml',
      //     to: './libs/EasyPlayer/'
      //   },
      //   {
      //     from: 'node_modules/@easydarwin/easyplayer/dist/component/EasyPlayer-lib.min.js',
      //     to: './libs/EasyPlayer/'
      //   }
      // ])
    ]
  },
  chainWebpack(config) {

    // config.plugin('preload').tap(() => [
    //   {
    //     rel: 'preload',
    //     fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
    //     include: 'initial'
    //   }
    // ])
    config.optimization.minimizer('terser').tap((args) => {
      args[0].parallel = 4
      args[0].terserOptions.compress.warnings = true
      args[0].terserOptions.compress.drop_debugger = true
      args[0].terserOptions.compress.drop_console = true
      return args
    })

    config.plugins.delete('prefetch')
    config.module
      .rule('ignore')
      .test(/\.cjs$/)
      .exclude
      .add(/node_modules/)
      .end()
      .use('ignore-loader')
      .loader('ignore-loader')
      .options({})
      .end();

    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // config.when(process.env.NODE_ENV !== 'development', (config) => {
    config
      .plugin('ScriptExtHtmlWebpackPlugin')
      .after('html')
      .use('script-ext-html-webpack-plugin', [{
        inline: /runtime\..*\.js$/
      }])
      .end()
    config.optimization.splitChunks({
      chunks: 'all',
      minSize: 10000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 50,
      maxInitialRequests: 50,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          enforce: true
        },
        elementUI: {
          name: 'chunk-elementUI',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'),
          minChunks: 3,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    })

    config.optimization.runtimeChunk = {
      name: (entrypoint) => `runtime~${entrypoint.name}`
    }

    // })
  },
  css: {
    loaderOptions: {

      scss: {
        prependData: `@import "~@/styles/variables.scss";@import "~@/styles/dom.scss";`,
        sassOptions: {
          outputStyle: 'expanded'
        } // fix: 解决 element-ui 图标 icon 偶现乱码问题
      },

    }
  }
}
