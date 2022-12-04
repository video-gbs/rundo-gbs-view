<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :center="center"
    class="p-dialog"
    :show-close="false"
    :close-on-click-modal="closeOnClickModal"
    append-to-body
    @open="open"
    @opened="opened"
  >
    <div slot="title" class="dialog-title">
      <span class="title">{{ title }}</span>
      <svg-icon icon-class="close" class="pointer" @click="cancel()" />
    </div>
    <div>
      <slot name="main" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ cancelName }}</el-button>
      <el-button :loading="submitLoading" type="theme" @click="submit">{{ submitName }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'PDialog',
  props: {
    title: {
      type: String,
      default: '提示'
    },
    width: {
      type: [Number, String],
      default: '40%'
    },
    center: {
      type: Boolean,
      default: true
    },
    submitName: {
      type: String,
      default: '确定'
    },
    cancelName: {
      type: String,
      default: '取消'
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      submitLoading: false
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.hideLoading()
      this.visible = false
    },
    submit() {
      this.$emit('submit')
    },
    cancel() {
      this.$emit('cancel')
      this.hide()
    },
    open() {
      this.$emit('open')
    },
    opened() {
      this.$emit('opened')
    },
    showLoading() {
      this.submitLoading = true
    },
    hideLoading() {
      this.submitLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.p-dialog {
  ::v-deep .el-dialog {
    border-radius: 4px;
    .el-dialog__header {
      background: $theme;
      color: #fff;
      padding: 0.625rem 1.25rem;
      font-size: 20px;
      border-radius: 4px 4px 0 0;
      .dialog-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
