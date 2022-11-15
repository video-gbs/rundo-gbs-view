<!--
* @Author: duminquan
* @Date: 2022-03-23 11:16:17
* @LastEditors: duminquan
* @LastEditTime 2022-03-23 11:16:17
* @Description: 文件预览
-->
<template>
  <div id="iframe" v-loading="loading" element-loading-text="加载中……" class="file-view" />
</template>
<script>
import { Base64 } from 'js-base64'
export default {
  name: 'PFileView',
  props: {
    src: {
      type: String,
      default: ''
    },
    fileId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      href: '',
      loading: false
    }
  },
  watch: {
    src(n, o) {
      this.initIframe(n)
    }
  },
  mounted() {
    this.initIframe(this.src)
  },
  methods: {
    initIframe(src) {
      this.loading = true
      const that = this
      const dialog = document.getElementById('iframe')
      dialog.innerHTML = ''
      const iframe = document.createElement('iframe')
      iframe.src = window.config.previewUrl + encodeURIComponent(Base64.encode(src))
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', function() {
          that.loading = false
        })
      } else {
        iframe.onload = function() {
          that.loading = false
        }
      }
      dialog.appendChild(iframe)
    }
  }
}
</script>
<style lang="scss">
    .file-view {
      height: 100%;
      width: 100%;
      iframe {
        height: 100%;
        width: 100%;
      }
    }
</style>
