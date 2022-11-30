<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
require('echarts/theme/macarons')
import { fitChartSize } from '../../../../utils/index.js'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null,
      target: ''
    }
  },
  watch: {
    chartData: {
      handler(val) {
        this.$nextTick(() => this.initChart(val))
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart() {
      if (this.chartData === null || this.chartData === undefined) return
      this.chart = this.$echarts.init(this.$el, 'macarons')
      var datas = this.chartData
      this.chart.setOption(
        {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)',
            show: true,
            backgroundColor: '#fff',
            borderColor: 'rgba(0, 151, 251, 1)',
            borderWidth: 1,
            borderRadius: 0,
            textStyle: {
              color: '#BCE9FC',
              fontSize: fitChartSize(16),
              align: 'left'
            },
            formatter: function(params) {
              return (
                params.marker +
                '<span style="color:' +
                params.color +
                '">' +
                params.data['name'] +
                '\n' +
                params.data['value'] +
                '</span>'
              )
            }
          },
          legend: {
            orient: 'vertical',
            icon: 'circle',
            left: '70%',
            top: '40%',
            // itemWidth: 8, // 设置宽度
            // itemHeight: 8, // 设置高度、
            itemGap: 10, // 设置间距
            itemWidth: 8,
            borderWidth: 2,
            borderRadius: 4,
            borderColor: '#ECECEC',
            padding: [15, 10, 15, 5],
            textStyle: {
              rich: {
                a: {
                  color: '#333',
                  fontSize: fitChartSize(12),
                  padding: [0, 10, 0, 0]
                },
                b: {
                  color: '#333',
                  fontSize: fitChartSize(12),
                  padding: [0, 10, 0, 10]
                }
              }
            },
            formatter: function(name) {
              for (var i = 0, l = datas.series.length; i < l; i++) {
                if (datas.series[i].name === name) {
                  this.target = datas.series[i].value
                }
              }
              return `{a| ${name}}`
            }
          },
          title: {
            show: this.chartData.title.isShow,
            text: this.chartData.title.text,
            textAlign: 'center',
            x: this.chartData.title.x,
            y: this.chartData.title.y,
            textStyle: {
              align: 'center',
              fontSize: '16px',
              color: '#333',
              fontWeight: 'bold'
            },
            subtext: this.chartData.title.subtext,
            subtextStyle: {
              align: 'center',
              fontSize: fitChartSize(16),
              height: fitChartSize(30),
              color: '#000000'
            }
          },
          color: this.chartData.color,
          graphic: {
            type: 'text',
            left: '0%',
            top: '10%',
            style: {
              // text: this.chartData.graphic,
              textAlign: 'center',
              fontSize: fitChartSize(16)
            }
          },
          series: [
            {
              name: 'border',
              type: 'pie',
              clockWise: false,
              radius: '75%',
              center: ['35%', '50%'],
              animation: false,
              hoverAnimation: false,
              legendHoverLink: false,
              // 图形是否不影响和触发鼠标事件
              silent: true,
              label: {
                show: false
              },
              labelLine: {
                normal: {
                  length: 10,
                  length2: 20,
                  show: true,
                  lineStyle: {
                    width: 2
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: '#fff',
                  shadowColor: '#E0ECFE',
                  shadowBlur: 15,
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
                }
              },
              data: [0]
            },
            {
              type: 'pie',
              label: {
                show: true,
                rich: {
                  b: {
                    fontSize: 12,
                    fontFamily: 'PingFang SC',
                    fontWeight: 400,
                    color: 'red',
                    // padding:20,
                    verticalAlign: 'top',
                    align: 'right'
                  },
                  d: {
                    fontSize: 14,
                    fontFamily: 'Source Han Sans CN',
                    color: '#E7B943',
                    fontWeight: 400
                  }
                },
                formatter: '{b}{d}%'
              },
              labelLine: {
                normal: {
                  length: 20,
                  length2: 20,
                  lineStyle: {
                    width: 2
                  }
                }
              },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 2,
                emphasis: {
                  color: '#f9b762'
                }
              },

              radius: this.chartData.radius,
              center: this.chartData.center,
              data: this.chartData.series,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        },
        true
      )
    }
  }
}
</script>
