<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <svg-icon icon-class="pjqktj" class="pjqktj_svg" />
      <span>评价情况统计</span>
    </div>
    <div class="text item">
      <PieEchart :chartData="chartData" width="100%" height="200px"/>
    </div>
  </el-card>
</template>

<script>
import PieEchart from "./pieEchart.vue";
import LineFont from "@/components/LineFont";

export default {
  name: "",
  components: {
    PieEchart,
    LineFont
  },
   props: {
    statisticalData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      lineTitle: {
        title: "问政待办",
        notShowSmallTitle: false
      },
      chartData: {
        showLegend: "",
        title: {
          isShow: true,
          x: '34%',
          y: '45%',
          text: "评价统计",
        },
        color: ['#2796FF ','#FED023','#A0791E'],
        radius: ['58%', '70%'],
        center: ['35%', '50%'],
        series: [
          { value: 70, name: "非常满意" },
          { value: 20, name: "满意" },
          { value: 10, name: "不满意" }
        ]
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.notice-box {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.clearfix {
  height: 80px;
  line-height: 80px;
  .pjqktj_svg {
    width: 1.5rem;
    height: 1.5rem;
    position: relative;
    top: 3px;
    left: -3px;
  }
}
</style>
