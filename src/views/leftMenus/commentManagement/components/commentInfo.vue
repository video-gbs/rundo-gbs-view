<!--评论信息-->
<template>
  <div>
    <div class="detail-container">
      <div>
        {{ one.title }}
      </div>
      <el-card class="box-card1">
        <div slot="header" class="clearfix">
          <LineFont
            :line-title="lineTitle2"
            :text-style="textStyle"
            :line-blue-style="lineBlueStyle"
          />
          <div style="max-width: 350px" class="mr10">
            <el-tag effect="plain" class="mr10">
              {{ $dict.status[one.auditStatus] }}
            </el-tag>
            <el-tag effect="plain" class="mr10" type="warning">
              {{ one.isShow ? "已隐藏" : "已显示" }}
            </el-tag>
          </div>
        </div>
        <div class="text item">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="评论内容：">
              <span class="span-text">{{ one.content }}</span>
            </el-form-item>
            <el-form-item label="提交人：">
              <span class="span-text">{{ one.name || "-" }}</span>
            </el-form-item>
            <el-form-item label="提交时间：">
              <span class="span-text">{{ one.createTime || "-" }}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      one: {},
    };
  },
  mounted() {
    if (this.$route.params.id) {
      this.getOne(this.$route.params.id);
    }
  },
  methods: {
    getOne(v) {},
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

.detail-container {
  height: 100%;
  .box-card {
    height: 100%;
  }
  .box-card2 {
    margin: 20px 0;
  }
  .span-text {
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }
}

.annex-css {
  max-width: 100%;
  height: auto;
}
</style>
