<template>
  <div class="PlayVideo">
    <video
      id="video"
      ref="video"
      class="video"
      :controls="false"
      loop
      autoplay
      muted
    >
      <source src="movie.mp4" type="video/mp4">
      <source src="movie.ogg" type="video/ogg">
      您的浏览器不支持Video标签。
    </video>
  </div>
</template>

<script>
export default {
  name: 'PlayVideo',
  components: {},
  props: {
    videoUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.$refs.video.src = this.videoUrl
    const video = document.getElementById('video')
    video.play()
  }
}
</script>

<style lang='scss' scoped>
.PlayVideo {
  width: 100%;
  height: 100%;
  position: relative;
  // z-index: 99999;
  // background: rgba(0, 0, 0, 0.5);
  .close {
    position: absolute;
    top: -32px;
    right: -32px;
    z-index: 9999;
  }
  .video {
    width: 100%;
    height: 100%;
    background: #000;
    object-fit: fill;
  }
  .msg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }
}
</style>
