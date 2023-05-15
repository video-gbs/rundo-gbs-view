<template>
  <div class="container">
    <!-- <div class="timeShow">当前时间：{{showTime2}}</div> -->
    <div class="timeLine">
      <TimeLine
        ref="Timeline"
        :initTime="time2"
        @timeChange="timeChange"
        :timeSegments="childTimeSegments"
        @click_window_timeSegments="click_window_timeSegments"
        @dragTimeChange="dragTimeChange"
      ></TimeLine>
    </div>

    <div class="time-scope-control">
      <span
        :class="`icon subtraction-icon ${scope.first ? 'disabled' : ''}`"
        @click="handleControlScope(-1)"
      />
      <span class="text">
        {{ scope.show }}
      </span>
      <span
        :class="`icon plus-icon ${scope.last ? 'disabled' : ''}`"
        @click="handleControlScope(1)"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import { Local } from '@/utils/storage'

// 显示时间范围
const SHOW_TIME_SCOPE = {
  H15: {
    show: '15天',
    name: 'H15t',
    index: 0,
    value: 7,
    first: true
  },
  H3: {
    show: '3天',
    name: 'H15t',
    index: 1,
    value: 6
  },
  H24: {
    show: '24h',
    name: 'H24',
    index: 2,
    value: 5
  },
  H12: {
    show: '12h',
    name: 'H12',
    index: 3,
    value: 4
  },
  H6: {
    show: '6h',
    name: 'H6',
    index: 4,
    value: 3
  },
  H2: {
    show: '2h',
    name: 'H2',
    index: 5,
    value: 2
  },
  H1: {
    show: '1h',
    name: 'H1',
    index: 6,
    value: 1
  },
  H: {
    show: '0.5h',
    name: 'H0.5',
    index: 7,
    value: 0,
    last: true
  }
}

export default {
  data() {
    return {
      scope: SHOW_TIME_SCOPE.H24,
      time2: 0,
      zoom: 5,
      zoomList: [
        '半小时',
        '1小时',
        '2小时',
        '6小时',
        '12小时',
        '1天',
        '3天',
        '15天',
        '30天'
      ].map((item, index) => {
        return {
          label: item,
          value: index
        }
      }),
      childTimeSegments: [],
      timeAutoPlays: ''
    }
  },
  props: {
    playerTimes: {
      type: Array,
      default: function () {
        return []
      }
    },
    playerIdx: {
      type: Number,
      default: 0
    },
    timeSegments: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    playerIdx(newVal) {},
    playerTimes(val) {
      this.time2 = val[0] ? new Date(val[0]).getTime() : 0
      // this.$forceUpdate()
    },
    childTimeSegments(val) {
      // this.$set(this.childTimeSegments, 0, val)
    },
    immediate: true,
    deep: true
  },
  computed: {
    // 显示时间段
    showTime() {
      Local.set('showTime', dayjs(this.time2).format('YYYY-MM-DD HH:mm:ss'))

      return dayjs(this.time2).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created() {
    this.childTimeSegments = [this.$props.timeSegments[this.$props.playerIdx]]
  },
  mounted() {
    // 显示时间段
    this.time2 = this.$props.playerTimes[0]
      ? new Date(this.$props.playerTimes[0]).getTime()
      : 0
  },
  methods: {
    timeAutoPlay() {
      const that = this
      that.timeAutoPlays = setInterval(() => {
        that.time2 += Local.get('playbackRate') * 1000

        Local.set('showTime', dayjs(that.time2).format('YYYY-MM-DD HH:mm:ss'))

        that.$emit('handleChangeTime')

        if (that.time2 >= new Date(this.$props.playerTimes[1]).getTime()) {
          that.stopTimeAutoPlay()
          that.$emit('handleCloseVideo')
        }
        if (that.$refs.Timeline) {
          that.$refs.Timeline.setTime(that.time2)
        } else {
          return
        }
      }, 1000)
    },
    stopTimeAutoPlay() {
      const that = this
      clearInterval(that.timeAutoPlays)
    },
    handleCloseVideoChildTimeSegments() {
      this.childTimeSegments.map((item) => {
        item.beginTime = 0
        item.endTime = 0
      })
    },
    changeChildTimeSegments(index) {
      this.childTimeSegments[0].beginTime = new Date(
        this.$props.timeSegments[index].beginTime
      ).getTime()

      this.childTimeSegments[0].endTime = new Date(
        this.$props.timeSegments[index].endTime
      ).getTime()

      this.$forceUpdate()
    },
    // 显示时间段
    timeChange(t) {
      this.time2 = t
      Local.set('showTime', dayjs(this.time2).format('YYYY-MM-DD HH:mm:ss'))
    },

    handleControlScope(ctrl) {
      //设置时间轴倍率
      if (
        (ctrl === 1 && !this.scope.last) ||
        (ctrl === -1 && !this.scope.first)
      ) {
        this.scope = Object.values(SHOW_TIME_SCOPE)[this.scope.index + ctrl]

        this.$nextTick(() => {
          this.$refs.Timeline.setZoom(this.scope.value)
        })
      }
    },

    click_window_timeSegments(arr) {
      console.log('点击了：' + arr[0].name)
    },
    dragTimeChange(time) {
      this.stopTimeAutoPlay()
      Local.set('showTime', dayjs(time).format('YYYY-MM-DD HH:mm:ss'))
      this.$emit('handleChangeTime', time)
      // this.$emit('changeChannelId', true)

      this.$emit('onChange', time, '拖拽')
      // setTimeout(()=>{

      this.$emit('gbPlay')
      // },3500)
      // this.timeAutoPlay()
    },
    changePlayerTimes(val) {
      // this.time2 = val[0]
      this.childTimeSegments[0].beginTime = 0
      this.childTimeSegments[0].endTime = 0
      this.$nextTick(() => {
        this.childTimeSegments[0].beginTime = val[0]
          ? new Date(val[0]).getTime()
          : ''
        this.childTimeSegments[0].endTime = val[1]
          ? new Date(val[1]).getTime()
          : ''

        this.$forceUpdate()
      })
    }
  },
  destroyed() {
    clearInterval(this.timeAutoPlays)
    Local.set('playbackRate', 1)
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  justify-content: center;
  flex-direction: column;

  .timeLine {
    height: 50px;
  }
}

.timeShow {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  user-select: none;
}
.time-scope-control {
  position: absolute;
  right: 24px;
  bottom: 4px;
  height: 24px;
  display: flex;

  .text {
    text-align: center;
    font-size: 16px;
    width: 56px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 24px;
  }

  .icon {
    flex: none;
    display: inline-block;
    width: 20px;
    height: 20px;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }

  .plus-icon {
    background: url('../../../../assets/imgs/icon_plus.png') center/cover
      no-repeat;
  }
  .subtraction-icon {
    background: url('../../../../assets/imgs/icon_subtraction.png') center/cover
      no-repeat;
  }
}
</style>
