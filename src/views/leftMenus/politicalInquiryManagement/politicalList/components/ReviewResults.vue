<template>
  <div class="reviewResults-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <LineFont :lineTitle="lineTitle" :testStyle="testStyle" />
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-width="90px" :label-position="labelPosition">
          <el-form-item label="满意度：">
            <span class="span-text"
              >非常满意</span
            >
          </el-form-item>
          <el-form-item label="评价时间：">
            <span class="span-text">2022-06-30 12:00:56</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from "@/components/LineFont";
export default {
  name: "",
  components: {
    LineFont
  },
  data() {
    return {
      labelPosition: 'left',
      testStyle: {
        fontSize: "20px",
        fontFamily: "Microsoft YaHei-Bold, Microsoft YaHei",
        fontWeight: "bold",
        color: "#333333"
      },
      form: {
        content: "",
        content1: ""
      },
      lineTitle: {
        title: "评价信息",
        notShowSmallTitle: false
      }
    };
  },
  watch: {},
  mounted() {},
  methods: {}
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
  .text{
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
