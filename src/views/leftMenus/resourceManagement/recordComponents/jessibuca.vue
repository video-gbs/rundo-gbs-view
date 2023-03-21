<template>
  <div id="jessibuca" style="width: auto; height: 100%">
    <div
      id="container"
      ref="container"
      style="width: 100%; height: 100%; background-color: #545556"
      @dblclick="fullscreenSwich"
    >
      <div class="buttons-box" id="buttonsBox">
        <div class="buttons-box-left">
          <i
            v-if="!playing"
            class="iconfont icon-play jessibuca-btn"
            @click="playBtnClick"
          ></i>
          <i
            v-if="playing"
            class="iconfont icon-pause jessibuca-btn"
            @click="pause"
          ></i>
          <i class="iconfont icon-stop jessibuca-btn" @click="destroy"></i>
          <i
            v-if="isNotMute"
            class="iconfont icon-audio-high jessibuca-btn"
            @click="jessibuca.mute()"
          ></i>
          <i
            v-if="!isNotMute"
            class="aaa iconfont icon-audio-mute jessibuca-btn"
            @click="jessibuca.cancelMute()"
          ></i>
        </div>
        <div class="buttons-box-right">
          <span class="jessibuca-btn">{{ kBps }} kb/s</span>
          <i
            class="iconfont icon-camera1196054easyiconnet jessibuca-btn"
            @click="jessibuca.screenshot('截图', 'png', 0.5)"
            style="font-size: 1rem !important"
          ></i>
          <i
            class="iconfont icon-shuaxin11 jessibuca-btn"
            @click="playBtnClick"
          ></i>
          <i
            v-if="!fullscreen"
            class="iconfont icon-weibiaoti10 jessibuca-btn"
            @click="fullscreenSwich"
          ></i>
          <i
            v-if="fullscreen"
            class="iconfont icon-weibiaoti11 jessibuca-btn"
            @click="fullscreenSwich"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let _ts = 0
