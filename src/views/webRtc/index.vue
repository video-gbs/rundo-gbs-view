<template>
  <div class="video-play">
    <WebrtcPlayer
      v-if="videoUrl"
      :videoSrc="videoUrl"
      videoId="WebrtcPlayer"
      class="video-window"
      ref="videoWindow"
    ></WebrtcPlayer>
  </div>
</template>

<script>
import WebrtcPlayer from './webRtcPlayer.vue'

export default {
  components: {
    WebrtcPlayer
  },
  data() {
    return {
      videoUrl:
        'https://xard-gbs-test.runjian.com:2280/index/api/webrtc?app=rtp&stream=LIVE_193&type=play'
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
