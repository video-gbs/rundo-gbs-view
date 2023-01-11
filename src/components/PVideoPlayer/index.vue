<template>
  <div class="video-player-main">
    <video-player
      ref="videoPlayer"
      class="video-player vjs-custom-skin"
      :playsinline="true"
      :options="playerOptions"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
    />
    <!-- <div class="video-player-footer">
      <template v-for="(item, index) in dataList">
        <button :key="index" class="footer-btn" @click="onPlayer(item)">{{ item.title }}</button>
      </template>
    </div> -->
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

// import 'videojs-flash'
import 'videojs-contrib-hls'
export default {
  name: 'VueVideoPlayer',
  components: {
    videoPlayer
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        // sources: [
        //   {
        //     type: 'application/x-mpegURL', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
        //     src: this.src
        //   }
        // ],
        sources: this.dataList,
        // techOrder: ["flash"],
        controls: true,
        hls: true,
        poster: '', // 你的封面地址
        // width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player // 自定义播放
    }
  },
  methods: {
    onPlayer({ src }) {
      console.log(src)
      this.player.src(src)
    },
    onPlayerPlay(e) {
      console.log(e)
    },
    onPlayerPause(e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>
.video-player-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.video-player {
  width: 100%;
  /* margin-top: 20px; */
}
.video-player-footer {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer-btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.footer-btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
.footer-btn + .footer-btn {
  margin-left: 20px;
}
</style>
