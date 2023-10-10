'use strict'
const Run3DSource = 'node_modules/@rjgf/run3d-engine/Source'
const Run3DWorkers = '../Build/Cesium/Workers'
const path = require('path')
const webpack = require('webpack')
const defaultSettings = require('./src/settings.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css', 'less', 'sacc']
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const TextReplacePlugin = require('./src/utils/textReplacePlugin')
// const TextReplacePlugin1 = require('./src/utils/textReplacePlugin')
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

const name = defaultSettings.title || '后台管理系统'

const port = process.env.port || process.env.npm_config_port || 8080

// 转发配置数组
const urls = [

  // dev  本地

  {
    target: 'http://172.20.0.111:8093',
    proxy: '/api/utils-template'
  },
  // uat
  {
    target: 'http://xard-gbs-uat.runjian.com:8080',
    proxy: '/api'

  },
  // {
  //   target: 'https://xard-gbs-test.runjian.com:8080',
  //   proxy: '/api'
  // },
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
  {
    target: 'http://172.20.0.75:9090',
    proxy: '/alarm'
  },
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
  console.log('proxys', proxys)
  return proxys
}
module.exports = {
  transpileDependencies: ['@wanglin1994/video-timeline'],
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    // public: '',
    port: port,
    open: true,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    historyApiFallback: {
      index: '/index.html' //与output的publicPath
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
    module: {
      rules: [
        //   {
        //   test: /\.(jpg|png|gif|bmp|jpeg)$/,
        //   use: {
        //     loader: "url-loader",
        //     options: {
        //       limit: 10240, // 设置限制文件大小为 10KB
        //     }
        //   }

        // }
      ]
    },
    resolve: {
      fallback: { "https": false, "zlib": false, "http": false, "url": false, "path": require.resolve("path-browserify"), },
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
      // new TextReplacePlugin1(),
      // new TextReplacePlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new CopyWebpackPlugin([
        { from: path.join(Run3DSource, Run3DWorkers), to: "Workers" },
      ]
      ),
      new CopyWebpackPlugin([{ from: path.join(Run3DSource, "Assets"), to: "Assets" }],
      ),
      new CopyWebpackPlugin([{ from: path.join(Run3DSource, "Widgets"), to: "Widgets" }],
      ),
      new CopyWebpackPlugin([
        {
          from: path.join(Run3DSource, "ThirdParty/Workers"),
          to: "ThirdParty/Workers",
        },
      ],
      ),
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
        maxChunks: 5,
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
      //   },
      //   {
      //     from: 'node_modules/@easydarwin/easyplayer/dist/component/crossdomain.xml',
      //   },
      //   {
      //     from: 'node_modules/@easydarwin/easyplayer/dist/component/EasyPlayer-lib.min.js',
      //     to: 'js/'
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
      .use('script-ext-html-webpack-plugin', [
        {
          inline: /runtime\..*\.js$/
        }
      ])
      .end()
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        elementUI: {
          name: 'chunk-elementUI',
          priority: 20,
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
        prependData: `@import "~@/styles/variables.scss";@import "~@/styles/dom.scss";`
      }
    }
  }
}
