<template>
  <div>
    <el-dialog
      title="操作指南"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      v-dialogDrag
      modal="false"
    >
      <video width="100%" controls autoplay>
        <source src="操作指南.mp4" type="video/mp4" />
      </video>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    showModal() {
      this.isShow = true
    },
    close() {
      this.isShow = false
    }
  }
}
</script>
<style scoped>
video:focus {
  outline: none;
}
</style>
