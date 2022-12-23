<!--评论信息-->
<template>
  <div>
    <div class="detail-container">
      <div>
        {{ one.title }}
      </div>
      <el-card class="box-card1">
        <div slot="header" class="clearfix f jc-sb ai-c">
          <LineFont
            class="f1"
            :line-title="lineTitle"
            :text-style="textStyle"
            :line-blue-style="lineBlueStyle"
          />
          <div style="max-width: 350px" class="mr10">
            <el-tag effect="plain" class="mr10">
              {{ showStatus(one.auditStatus) }}
            </el-tag>
            <el-tag effect="plain" class="mr10" type="warning">
              {{ one.isShow ? "已隐藏" : "已显示" }}
            </el-tag>
          </div>
        </div>
        <div class="text item">
          <el-form ref="form" label-width="120px">
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
import LineFont from "@/components/LineFont";

export default {
  name: "",
  components: { LineFont },
  props: {
    one: {
      type: Object,
    },
  },
  data() {
    return {
      lineTitle: {
        title: "评论详情",
        notShowSmallTitle: false,
      },
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
    };
  },
  mounted() {},
  methods: {
    showStatus(v) {
      if (v === 2) {
        return "待审核";
      }
      if (v === 3) {
        return "审核未通过";
      }
      return "审核通过";
    },
    getOne() {},
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
