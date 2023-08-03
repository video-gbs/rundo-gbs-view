'use strict'
const path = require('path')
const webpack = require('webpack')
const defaultSettings = require('./src/settings.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

const assetsCDN = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
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
  // test 测试
  // {
  //   target: 'http://xard-gbs-test.runjian.com:8080',
  //   proxy: '/api'

  // },
  // dev  本地
  {
    target: 'http://xard-gbs-test.runjian.com:8080',
    proxy: '/api'
  }
  // {
  //   target: 'http://xard-gbs-dev.runjian.com:8080',
  //   proxy: '/api'
  // }
  // 测试新接口
  // {
  //   target: 'http://192.192.192.92:9090',
  //   proxy: '/rbac'
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
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    public: '127.0.0.1',
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: getProxys()
  },
  configureWebpack: {
    name: name,
    plugins: [
      // AutoImport({
      //   resolvers: [ElementPlusResolver()]
      // }),
      // Components({
      //   resolvers: [ElementPlusResolver()]
      // }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5,
        minChunkSize: 100
      }),
      new CopyWebpackPlugin([
        {
          from: 'node_modules/@liveqing/liveplayer/dist/component/crossdomain.xml'
        },
        {
          from: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer.swf'
        },
        {
          from: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer-lib.min.js',
          to: 'js/'
        }
      ])
    ],
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('html')
        .use(HtmlWebpackPlugin)
        .tap((args) => {
          args[0].cdn = assetsCDN.assets
          return args
        })
    }
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    config.plugins.delete('prefetch')

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

    config.when(process.env.NODE_ENV !== 'development', (config) => {
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

    })
  },
  css: {
    loaderOptions: {

      scss: {
        prependData: `@import "~@/styles/variables.scss";@import "~@/styles/dom.scss";`
      }
    }
  }
}
