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
  // uat 测试
  // {
  //   target: 'https://xard-gbs-uat.runjian.com:8080',
  //   proxy: '/api'

  // },
  // dev  本地
  {
    target: 'https://xard-gbs-test.runjian.com:8080',
    proxy: '/api'
  }
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
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    public: '',
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
    output: {
      sourcePrefix: " ",
    },
    amd: {
      toUrlUndefined: true,
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        },
        {
          test: /\.cjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        },
      //   {
      //     test: /\.ts$/,
      //     exclude: /node_modules/,
      //     enforce: 'pre',
      //     loader: 'tslint-loader'
      // },
      // {
      //     test: /\.tsx?$/,
      //     loader: 'ts-loader',
      //     exclude: /node_modules/,
      //     options: {
      //         appendTsSuffixTo: [/\.vue$/],
      //     }
      // }
      ]
    },
    resolve: {
      // extensions: [".ts", ".tsx", ".js", ".json",'cjs','mjs'],
      alias: {
        '@': resolve('src'),
        cesium: path.resolve(__dirname, Run3DSource)
      }
    },
    plugins: [
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
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

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
        minChunkSize: 100
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
      )
    ]
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
