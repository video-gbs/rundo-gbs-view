<template>
  <div class="container">
    <div class="timeLine">
      <TimeLine
        ref="Timeline"
        :initTime="time2[setIntervalNum]"
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
      time2: [],
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
      timeAutoPlays: null,
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
  computed: {},
  watch: {
    playerIdx(newVal) {
      this.setIntervalNum = newVal

      console.log('playerIdx===========', newVal, this.timeAutoPlays)
      //
      if (
        this.$props.timeLists[newVal] &&
        newVal < this.$props.timeLists.length &&
        this.timeAutoPlays
      ) {
        console.log('点击的画面有视频')
        this.time2[newVal] = new Date(Local.get(`showTime${newVal}`)).getTime()
        // this.$set(
        //   this.time2,
        //   newVal,
        //   new Date(Local.get(`showTime${newVal}`)).getTime()
        // )
      } else {
        console.log('点击的画面没有视频')
        // this.time2.map((item) => {
        this.time2 = 0
        // })
        // this.$set(this.time2, newVal, 0)

        this.$emit('handleChangeTime', newVal)
      }
      this.$nextTick(() => {
        this.childTimeSegments[0].beginTime = this.$props.timeSegments[newVal]
          ? new Date(this.$props.timeSegments[newVal].beginTime).getTime()
          : 0
        this.childTimeSegments[0].endTime = this.$props.timeSegments[newVal]
          ? new Date(this.$props.timeSegments[newVal].endTime).getTime()
          : 0
        this.$forceUpdate()
      })
      // console.log()
    },
    playerTimes(val) {},
    timeSegments(val) {
      console.log('timeSegments==========', val)
      this.childTimeSegments = [
        {
          name: '',
          beginTime: 0,
          endTime: 0,
          color: '#4797FF',
          startRatio: 0.65,
          endRatio: 0.9
        }
      ]
    },
    initTimeLists(val) {},
    setIntervalNum(val) {
      console.log('setIntervalNum,=====', val)
    },
    childTimeSegments(val) {},
    time2(val) {
      console.log('time2,', val)
    },

    immediate: true,
    deep: true
  },
  created() {},
  mounted() {},
  methods: {
    timeAutoPlay(i) {
      this.setIntervalNum = i
      if (this.timeAutoPlays) {
        return
      }
      this.timeAutoPlays = setInterval(() => {
        this.$props.timeSegments.forEach((item, index) => {
          if (
            item.beginTime &&
            item.beginTime !== 0 &&
            item.beginTime.length > 0
          ) {
            this.time2[index] += Local.get('playbackRate') * 1000

            Local.set(
              `showTime${index}`,
              dayjs(this.time2[index]).format('YYYY-MM-DD HH:mm:ss')
            )
            this.$emit('handleChangeTime', i)

            // if (
            //   this.time2[index] >=
            //   new Date(this.$props.timeLists[index][1]).getTime()
            // ) {
            //   this.stopTimeAutoPlay(index)
            //   this.$emit('handleCloseVideo', index)
            // }
            if (this.$refs.Timeline) {
              this.$refs.Timeline.setTime(this.time2[index])
            } else {
              return
            }
          }
        })
      }, 1000)

      console.log('i==================================', i, this.timeAutoPlays)
    },
    changeTime() {},
    stopTimeAutoPlay(index) {
      console.log('关闭视频进来停止定时器')
      clearInterval(this.timeAutoPlays)
      this.timeAutoPlays = null
    },

    changeChildTimeSegments() {
      this.childTimeSegments[0].beginTime = 0

      this.childTimeSegments[0].endTime = 0

      console.log('this.childTimeSegments---------', this.childTimeSegments)

      this.$forceUpdate()
    },
    // 显示时间段
    timeChange(t) {
      this.time2[this.setIntervalNum] = t
      Local.set(
        `showTime${this.setIntervalNum}`,
        dayjs(this.time2[this.setIntervalNum]).format('YYYY-MM-DD HH:mm:ss')
      )
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
        this.time2[index] = val ? new Date(val[0]).getTime() : 0
        this.childTimeSegments[0].beginTime = new Date(
          this.$props.timeSegments[index].beginTime
        ).getTime()
        this.childTimeSegments[0].endTime = new Date(
          this.$props.timeSegments[index].endTime
        ).getTime()

        this.$forceUpdate()
      })
    },

    spiltChangePlayerTimes(val, index) {
      this.$nextTick(() => {
        this.time2[index] = val ? new Date(val[0].beginTime).getTime() : 0
        this.childTimeSegments[0].beginTime = new Date(
          this.$props.timeSegments[index].beginTime
        ).getTime()
        this.childTimeSegments[0].endTime = new Date(
          this.$props.timeSegments[index].endTime
        ).getTime()

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
