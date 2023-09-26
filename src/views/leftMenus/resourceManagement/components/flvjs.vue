<template>
  <div class="video-box-container">
    <video
      ref="testVideo"
      class="video-player"
      autoplay
      :style="stretch ? 'object-fit: fill' : ''"
      :id="idx"
      muted="muted"
      width="100%"
      height="100%"
    ></video>
    <div class="player-header">
      <!-- <span class="head-left">{{
        deviceData.sourceType
          ? deviceData.selfChannelName
          : deviceData.channelName
      }}</span> -->
      <span class="head-left">{{ leftTopName }}</span>
      <div class="head-right">
        <span>正在实时预览</span>
        <i class="el-icon-close icon-close" @click.stop="closeVideo"></i>
      </div>
    </div>
    <DirectionControl
      ref="playtoolDirect"
      class="playtoolDirectionControl"
      :showContentList="showContentList"
      :formPlaytoolShowControl="showControl"
      v-show="showControl"
    />
    <playerTool
      ref="playerTool"
      :idx="idx"
      :player="player"
      :deviceData="deviceData"
      @handleOpenControl="handleOpenControl"
      :showControl="showControl"
      :isShowStream="isShowStream"
      @handleShowStream="handleShowStream"
      :onBoxSelection="handBoxSelection"
      :hasAudio="hasAudio"
      v-bind="$attrs"
      v-on="$listeners"
    ></playerTool>

    <div class="trank" v-if="isShowStream">
      <div
        :key="index"
        v-for="(item, index) in tracks"
        style="width: 50%; float: left"
        loading
      >
        <!-- <span>流 {{ index }}</span> -->
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
    </div>
  </div>
</template>

<script>
import PlayerTool from './playerTool.vue'
import flvjs from 'flv.js'
import DirectionControl from './DirectionControl'
import { getStreamInfo } from '@/api/method/live'
import { Local } from '@/utils/storage'
import moment from 'moment'

const IS_CONTROL_TYPES = [1, 4] //有云台功能的ptztype

