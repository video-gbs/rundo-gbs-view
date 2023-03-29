<template>
  <div class="video-box-container">
    <video
      class="video-player"
      autoplay
      :style="stretch ? 'object-fit: fill' : ''"
      :id="idx"
      width="100%"
      height="100%"
    ></video>
  </div>
</template>

<script>
import flvjs from 'flv.js'

const IS_CONTROL_TYPES = [1, 4] //有云台功能的ptztype

export default {
  name: 'jessibuca',
  components: {},
  data() {
    return {
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
      // flvPlayer: null,

      reconnectIng: false, //是否正在重连中

      prevEnd: 0,
      reconnectCount: 0, // 重连次数

      timerId: null,
      loadStatus: true,
      statusMsg: '摄像机未开启，请联系',
      lastDecodedFrame: null,
      isShowStream: false,
      tracks: [],
      resVideoUrl: ''
    }
  },
  props: [
    'videoUrl',
    'error',
    'hasAudio',
    'height',
    'idx',
    'deviceData',
    'index',
    'stretch'
  ],
  created() {
    this.resVideoUrl = this.$props.videoUrl
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  },
  mounted() {
    this.$on('closeAll', () => {
      this.player && this.player.close()
      this.$emit('close', this.index)
    })

    window.onerror = (msg) => {
      // console.error(msg)
    }

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
    }
  },
  computed() {},
  methods: {
    //获取码流信息
    getStreamInfo() {
      console.log(this.deviceData)
      const { mediaServerId, app, stream } = this.deviceData
      if (mediaServerId && app && stream) {
        const that = this
        that.tracks = []
        this.$axios({
          method: 'get',
          url:
            '/zlm/' +
            mediaServerId +
            '/index/api/getMediaInfo?vhost=__defaultVhost__&schema=rtmp&app=' +
            app +
            '&stream=' +
            stream
        }).then(function (res) {
          if (res.data.code == 0 && res.data.online) {
            that.tracks = res.data.tracks
            that.isShowStream = true
          } else {
            that.$message({
              showClose: true,
              message: '获取编码信息失败,',
              type: 'warning'
            })
          }
        })
      } else {
        this.isShowStream = false
        this.$message({
          showClose: true,
          message: '获取编码信息失败,',
          type: 'warning'
        })
      }
    },
    handleShowStream() {
      if (!this.isShowStream) {
        this.getStreamInfo()
      } else {
        this.isShowStream = !this.isShowStream
      }
    },
    handBoxSelection() {
      this.isShowStream = !this.isShowStream
    },
    handleOpenControl() {
      this.showControl = !this.showControl
    },
    createVideo() {
      this.reconnectIng = true
      let that = this
      console.log(that.flvPlayer, that.resVideoUrl, 11111111)
      if (that.flvPlayer) {
        that.flvPlayer.pause()
        that.flvPlayer.destroy()
        that.flvPlayer = null
      }
      if (that.timerId !== null) {
        clearInterval(that.timerId)
      }
      const videoElement = document.getElementById(that.idx)
      if (flvjs.isSupported()) {
        that.flvPlayer = flvjs.createPlayer(
          {
            type: 'flv',
            url: that.resVideoUrl,
            // url:"ws://192.168.0.73:80/rtp/LIVE_23.live.flv",
            isLive: true
          },
          {
            cors: true, // 是否跨域
            // enableWorker: true, // 是否多线程工作
            enableStashBuffer: false, // 是否启用缓存
            stashInitialSize: 128, // 缓存大小(kb)  默认384kb
            autoCleanupSourceBuffer: true // 是否自动清理缓存
          }
        )
      }
      that.flvPlayer.on(
        flvjs.Events.ERROR,
        (errorType, errorDetail, errorInfo) => {
          console.log('errorType:', errorType)
          console.log('errorDetail:', errorDetail)
          console.log('errorInfo:', errorInfo)
          // this.loadStatus=true
          // this.statusMsg="正在重连。。。"
          //视频出错后销毁重新创建
          if (that.flvPlayer) {
            that.flvPlayer.pause()
            that.flvPlayer.unload()
            that.flvPlayer.detachMediaElement()
            that.flvPlayer.destroy()
            that.flvPlayer = null
          }
          that.createVideo()
        }
      )
      that.flvPlayer.on('statistics_info', function (res) {
        if (!that.lastDecodedFrame) {
          that.lastDecodedFrame = res.decodedFrames
          return
        }
        if (that.lastDecodedFrame != res.decodedFrames) {
          that.reconnectIng = false
          that.lastDecodedFrame = res.decodedFrames
        } else {
          // const end = videoElement.buffered.end(0);
          // console.info("进来了-----------", that.lastDecodedFrame, res.decodedFrames, end)
          // this._timeout && clearTimeout(this._timeout);
          // this._timeout = setTimeout(() => {
          //   const endNew = videoElement.buffered.end(0);
          //   if (endNew === end) {
          //     console.info("断线重连--------------")
          //   }
          //   console.info("res.decodedFrames", videoElement.buffered.end(0));
          // }, 5000);
          // that.$nextTick(() => {
          // });
          that.lastDecodedFrame = 0
          // if (that.flvPlayer) {
          //   that.flvPlayer.pause();
          //   that.flvPlayer.unload();
          //   that.flvPlayer.detachMediaElement();
          //   that.flvPlayer.destroy();
          //   that.flvPlayer = null;
          //   that.createVideo();
          // }
        }
      })

      that.flvPlayer.attachMediaElement(videoElement)
      console.info('that.flvPlayer', that.flvPlayer)
      that.flvPlayer.load()
      that.flvPlayer.play()
      if (that.timerId !== null) {
        clearInterval(that.timerId)
      }
      that.timerId = setInterval(() => {
        if (videoElement.buffered.length > 0) {
          const end = videoElement.buffered.end(0) // 视频结尾时间
          const current = videoElement.currentTime //  视频当前时间
          const diff = end - current // 相差时间
          // console.log(diff);
          const diffCritical = 4 // 这里设定了超过4秒以上就进行跳转
          const diffSpeedUp = 2 // 这里设置了超过1秒以上则进行视频加速播放
          const maxPlaybackRate = 4 // 自定义设置允许的最大播放速度
          let playbackRate = 1.0 // 播放速度

          // if (diff > diffCritical) {
          //   console.log("相差超过4秒，进行跳转");
          //   // videoElement.currentTime = end - 1.5;
          //   videoElement.currentTime = end - 0.5;
          //   playbackRate = Math.max(1, Math.min(diffCritical, 16));
          // }
          // else if (diff > diffSpeedUp) {
          //   console.log("相差超过3秒，进行加速");
          //   videoElement.currentTime = end - 0.5;
          //   playbackRate = Math.max(1, Math.min(diff, maxPlaybackRate, 16))
          // }

          if (diff > diffSpeedUp) {
            // console.log("相差超过" + diffSpeedUp + "秒，进行追帧");
            videoElement.currentTime = end - 0.2
            // playbackRate = Math.max(1, Math.min(diff, maxPlaybackRate, 16))
          }

          // videoElement.playbackRate = playbackRate;
          if (videoElement.paused) {
            // console.info("重新播放")
            // that.flvPlayer.play()
          }
        }
      }, 1000)

      if (that.timerId1 !== null) {
        clearInterval(that.timerId1)
      }
      that.timerId1 = setInterval(() => {
        if (this.reconnectCount > 10) {
          console.info('重连大于10次，不再重连')
          clearTimeout(that.timerId1)
          that.timerId1 = null
          return
        }

        if (videoElement.buffered.length > 0) {
          const end = videoElement.buffered.end(0) // 视频结尾时间

          if (end === this.prevEnd) {
            this.reconnectCount++
            console.info('重连', this.reconnectCount)
            if (that.flvPlayer) {
              that.flvPlayer.pause()
              that.flvPlayer.unload()
              that.flvPlayer.detachMediaElement()
              that.flvPlayer.destroy()
              that.flvPlayer = null
              that.createVideo()
            }
          }

          if (videoElement.paused) {
            // console.info("重新播放")
            // that.flvPlayer.play()
          }

          this.prevEnd = end
        }
      }, 10000)
    },
    setsrc() {
      // if(this.url){
      // this.src =this.url;
      console.info('开始播放')
      this.createVideo()

      if (this.isShowStream) this.getStreamInfo()
      // }
    },
    // 关闭视频
    closeVideo() {
      console.info('关闭视频', this.index)
      this.player && this.player.close()
      this.$emit('close', this.index)
      // console.info("this.$parent.playerIdx", this.$parent.$parent.playerIdx);
      // this.$parent.videoUrl[this.$parent.playerIdx] = "";
      // this.$parent.playerIdx = 0;
    }
  },
  destroyed() {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
    if (this.timerId1) {
      clearInterval(this.timerId1)
      this.timerId = null
    }
    if (this.flvPlayer !== null) {
      this.flvPlayer.pause()
      this.flvPlayer.destroy()
      this.flvPlayer = null
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .vsc-controller {
  overflow: hidden;
  display: none;
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
    padding: 0 10%;
    overflow: auto;
    position: absolute;
    color: white;
    font-size: 0.75rem;
    bottom: 40px;
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
