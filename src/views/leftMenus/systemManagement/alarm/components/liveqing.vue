<template>
  <LivePlayer ref="videoPlayer" :videoUrl="videoUrl" autoplay controls>
  </LivePlayer>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer'
export default {
  name: 'lqPlayer',
  components: {
    LivePlayer
  },
  data() {
    return {}
  },
  props: ['videoUrl', 'error', 'hasaudio'],
  mounted() {
    let paramUrl = decodeURIComponent(this.$route.params.url)
    this.$nextTick(() => {
      // let dom = document.getElementById('webRtcPlayerBox')
      // dom.style.height = (9 / 16) * dom.clientWidth + 'px'
      if (typeof this.videoUrl == 'undefined') {
        this.videoUrl = paramUrl
      }
      console.log('q初始化时的地址为: ' + this.videoUrl)
      // this.play(this.videoUrl)
    })
  },
  watch: {},
  methods: {}
}
</script>

<style></style>
