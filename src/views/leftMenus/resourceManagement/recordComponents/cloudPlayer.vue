<template>
  <div class="livePlayer">
    <LivePlayer
      ref="videoPlayer"
      class="live-player-container"
      :aspect="stretch ? 'fullscreen' : ''"
      id="livePlayerDevice"
      :videoUrl="videoUrl"
      :controls="controls"
      :autoplay="autoplay"
      @fullscreen="changFullscreen"
      @snapOutside="screenShot"
      :live="live"
    >
    </LivePlayer>

    <div class="trank" v-if="isShowStream">
      <div
        :key="index"
        v-for="(item, index) in tracks"
        style="width: 50%; float: left"
        loading
      >
        <div class="trankInfo" v-if="item.codecType === 0">
          <p>格式: {{ item.codecName }}</p>
          <p>类型: 视频</p>
          <p>分辨率: {{ item.width }} x {{ item.height }}</p>
          <p>帧率: {{ item.fps }}</p>
        </div>
        <div class="trankInfo" v-if="item.codecType === 1">
          <p>格式: {{ item.codecName }}</p>
          <p>类型: 音频</p>
          <p>采样位数: {{ item.sampleBit }}</p>
          <p>采样率: {{ item.sampleRate }}</p>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer'

import { Local } from '@/utils/storage'
export default {
  name: 'lqPlayer',
  components: {
    LivePlayer
  },
  data() {
    return {
      isError: false
    }
  },
  props: {
    videoUrl: {
      type: String,
      default: ''
    },
    isShowStream: {
      type: Boolean,
      default: false
    },
    tracks: {
      type: Array,
      default: function () {
        return []
      }
    },

    playbackRate: {
      type: Number,
      default: 1
    },
    playerIdx: {
      type: Number,
      default: 0
    },
    controls: {
      type: Boolean,
      default: false
    },
    live: {
      type: Boolean,
      default: true
    },
    onChangePlayTime: {
      //播放时间变化 (currentTime, event, ref) =>{}
      type: Function,
      default: Function.prototype
    },
    onPlayEnded: {
      //播放时间结束时间(event, ref) =>{}
      type: Function,
      default: Function.prototype
    },
    autoplay: {
      //自动播放
      type: Boolean,
      default: true
    },
    onPlay: {
      //开始播放(event, ref) =>{}
      type: Function,
      default: Function.prototype
    },
    onPause: {
      //暂停播放(event, ref) =>{}
      type: Function,
      default: Function.prototype
    },
    onError: {
      type: Function, //报错触发时间
      default: Function.prototype
    },
    muted: {
      //是否静音
      type: Boolean,
      default: true
    },
    stretch: {
      type: Boolean, //是否拉伸
      default: true
    },
    videoStyle: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
      const dom = document.getElementsByClassName('player-box')
      if (dom.length > 1) {
        dom[this.$props.playerIdx].style.height = this.$props.stretch
          ? '100%'
          : ''
      } else {
        dom[0].style.height = this.$props.stretch ? '100%' : ''
      }
    })
  },
  methods: {
    init() {
      this.$refs.videoPlayer.player.on('timeupdate', (event) => {
        this.onChangePlayTime(
          this.$refs.videoPlayer.getCurrentTime(),
          event,
          this.$refs.videoPlayer
        )

        // console.log('this.$refs===========',new Date(), this.$refs.videoPlayer.getCurrentTime())
      })
      this.$refs.videoPlayer.player.on('ended', (event) => {
        this.onPlayEnded(this.$refs.videoPlayer, event)
      })

      this.$refs.videoPlayer.player.on('error', (event) => {
        this.isError = true
        this.onError(this.$refs.videoPlayer, event)
      })

      this.$refs.videoPlayer.player.on('play', (event) => {
        this.isError = false
        this.onPlay(this.$refs.videoPlayer, event)
      })
      this.$refs.videoPlayer.player.on('pause', (event) => {
        if (!this.isError) this.onPause(this.$refs.videoPlayer, event)
      })

      //自动播放
      this.autoplay && this.$refs.videoPlayer.player.play()

      //设置变速
      if (this.playbackRate) {
        setTimeout(() => {
          const dom = this.$refs.videoPlayer.$el.querySelector('video')
          dom.playbackRate = this.playbackRate
          dom.defaultPlaybackRate = this.playbackRate
          dom.style = this.videoStyle
          dom.style['object-fit'] = this.stretch ? 'fill' : ''
        }, 100)
      }

      //设置静音
      this.$refs.videoPlayer.setMuted(this.muted)
    },
    changFullscreen(val) {
      console.log('changFullscreen', val)
    },
    handleScreenShot() {
      //触发快照
      var player = this.$refs.videoPlayer.$el.querySelector('video') //获取video的Dom节点
      player.setAttribute('crossOrigin', 'anonymous') //添加srossOrigin属性，解决跨域问题
      var canvas = document.createElement('canvas')
      canvas.width = player.clientWidth
      canvas.height = player.clientHeight
      canvas
        .getContext('2d')
        .drawImage(player, 0, 0, canvas.width, canvas.height) //截
      var dataURL = canvas.toDataURL('image/png') //将图片转成base64格式
      // document.getElementById("cutImage").appendChild(img);   //显示在页面中
      this.downFile(dataURL, '截图.jpg') //下载截图
    },
    //下载截图
    downFile(data, fileName) {
      var save_link = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        'a'
      ) //有效的内部空间URI
      save_link.href = data
      save_link.download = fileName
      var event = document.createEvent('MouseEvents')
      event.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      save_link.dispatchEvent(event)
    },
    screenShot(e) {
      //截屏事件
      var base64ToBlob = function (code) {
        let parts = code.split(';base64,')
        let contentType = parts[0].split(':')[1]
        let raw = window.atob(parts[1])
        let rawLength = raw.length
        let uInt8Array = new Uint8Array(rawLength)
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i)
        }
        return new Blob([uInt8Array], {
          type: contentType
        })
      }
      let aLink = document.createElement('a')
      let blob = base64ToBlob(e) //new Blob([content]);
      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true) //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = '截图'
      aLink.href = URL.createObjectURL(blob)
      aLink.click()
    },
    play(currentTime) {
      //播放，可设置时间
      this.$nextTick(() => {
        this.setCurrentTime(currentTime)
        this.$refs.videoPlayer.player.play()
      })
    },
    pause() {
      //暂停
      this.$refs.videoPlayer.player.pause()
    },
    getCurrentTime() {
      //获取当前播放时间
      this.$refs.videoPlayer.player.getCurrentTime()
    },
    setCurrentTime(currentTime) {
      //设置播放时间
      if (currentTime) {
        const videoDom = this.$refs.videoPlayer.$el.querySelector('video')
        videoDom.currentTime = currentTime
      }
    }
  },
  watch: {
    videoUrl(newVal) {
      if (newVal)
        this.$nextTick(() => {
          this.init()
        })
    },
    playbackRate: {
      deep: true,
      handler(newval) {
        let videoDom = this.$refs.videoPlayer.$el.querySelector('video')
        videoDom.playbackRate = newval
        Local.set('playbackRate', newval)
      }
    },
    muted(newVal) {
      this.$refs.videoPlayer.setMuted(newVal)
    },

    stretch(newVal) {
      const dom = document.getElementsByClassName('player-box')
      // dom.forEach((item) => {
      //   item.style.height = newVal ? '100%' : ''
      // })
      const videoDom = document.getElementsByClassName('vjs-tech')
      // console.log('videoDom', videoDom)
      videoDom.forEach((item1) => {
        item1.style['object-fit'] = newVal ? 'fill' : ''
      })
      // if (dom.length > 1) {

      // } else {
      //   dom[0].style.height = ''
      // }
      // document.getElementsByClassName('player-box')[
      //   this.$props.playerIdx
      // ].style.height = newVal ? '100%' : ''
      this.$forceUpdate()
    },
    videoStyle(newVal) {
      const videoDom = this.$refs.videoPlayer.$el.querySelector('video')
      console.log('videoStyle', videoStyle)
      videoDom.style = newVal
      videoDom.style['object-fit'] = this.stretch ? 'fill' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .video-wrapper {
  position: static !important;
  padding-bottom: 0 !important;
  height: 100%;
}
.live-player-container {
  width: 100%;
  height: 100%;

  & > div,
  .video-wrapper {
    padding-bottom: 0 !important;
    height: 100%;
  }
}
.livePlayer {
  // position: relative;
}
.trank {
  width: 380px;
  height: 180px;
  text-align: left;
  overflow: auto;
  position: absolute;
  color: red;
  font-size: 0.75rem;
  bottom: 20px;
  left: 20px;
  box-sizing: border-box;
}
.trankInfo {
  width: 100%;
  padding: 0 10%;
  text-shadow: 1px 1px black;
}
</style>
