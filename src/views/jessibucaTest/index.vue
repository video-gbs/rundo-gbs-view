<template>
  <div class="app-container">
    <sup-video-player :split="6" ref="supPlayer"> </sup-video-player>
  </div>
</template>

<script>
import SupVideoPlayer from './SupVideoPlayer'

export default {
  components: {
    SupVideoPlayer
  },
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    onClick() {
      //url，就是播放地址 http://192.168.0.1*0:1***0/av/192_168_0_6_8**0/1_0.flv
      //data,是通过点击设备树获取回来的参数，这个具体根据实际开发进行修改。
      this.$refs.supPlayer.play(
        'http://xard-gbs-test.runjian.com:2280/rtp/LIVE_193.live.flv'
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
