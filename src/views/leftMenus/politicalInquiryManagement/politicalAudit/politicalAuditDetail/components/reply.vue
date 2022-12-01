<template>
  <el-card class="page-box-card">
    <div slot="header" class="clearfix">
      <LineFont
        :line-title="box1"
        :text-style="textStyle"
        :line-blue-style="lineBlueStyle"
      />
    </div>
    <div class="page-box-content p20">
      <el-timeline v-if="replyList.length">
        <el-timeline-item
          v-for="(i, index) in replyList"
          :key="index"
          :hide-timestamp="true"
          :size="i.size"
          :timestamp="i.timestamp"
          placement="top"
        >
          <svg-icon :icon-class="i.myIcon" class="myIcon_svg" />

          <div>
            <slot v-if="index % 2 === 0" name="timestamp">
              <svg-icon icon-class="line1" class="line1_svg" />
            </slot>
            <slot v-else name="timestamp">
              <svg-icon icon-class="line2" class="line2_svg" />
            </slot>
          </div>
          <el-card>
            <h4 class="reviewResults-h4">
              {{ i.content }}
            </h4>
            <p class="reviewResults-p">
              {{ `${i.updateBy} 提交于 ${i.updateTime}` }}
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div v-else class="fs12">暂无记录</div>
    </div>
  </el-card>
</template>

<script>
import LineFont from "@/components/LineFont";

export default {
  data() {
    return {
      box1: {
        title: "官方回复",
        notShowSmallTitle: false,
      },
      replyList: [],
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
  components: {
    LineFont,
  },
  created() {
    this.initMock();
  },
  methods: {
    initMock() {
      this.replyList = [

      ];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>
