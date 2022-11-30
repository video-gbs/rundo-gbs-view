<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <svg-icon icon-class="pjqktj" class="pjqktj_svg" />
      <span>评价情况统计</span>
    </div>
    <div class="text item">
      <PieEchart :chart-data="chartData" width="100%" height="200px" />
    </div>
  </el-card>
</template>

<script>
import PieEchart from './pieEchart.vue'

export default {
  name: '',
  components: {
    PieEchart
  },
  props: {
    statisticalData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      lineTitle: {
        title: '问政待办',
        notShowSmallTitle: false
      },
      chartData: {
        showLegend: '',
        title: {
          isShow: true,
          x: '34%',
          y: '45%',
          text: '评价统计'
        },
        color: ['#2796FF ', '#FED023', '#A0791E'],
        radius: ['58%', '70%'],
        center: ['35%', '50%'],
        series: [
          {
            name: '满意',
            value: 1
          },
          {
            name: '非常满意',
            value: 2
          },
          {
            name: '不满意',
            value: 9
          }
        ]
      }
    }
  },
  watch: {
    statisticalData(newValue, oldValue) {
      console.log(newValue, oldValue)
      this.$props.statisticalData.map((item) => {
        this.chartData.series.name = item.resultName
        this.chartData.series.value = item.resultCount
      })
    }
  },
  created() {
    this.$props.statisticalData.map((item) => {
      const obj = {
        name: '',
        value: ''
      }
      obj.name = item.resultName
      obj.value = item.resultCount
      this.chartData.series.push(obj)
    })
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 0 16px;
  height: 79px;
}
.box-card {
  width: 100%;
  overflow: hidden;
  position: relative;
  top: 5px;
}
.clearfix {
  height: 80px;
  line-height: 80px;
  span {
    font-size: 20px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }
  .pjqktj_svg {
    width: 1.5rem;
    height: 1.5rem;
    position: relative;
    top: 3px;
    left: -3px;
  }
}
</style>
