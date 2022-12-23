<!--回复逾期设置-->
<template>
  <div class="bg-w">
    <div class="p10 bg-w user-panel-action-box f ai-c">
      <div class="title-css mr10">回复逾期设置</div>
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
              提示：超过处理有效期，即为回复逾期
            </div>
          </div>
        </el-form-item>
        <el-form-item label="即将逾期提醒">
          <el-switch
            v-model="params.overDueWarn"
            :disabled="btnDisabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="开"
            inactive-text="关"
            @change="setFn"
          />
        </el-form-item>
        <el-form-item>
          <div class="f ai-c">
            <div class="mr10">逾期前</div>
            <el-input
              v-model="params.warnBeforeDay"
              type="number"
              max="365"
              min="1"
              style="width: 70px"
              class="mr10"
            />
            <div class="mr10">天,每天</div>
            <el-time-picker
              v-model="params.warnTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:59',
              }"
              value-format="hh:mm"
            />
            <div class="ml10">发送提醒</div>
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
import { getReplyConfig, setReplyConfig } from "@/api/method/system";
export default {
  name: "",
  data() {
    return {
      btnDisabled: false,
      params: {
        overDueWarn: true, //	是否开启提醒
        validPeriod: "", // 有效期
        warnBeforeDay: "", // 预期警告提前天数
        warnTime: "08:00", //	每天提醒的时间
      },
    };
  },
  mounted() {
    this.getFn();
  },
  methods: {
    getFn() {
      getReplyConfig().then((res) => {
        if (res.code === 10000) {
          Object.assign(this.params, res.data);
        }
      });
    },
    setFn() {
      console.log(this.params);

      this.btnDisabled = !this.btnDisabled;
      setReplyConfig(this.params)
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success("设置成功");
            return;
          }
          this.params.isReview = !this.params.isReview;
        })
        .catch(() => {
          this.params.isReview = !this.params.isReview;
        })
        .finally(() => {
          this.btnDisabled = !this.btnDisabled;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.blue {
  color: #008aff;
}
.user-panel-action-box {
  border-bottom: 1px solid #eee;
}
</style>
