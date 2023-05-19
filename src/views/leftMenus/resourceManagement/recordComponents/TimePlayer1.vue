<template>
  <div class="container">
    <div class="timeLine">
      <TimeLine
        ref="Timeline"
        :initTime="time2"
        @timeChange="timeChange"
        :timeSegments="childTimeSegments"
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
      resTime2: [],
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
      childTimeSegments: [
        {
          name: '',
          beginTime: 0,
          endTime: 0,
          color: '#4797FF',
          startRatio: 0.65,
          endRatio: 0.9
        }
      ],
      timeAutoPlays: [],
      setIntervalNum: 0
    }
  },
  props: {
    playerTimes: {
      type: Array,
      default: function () {
        return []
      }
    },
    timeLists: {
      type: Array,
      default: function () {
        return []
      }
    },
    initTimeLists: {
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
    playerIdx(newVal) {
      console.log('playerIdx===========', newVal, this.$props.timeSegments)
      // if (
      //   this.$props.timeLists[newVal] &&
      //   newVal < this.$props.timeLists.length
      // ) {
      //   console.log('进来')
      //   // this.changePlayerTimes(this.$props.timeLists[newVal], newVal)
      //   // this.time2[newVal] = new Date(Local.get(`showTime${newVal}`)).getTime()
      // } else {
      //   console.log(
      //     'this.childTimeSegments---------------------',
      //     this.childTimeSegments,
      //     this.$props.timeSegments
      //   )
      // }

      this.childTimeSegments[0].beginTime = this.$props.timeSegments[newVal]
        ? new Date(this.$props.timeSegments[newVal].beginTime).getTime()
        : 0
      this.childTimeSegments[0].endTime = this.$props.timeSegments[newVal]
        ? new Date(this.$props.timeSegments[newVal].endTime).getTime()
        : 0

      console.log('this.resTime2', this.resTime2)

      // this.time2 = this.resTime2[newVal]
    },
    playerTimes(val) {},
    timeSegments(val) {
      this.resTime2 = []
      val.map((item, index) => {
        this.resTime2[index] = item.beginTime
      })
    },
    initTimeLists(val) {},
    childTimeSegments(val) {},
    time2(val) {
      // console.log('time2,', val)
    },

    immediate: true,
    deep: true
  },
  created() {},
  mounted() {},
  methods: {
    changeTime2(val, index) {
      console.log(val, index)
      this.time2 = val
    },
    timeAutoPlay(i) {
      this.setIntervalNum = i
      this.timeAutoPlays[i] = setInterval(this.changeTime, 1000)
    },
    changeTime() {
      this.time2 += Local.get('playbackRate') * 1000

      // console.log('this.time2~~~~~~~~~~~', this.time2)

      // Local.set(
      //   `showTime${this.setIntervalNum}`,
      //   dayjs(this.time2).format('YYYY-MM-DD HH:mm:ss')
      // )

      this.$emit('handleChangeTime', this.setIntervalNum)

      if (
        this.time2 >=
        new Date(this.$props.timeLists[this.setIntervalNum][1]).getTime()
      ) {
        // this.stopTimeAutoPlay(this.setIntervalNum)
        this.$emit('handleCloseVideo', this.setIntervalNum)
      }
      if (this.$refs.Timeline) {
        this.$refs.Timeline.setTime(this.time2)
      } else {
        return
      }
    },
    closeChangeTime(i) {
      this.time2 = 0
      // Local.set(`showTime${i}`, dayjs(this.time2).format('YYYY-MM-DD HH:mm:ss'))
    },
    stopTimeAutoPlay(index) {
      console.log('关闭视频进来停止定时器')
      clearInterval(this.timeAutoPlays[index])
      this.timeAutoPlays[index] = null
    },
    changeChildTimeSegments(index) {
      this.childTimeSegments[index].beginTime = 0

      this.childTimeSegments[index].endTime = 0

      console.log('this.childTimeSegments---------', this.childTimeSegments)

      this.$forceUpdate()
    },
    // 显示时间段
    timeChange(t) {
      // this.time2 = t
      // Local.set('showTime', dayjs(this.time2).format('YYYY-MM-DD HH:mm:ss'))
    },

    handleControlScope(i) {
      //设置时间轴倍率
      if ((i === 1 && !this.scope.last) || (i === -1 && !this.scope.first)) {
        this.scope = Object.values(SHOW_TIME_SCOPE)[this.scope.index + i]

        this.$nextTick(() => {
          this.$refs.Timeline.setZoom(this.scope.value)
        })
      }
    },
    dragTimeChange(time) {
      this.stopTimeAutoPlay()
      Local.set('showTime', dayjs(time).format('YYYY-MM-DD HH:mm:ss'))
      this.$emit('handleChangeTime', this.$props.playerIdx)

      this.$emit('onChange', time, '拖拽')

      this.$emit('gbPlay')
    },
    changePlayerTimes(val, index) {
      console.log(
        'changePlayerTimes-----------------',
        val,
        index,
        this.childTimeSegments
      )
      this.$nextTick(() => {
        this.time2 = val ? new Date(val[0]).getTime() : 0
        this.childTimeSegments[0].beginTime = new Date(val[0]).getTime()
        this.childTimeSegments[0].endTime = new Date(val[1]).getTime()

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