export default {
  name: 'jessibuca',
  components: {
    PlayerTool,
    DirectionControl
  },
  data() {
    return {
      videoCover: {},
      showControl: false,
      jessibuca: null,
      playing: false,
      isNotMute: false,
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
      forceNoOffscreen: false,
      player: null,
      recSecond: 0,
      title: '视频播放',
      testSrc: '',
      flvPlayer: null,

      reconnectIng: false, //是否正在重连中

      prevEnd: 0,
      reconnectCount: 0, // 重连次数

      timerId: null,
      timerId1: null,
      loadStatus: true,
      statusMsg: '摄像机未开启，请联系',
      lastDecodedFrame: 0,
      isShowStream: false,
      tracks: [],
      resVideoUrl: '',
      resChannelId: '',
      resPlayerIdx: 0,
      showContentList: [],
      errorNum: 0
    }
  },
  props: [
    'videoUrl',
    'leftTopName',
    'error',
    'hasAudio',
    'height',
    'idx',
    'deviceData',
    'index',
    'stretch',
    'playerIdx',
    'channelExpansionId',
    'flvStreamId'
  ],
  created() {
    this.resVideoUrl = this.$props.videoUrl

    this.resChannelId = this.$props.flvStreamId

    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
    // if (this.timerId1) {
    //   clearInterval(this.timerId1)
    //   this.timerId1 = null
    // }
  },
  mounted() {
    this.$on('closeAll', () => {
      this.player && this.player.close()
      this.$emit('close', this.index)
    })

    this.$nextTick(async () => {
      this.setsrc()
    })
  },
  watch: {
    '$props.videoUrl': {
      handler: function (params) {
        this.$nextTick(() => {
          this.resVideoUrl = params
          this.createVideo()
        })
      },
      deep: true
    },
    MaxHeight: {
      handler: function (v) {
        this.$nextTick(() => {
          this.MaxHeight_ = v
        })
      },
      deep: true
    },
    playerIdx(val) {
      this.resPlayerIdx = val
      Local.set('resPlayerIdx', val)
      console.log('playerIdx~~~~~~~~~~~', val, this.resPlayerIdx)
      // this.resShowContent.map((item, index) => {
      //   if (item && item !== '' && item.length > 0) {
      //     if (index === this.resPlayerIdx) {
      //       this.initType[this.resPlayerIdx] = true
      //     } else {
      //       this.initType[this.resPlayerIdx] = false
      //     }
      //   }
      // })
      this.$forceUpdate()
    },
    deep: true,
    immediate: true
  },
  methods: {
    //获取码流信息
    async getStreamInfo() {
      this.tracks = []
      await getStreamInfo({
        channelExpansionId: Local.get('flvCloudId')[this.resPlayerIdx],
        streamId: Local.get('flvStreamId')[this.resPlayerIdx]
      }).then((res) => {
        if (res.data.code === 0) {
          this.tracks = res.data.data.tracks
          this.isShowStream = true
        }
      })
    },

    handleShowStream(i) {
      if (!this.isShowStream) {
        this.$emit('videoClick', i + 1)
        this.$nextTick(() => {
          this.getStreamInfo()
        })
      } else {
        this.isShowStream = !this.isShowStream
      }
    },
    handBoxSelection() {
      this.isShowStream = !this.isShowStream
    },
    handleOpenControl(i) {
      this.$emit('videoClick', i + 1)
      this.showControl = !this.showControl
      this.showContentList = Local.get('videoUrl')
    },
    createVideo() {
      this.reconnectIng = true
      let that = this

      const videoElement = document.getElementById(that.idx)
      if (flvjs.isSupported()) {
        // 存在视频先销毁
        if (that.flvPlayer !== null) {
          that.flvPlayer.pause()
          that.flvPlayer.unload()
          that.flvPlayer.detachMediaElement()
          that.flvPlayer.destroy()
          that.flvPlayer = null
        }
        that.flvPlayer = flvjs.createPlayer(
          {
            type: 'flv',
            url: that.resVideoUrl,
            isLive: true,
            hasAudio: false
          },

          {
            cors: true, // 是否跨域
            // enableWorker: true, // 是否多线程工作
            // fixAudioTimestampGap: false,
            enableStashBuffer: false, // 是否启用缓存
            // autoCleanupMaxBackwardDuration: 12, //    当向后缓冲区持续时间超过此值（以秒为单位）时，请对SourceBuffer进行自动清理
            // autoCleanupMinBackwardDuration: 60, //指示进行自动清除时为反向缓冲区保留的持续时间（以秒为单位）。
            stashInitialSize: 128, // 缓存大小(kb)  默认384kb
            autoCleanupSourceBuffer: true // 是否自动清理缓存
          }
        )
      }
      // 存入DOM

      that.flvPlayer.attachMediaElement(videoElement)

      that.flvPlayer.load()
      let controller = this.player._transmuxer._controller
      let wsLoader = controller._ioctl._loader
      let oldWsOnCompleteFunc = wsLoader._onComplete
      wsLoader._onComplete = function () {
        if (!controller._remuxer) {
          controller._remuxer = {
            flushStashedSamples: function () {
              console.log('flushStashedSamples')
            }
          }
        }
        oldWsOnCompleteFunc()
      }

      setTimeout(function () {
        if (that.resVideoUrl !== '' && that.resVideoUrl !== null) {
          that.flvPlayer && that.flvPlayer.play()
        }
      }, 1500)

      that.flvPlayer.on(
        flvjs.Events.ERROR,
        (errorType, errorDetail, errorInfo) => {
          console.log('errorType:', errorType)
          console.log('errorDetail:', errorDetail)
          console.log('errorInfo:', errorInfo)
          // that.errorNum++
          // if (that.flvPlayer) {
          //   that.flvPlayer.pause()
          //   that.flvPlayer.unload()
          //   that.flvPlayer.detachMediaElement()
          //   that.flvPlayer.destroy()
          //   that.flvPlayer = null
          //   if (that.errorNum <= 10) {
          //     that.createVideo()
          //   } else {
          //     // that.$message({
          //     //   type: 'error',
          //     //   message: '不支持h265格式的视频播放,请检查视频的码流格式'
          //     // })
          //   }
          // }
        }
      )
      that.flvPlayer.on('statistics_info', function (res) {
        if (that.lastDecodedFrame === 0) {
          that.lastDecodedFrame = res.decodedFrames
          return
        }
        if (that.lastDecodedFrame !== res.decodedFrames) {
          that.reconnectIng = false
          that.lastDecodedFrame = res.decodedFrames
        } else {
          that.lastDecodedFrame = 0
          if (that.flvPlayer) {
            that.flvPlayer.pause()
            that.flvPlayer.unload()
            that.flvPlayer.detachMediaElement()
            that.flvPlayer.destroy()
            that.flvPlayer = null
            that.createVideo()
          }
        }
      })

      // if (that.timerId !== null) {
      //   clearInterval(that.timerId)
      // }

      that.timerId = setInterval(() => {
        if (!videoElement.buffered || !videoElement.buffered.length) return
        const end = videoElement.buffered.end(0) // 视频结尾时间
        const current = videoElement.currentTime //  视频当前时间
        const diff = end - current // 相差时间
        const diffCritical = 4 // 这里设定了超过4秒以上就进行跳转
        const diffSpeedUp = 2 // 这里设置了超过1秒以上则进行视频加速播放
        const maxPlaybackRate = 4 // 自定义设置允许的最大播放速度
        let playbackRate = 1.0 // 播放速度
        // 延迟过大，通过跳帧的方式更新视频
        if (diff > 10 || diff < 0) {
          that.flvPlayer.currentTime = that.flvPlayer.buffered.end(0) - 1
          return
        }

        // 追帧
        if (diff > 1) {
          videoElement.playbackRate = 1.1
        } else {
          videoElement.playbackRate = 1
        }

        if (diff > diffSpeedUp) {
          videoElement.currentTime = end - 0.2
        }
        if (videoElement.paused) {
        }
      }, 1000)

      // if (that.timerId1 !== null) {
      //   clearInterval(that.timerId1)
      // }
      // that.timerId1 = setInterval(() => {
      //   if (!videoElement.buffered || !videoElement.buffered.length) return
      //   const end1 = videoElement.buffered.end(0) // 视频结尾时间
      //   if (end1 === that.prevEnd) {
      //     that.reconnectCount++
      //     console.info('重连', that.reconnectCount)
      //     if (that.flvPlayer) {
      //       that.flvPlayer.pause()
      //       that.flvPlayer.unload()
      //       that.flvPlayer.detachMediaElement()
      //       that.flvPlayer.destroy()
      //       that.flvPlayer = null
      //       if (that.reconnectCount > 10) {
      //         console.info('重连大于10次，不再重连', that.reconnectCount)
      //         clearTimeout(that.timerId1)
      //         that.timerId1 = null
      //         that.player && that.player.close()
      //         that.$emit('close', that.index)
      //       } else {
      //         that.createVideo()
      //       }
      //     }
      //   }

      //   if (videoElement.paused) {
      //     console.info('重新播放')
      //     that.flvPlayer && that.flvPlayer.play()
      //   }

      //   that.prevEnd = end1
      // }, 10000)
    },
    setsrc() {
      console.info('开始播放')
      this.createVideo()

      if (this.isShowStream) this.getStreamInfo()
    },
    // 关闭视频
    closeVideo() {
      console.info('关闭视频', this.index)
      this.player && this.player.close()
      this.$emit('close', this.index)
    }
  },
  beforeDestroy() {
    const that = this
    if (that.flvPlayer) {
      that.flvPlayer.pause()
      that.flvPlayer.destroy()
      that.flvPlayer.detachMediaElement()
      that.flvPlayer = null
    }
  },
  destroyed() {
    const that = this
    if (that.timerId) {
      clearInterval(that.timerId)
      that.timerId = null
    }
    // if (that.timerId1) {
    //   clearInterval(that.timerId1)
    //   that.timerId = null
    // }
    if (that.flvPlayer) {
      that.flvPlayer.pause()
      that.flvPlayer.destroy()
      that.flvPlayer.detachMediaElement()
      that.flvPlayer = null
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .vsc-controller {
  overflow: hidden;
  display: none;
}
.playtoolDirectionControl {
  z-index: 999999;
}
::v-deep .playtoolDirectionControl > .speed-control {
  margin: 5px auto !important;
}
.video-box-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: #595959;

  .trank {
    width: 100%;
    height: 180px;
    text-align: left;
    // padding: 0 10%;
    overflow: auto;
    position: absolute;
    color: red;
    font-size: 0.75rem;
    bottom: 30px;
    box-sizing: border-box;
  }
  .trankInfo {
    width: 100%;
    padding: 0 10%;
    text-shadow: 1px 1px black;
  }

  .direction-control {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .player-header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 40px;
    display: flex;
    padding: 0 24px;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.8);
    font-size: 14px;
    color: #fff;
    box-sizing: border-box;
    z-index: 1;
    opacity: 0;

    .head-right span {
      margin-right: 8px;
    }

    .el-icon-close {
      cursor: pointer;
    }
  }

  &:hover .player-header {
    opacity: 1;
  }

  &:hover .player-tool {
    opacity: 1;
  }

  .video-mask-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    > * {
      pointer-events: auto;
    }

    .mask-rec {
      position: absolute;
      top: 52px;
      right: 0;
      color: #f00;
      font-size: 14px;

      span {
        text-align: left;
        display: inline-block;
        width: 70px;
        margin-left: 10px;
      }
    }
  }
}

.buttons-box {
  width: 100%;
  height: 28px;
  background-color: rgba(43, 51, 63, 0.7);
  position: absolute;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
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
