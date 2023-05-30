'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const px2rem = require('postcss-px2rem')
// // 配置基本大小
// const postcss = px2rem({
//   //配置rem基准值 基准大小 baseSize
//   remUnit: 192 // 设计稿尺寸1920/10
// })
// 本地环境
// const devEnv = require('')
// // 测试环境
// const defaultSettings = require('')
// 生产环境
// const proEnv = require('')

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
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

const name = defaultSettings.title || '后台管理系统' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 8080 // dev port

// 转发配置数组
const urls = [
  // test 测试
  // {
  //   target: 'http://xard-gbs-test.runjian.com:8080',
  //   proxy: '/api'
  // },
  // dev  本地
  {
    target: 'http://xard-gbs-dev.runjian.com:8080',
    proxy: '/api'
  }
  // {
  //   target: 'http://xard-gbs-dev.runjian.com:8080',
  //   proxy: '/api'
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

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  // publicPath: '/',
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: getProxys()
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    plugins: [
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
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    // config.plugin("preload-index").tap(() => [
    //   {
    //     rel: "preload",
    //     fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
    //     include: "initial",
    //   },
    // ]);
    // config.plugin("preload-qr").tap(() => [
    //   {
    //     rel: "preload",
    //     fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
    //     include: "initial",
    //   },
    // ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    // config.module
    //   .rule('css')
    //   .test(/\.css$/)
    //   .oneOf('vue')
    //   .use('px2rem-loader')
    //   .loader('px2rem-loader')
    //   .options({
    //     remUnit: 192,
    //     remPrecision: 8
    //   })
    //   .end()
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
            // `runtime` must same as runtimeChunk name. default is `runtime`
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
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk = {
        name: (entrypoint) => `runtime~${entrypoint.name}`
      }
      // config.optimization.runtimeChunk('single')
    })
  },
  css: {
    loaderOptions: {
      // 全局引入src/styles/variables.scss文件下的变量
      scss: {
        prependData: `@import "~@/styles/variables.scss";@import "~@/styles/dom.scss";`
      }
    }
  }
}
