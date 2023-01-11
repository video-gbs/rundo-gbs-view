<!--满意度设置-->
<template>
  <div class="bg-w">
    <div class="p10 bg-w user-panel-action-box f ai-c">
      <div class="title-css mr10">满意度设置</div>
    </div>

    <div class="p20">
      <el-form :model="params" class="mt10">
        <el-form-item label="处理有效期">
          <div class="f ai-c">
            <el-input
              v-model="params.validPeriod"
              type="number"
              max="365"
              min="1"
              style="width: 100px"
              class="mr10"
            />
            <div>天</div>
            <div class="title-c-3 ml20 fs14">
              提示：超过处理有效期，满意度自动选择为 “ 非常满意 ”
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          v-loading="btnDisabled"
          type="primary"
          size="small"
          @click="setFn"
          >设置</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { getSatisfication, setSatisfication } from '@/api/method/system'
export default {
  name: '',
  data() {
    return {
      btnDisabled: false,
      params: {
        validPeriod: '' // 有效期
      }
    }
  },
  mounted() {
    this.getFn()
  },
  methods: {
    getFn() {
      getSatisfication().then((res) => {
        if (res.code === 10000) {
          Object.assign(this.params, res.data)
        }
      })
    },
    setFn() {
      console.log(this.params)

      this.btnDisabled = !this.btnDisabled
      setSatisfication(this.params)
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