export default {
  name: 'jessibuca',
  data() {
    return {
      jessibuca: null,
      playing: false,
      isNotMute: true,
      quieting: false,
      fullscreen: false,
      loaded: false, // mute
      speed: 0,
      performance: '', // 工作情况
      kBps: 0,
      btnDom: null,
      videoInfo: null,
      volume: 1,
      rotate: 0,
      vod: true, // 点播
      forceNoOffscreen: true
    }
  },
  props: ['videoUrl', 'error', 'hasAudio', 'height'],
  mounted() {
    window.onerror = (msg) => {
      // console.error(msg)
    }
    let paramUrl = decodeURIComponent(this.$route.params.url)
    this.$nextTick(() => {
      //  let dom = document.getElementById("container");
      //  dom.style.height = (9/16 ) * dom.clientWidth + "px"
      if (typeof this.videoUrl == 'undefined') {
        this.videoUrl = paramUrl
      }
      this.btnDom = document.getElementById('buttonsBox')
      console.log('j初始化时的地址为: ' + this.videoUrl, this.hasAudio)
      this.play(this.videoUrl)
    })
  },
  watch: {
    videoUrl(newData, oldData) {
      this.play(newData)
    },
    immediate: true
  },
  methods: {
    create() {
      let options = {}
      console.log(this.$refs.container)
      console.log('hasAudio  ' + this.hasAudio)

      this.jessibuca = new window.Jessibuca(
        Object.assign(
          {
            container: this.$refs.container,
            videoBuffer: 0.2, // 最大缓冲时长，单位秒
            isResize: true,
            decoder: 'static/js/jessibuca/decoder.js',
            useMSE: false,
            showBandwidth: false,
            isFlv: true,
            // text: "WVP-PRO",
            // background: "static/images/zlm-logo.png",
            loadingText: '加载中',
            hasAudio: this.hasAudio,
            debug: false,
            supportDblclickFullscreen: false, // 是否支持屏幕的双击事件，触发全屏，取消全屏事件。
            operateBtns: {
              fullscreen: false,
              screenshot: false,
              play: false,
              audio: false,
              recorder: false
            },
            record: 'record',
            vod: this.vod,
            forceNoOffscreen: this.forceNoOffscreen,
            isNotMute: this.isNotMute
          },
          options
        )
      )

      let _this = this
      this.jessibuca.on('load', function () {
        console.log('on load init')
      })

      this.jessibuca.on('log', function (msg) {
        console.log('on log', msg)
      })
      this.jessibuca.on('record', function (msg) {
        console.log('on record:', msg)
      })
      this.jessibuca.on('pause', function () {
        _this.playing = false
      })
      this.jessibuca.on('play', function () {
        _this.playing = true
      })
      this.jessibuca.on('fullscreen', function (msg) {
        console.log('on fullscreen', msg)
        _this.fullscreen = msg
      })

      this.jessibuca.on('mute', function (msg) {
        console.log('on mute', msg)
        _this.isNotMute = !msg
      })
      this.jessibuca.on('cancelMute', function (msg) {
        console.log('cancel mute', _this.isNotMute)
      })
      this.jessibuca.on('audioInfo', function (msg) {
        // console.log("audioInfo", msg);
      })

      this.jessibuca.on('videoInfo', function (msg) {
        // this.videoInfo = msg;
        console.log('videoInfo', msg)
      })

      this.jessibuca.on('bps', function (bps) {
        // console.log('bps', bps);
      })

      this.jessibuca.on('timeUpdate', function (ts) {
        // console.log('timeUpdate,old,new,timestamp', _ts, ts, ts - _ts);
        _ts = ts
        // console.log('tiems' ts);
      })

      this.jessibuca.on('videoInfo', function (info) {
        console.log('videoInfo', info)
      })

      this.jessibuca.on('error', function (error) {
        console.log('error', error)
        localStorage.setItem('timeUpdate', JSON.stringify(_ts / 1000))
        localStorage.setItem('error', JSON.stringify(error))
      })

      this.jessibuca.on('timeout', function () {
        console.log('有异常timeout')
        _this.destroy()
        _this.play(_this.videoUrl)
        localStorage.setItem('timeUpdate', JSON.stringify(_ts / 1000))
      })

      this.jessibuca.on('start', function () {
        console.log('start')
      })

      this.jessibuca.on('performance', function (performance) {
        let show = '卡顿'
        if (performance === 2) {
          show = '非常流畅'
        } else if (performance === 1) {
          show = '流畅'
        }
        // console.log('performance', show)
        _this.performance = show
      })
      this.jessibuca.on('buffer', function (buffer) {
        // console.log('buffer', buffer);
      })

      this.jessibuca.on('stats', function (stats) {
        // console.log('stats', stats);
      })

      this.jessibuca.on('kBps', function (kBps) {
        _this.kBps = Math.round(kBps)
      })

      // 显示时间戳 PTS
      this.jessibuca.on('videoFrame', function () {})

      //
      this.jessibuca.on('metadata', function () {})
      this.jessibuca.on('delayTimeout', function (err) {
        console.log('有异常')
        _this.destroy()
        _this.play(_this.videoUrl)
        localStorage.setItem('timeUpdate', JSON.stringify(_ts / 1000))
      })
    },
    playBtnClick: function (event) {
      this.play(this.videoUrl)
    },
    play: function (url) {
      console.log(url)
      if (this.jessibuca) {
        this.destroy()
      }
      this.create()
      this.jessibuca.on('play', () => {
        this.playing = true
        this.loaded = true
        this.quieting = this.jessibuca.quieting
      })
      if (this.jessibuca.hasLoaded()) {
        this.jessibuca.play(url)
      } else {
        this.jessibuca.on('load', () => {
          console.log('load 播放')
          this.jessibuca.play(url)
        })
      }
    },
    pause: function () {
      if (this.jessibuca) {
        this.jessibuca.pause()
      }
      this.playing = false
      this.err = ''
      this.performance = ''
    },
    destroy: function () {
      if (this.jessibuca) {
        this.jessibuca.destroy()
      }
      if (document.getElementById('buttonsBox') == null) {
        document.getElementById('container').appendChild(this.btnDom)
      }
      this.jessibuca = null
      this.playing = false
      this.err = ''
      this.performance = ''
    },
    eventcallbacK: function (type, message) {
      // console.log("player 事件回调")
      // console.log(type)
      // console.log(message)
    },
    fullscreenSwich: function () {
      let isFull = this.isFullscreen()
      this.jessibuca.setFullscreen(!isFull)
      this.fullscreen = !isFull
    },
    isFullscreen: function () {
      return (
        document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        false
      )
    }
  },
  destroyed() {
    if (this.jessibuca) {
      this.jessibuca.destroy()
    }
    this.playing = false
    this.loaded = false
    this.performance = ''
  }
}
</script>

<style lang="scss" scoped>
.buttons-box {
  width: 100%;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
  display: flex;
  align-items: center;
  left: 0;
  bottom: 0;
  user-select: none;
  z-index: 10;
}
.jessibuca-btn {
  width: 20px;
  color: rgb(255, 255, 255);
  line-height: 27px;
  margin: 0px 10px;
  padding: 0px 2px;
  cursor: pointer;
  text-align: center;
  font-size: 0.8rem !important;
}
.buttons-box-right {
  position: absolute;
  right: 0;
}
</style>
