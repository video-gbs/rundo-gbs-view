<!--评论设置-->
<template>
  <div class="bg-w">
    <div class="p10 bg-w user-panel-action-box f ai-c">
      <div class="title-css mr10">问政信息评论区设置</div>

      <el-tooltip
        class="item"
        content="开启评论区后，所有问政信息均默认允许网友评论"
        placement="right"
      >
        <i class="el-icon-warning blue cursor-p" />
      </el-tooltip>
    </div>

    <div class="p10">
      <el-form :model="params" class="mt10">
        <el-form-item label="评论区">
          <el-switch
            v-model="params.isReview"
            :disabled="btnDisabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="开"
            inactive-text="关"
            @change="setFn"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getReview, setReview } from '@/api/method/system'
export default {
  name: '',
  data() {
    return {
      btnDisabled: false,
      params: {
        isReview: false
      }
    }
  },
  mounted() {
    this.getFn()
  },
  methods: {
    getFn() {
      getReview().then((res) => {
        if (res.code === 10000) {
          Object.assign(this.params, res.data)
        }
      })
    },
    setFn() {
      this.btnDisabled = !this.btnDisabled
      setReview(this.params)
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success('设置成功')
            return
          }
          this.params.isReview = !this.params.isReview
        })
        .catch(() => {
          this.params.isReview = !this.params.isReview
        })
        .finally(() => {
          this.btnDisabled = !this.btnDisabled
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.blue {
  color: #008aff;
}
.user-panel-action-box {
  border-bottom: 1px solid #eee;
}
</style>
