<template>
  <div class="EasyPlayer">
    <easy-player
      style="width: 100%;height: 100%;"
      @error="restartPlayer"
      @ended="restartPlayer"
      @play="videoPlay"
      ref="EasyPlayerRef"
      :videoUrl="videoUrl"
      :aspect="aspect"
      :showEnterprise="false"
      :show-custom-button="false"
      :alt="alt"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      fluent
      stretch
    >
    </easy-player>
  </div>
</template>
<script>
  import EasyPlayer from '@easydarwin/easyplayer'
  export default {
    data() {
      return {
        timer: null
      }
    },
    components: { EasyPlayer },
    props: {
      videoUrl: {
        type: String,
        default: ''
      },
      aspect: {
        type: String,
        default: '16:9'
      },
      alt: {
        type: String,
        default: '无信号'
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      loop: {
        type: Boolean,
        default: true
      },
      muted: {
        type: Boolean,
        default: true
      }
    },
    destroyed() {
      if(this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    methods: {
      restartPlayer(e) {
        console.log(e,'播放异常或播放结束或直播断流------->>>>>>>>>')
        this.$refs.EasyPlayerRef.initPlayer()  //初始化播放器
        this.$emit('pullFlow')
        this.timer = setInterval(() => {
          this.$refs.EasyPlayerRef.initPlayer()  //初始化播放器
          this.$emit('pullFlow')
        }, 3000)
      },
      // 播放事件
      videoPlay(a) {
        // console.log(a,'视频播放------>>')
        if(this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
      },
    },
  }
</script>
<style scoped>
.EasyPlayer {
  width: 100%;
  height: 100%;
}
  /* 阻止单击双击视频全屏或者跳转官网 */
  /* /deep/ .vjs-tech {
    pointer-events: none!important;
  } */
  /* /deep/ .video-js.vjs-fullscreen::backdrop,:not(:root):fullscreen::backdrop {
    position: fixed!important;
    top: 0!important;
    left: 0!important;
    width: 50%!important;
    height: 50%!important;
    right: 50%!important;
    bottom: 50%!important;
    background-color: transparent!important;
  }
  /deep/ .video-js.vjs-fullscreen .vjs-tech {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%!important;
    height: 50%!important;
    transform: translateX(-50%)!important;
  }
  /deep/ .video-js {
    background-color: transparent!important;
  } */
</style>
