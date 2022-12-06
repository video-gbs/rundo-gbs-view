<template>
  <div class="reviewResults-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <LineFont
          :line-title="lineTitle"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <div class="text item">
        <el-form
          v-if="one"
          ref="form"
          :model="form"
          label-width="90px"
          :label-position="labelPosition"
        >
          <el-form-item label="满意度：">
            <span class="span-text">{{ $dict.appraise[one.result] }}</span>
          </el-form-item>
          <el-form-item label="评价内容">
            <span class="span-text">{{ one.content }}</span>
          </el-form-item>
          <el-form-item label="评价时间：">
            <span class="span-text">{{ one.updateTime }}</span>
          </el-form-item>
        </el-form>
        <div v-else class="fs12">暂无评价</div>
        <!-- <el-empty v-else description="暂无评价" /> -->
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from "@/components/LineFont";
import { getAppraiseByOne } from "@/api/method/appraise";
export default {
  name: "",
  components: {
    LineFont,
  },
  data() {
    return {
      labelPosition: "left",
      textStyle: {
        fontSize: "20px",
        fontFamily: "Microsoft YaHei-Bold, Microsoft YaHei",
        fontWeight: "bold",
        color: "#333333",
      },
      lineBlueStyle: {
        background: "rgba(30, 86, 160, 1)",
        borderRadius: "0px 4px 4px 0px",
      },
      form: {
        content: "",
        content1: "",
      },
      lineTitle: {
        title: "评价信息",
        notShowSmallTitle: false,
      },
      one: null,
    };
  },
  watch: {},
  mounted() {
    // this.$route.params.id && this.getAppraiseBy(this.$route.params.id)
  },
  methods: {
    getAppraiseBy(v) {
      getAppraiseByOne(v).then((res) => {
        if (res.code === 10000) {
          this.one = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 0;
}
::v-deep .el-card__header {
  padding: 0;
}
::v-deep .el-form-item__label {
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #8b8b8b;
}

.reviewResults-container {
  height: 100%;
  .box-card {
    height: 100%;
  }
  .text {
    // margin-left:-2rem;
  }
  .span-text {
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }
}
</style>
