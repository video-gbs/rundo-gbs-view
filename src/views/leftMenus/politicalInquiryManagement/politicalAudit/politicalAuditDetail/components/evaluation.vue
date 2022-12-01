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
      <PControlGroup :data="controlData" v-if="controlData" />
    </div>
  </el-card>
</template>

<script>
import LineFont from "@/components/LineFont";
import PControlGroup from "@/components/PControlGroup";


export default {
  data() {
    return {
      box1: {
        title: "评价信息",
        notShowSmallTitle: false,
      },
      controlData: null,
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
    PControlGroup
  },
  created() {
    this.initControl();
  },
  methods: {
    initControl() {
      this.controlData = {
        controls: [
          {
            label: '满意度',
            type: 'text',
            key: 'text1',
            span: 24,
            value: '非常满意',
          }, {
            label: '评价时间',
            type: 'text',
            key: 'text2',
            span: 24,
            value: ' 2022-06-30 12:00:56'
          }
        ],
        layoutConfig: {
          hideButton: true,
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
