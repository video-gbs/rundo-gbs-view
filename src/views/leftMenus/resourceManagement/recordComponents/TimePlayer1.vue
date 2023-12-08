<template>
  <div class="container">
    <div class="timeLine">
      <TimeLine
        :ref="'Timeline' + setIntervalNum"
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
    clickedPbPause: {
      type: Boolean,
      default: false
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

      this.$emit('handleChangeTime', newVal)
      //&&
      if (
        this.$props.timeLists[newVal] &&
        newVal < this.$props.timeLists.length
      ) {
        console.log('点击的画面有视频~~~~~~~~~~~~~~~~~~~~~~~~')
        if (this.timeAutoPlays[newVal]) {
          this.time2[newVal] = new Date(
            Local.get(`showTime${newVal}`)
          ).getTime()
        }
      } else {
        console.log(
          '点击的画面没有视频!!!!!!!!!!!!!!!!!!!!!',
          this.$props.timeSegments
        )
        this.time2[newVal] = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        // this.time2.forEach((item) => {
        //   item = new Date(new Date().setHours(0, 0, 0, 0))
        // })
      }
      this.$nextTick(() => {
        this.childTimeSegments = this.$props.timeSegments[newVal]
          ? this.$props.timeSegments[newVal]
          : [
              {
                name: '',
                beginTime: 0,
                endTime: 0,
                color: '#4797FF',
                startRatio: 0.65,
                endRatio: 0.9
              }
            ]
        this.$forceUpdate()
      })

      console.log(
        'this.childTimeSegments!!!!!!!!!!!!!!!!!!!!!',
        this.childTimeSegments
      )
    },
    playerTimes(val) {},
    timeSegments(val) {},
    initTimeLists(val) {},
    setIntervalNum(val) {
      // console.log('setIntervalNum,=====', val)
    },
    childTimeSegments(val) {},
    clickedPbPause(val) {
      this.resClickedPbPause = val
    },

    immediate: true,
    deep: true
  },
  created() {},
  mounted() {
    this.resClickedPbPause = this.$props.clickedPbPause
  },
  methods: {
    timeAutoPlay(i) {
      // if (this.resClickedPbPause) {
      //   return
      // }
      this.$emit('handleChangeTime', i)
      this.setIntervalNum = i
      if (this.timeAutoPlays[this.setIntervalNum]) {
        clearInterval(this.timeAutoPlays[this.setIntervalNum])
      }
      this.timeAutoPlays[i] = setInterval(() => {
        this.time2[i] += Local.get('playbackRate') * 1000

        Local.set(
          `showTime${i}`,
          dayjs(this.time2[i]).format('YYYY-MM-DD HH:mm:ss')
        )
        if (
          i === this.$props.playerIdx &&
          this.$props.timeLists[i] &&
          i < this.$props.timeLists.length &&
          this.timeAutoPlays[i]
        )
          this.$emit('handleChangeTime', i)

        // console.log('this.$refs',this.$refs)
        if (this.$refs['Timeline' + i]) {
          this.$refs['Timeline' + i].setTime(this.time2[i])
        } else {
          return
        }
      }, 1000)
    },
    changeTime() {},

    stopTimeAutoPlay(index) {
      console.log('关闭视频进来停止定时器')
      clearInterval(this.timeAutoPlays[index])
      this.timeAutoPlays[index] = null
    },

    changeChildTimeSegments(index) {
      // debugger
      // this.childTimeSegments[0].beginTime = 0

      // this.childTimeSegments[0].endTime = 0
      this.childTimeSegments = this.$props.timeSegments[index]

      // this.childTimeSegments.map((item) => {
      //   item.beginTime = 0
      //   item.endTime = 0
      // })

      this.$forceUpdate()
    },
    // 显示时间段
    timeChange(t) {
      // console.log('显示时间段',this.time2,this.setIntervalNum,t)
      // this.time2[this.setIntervalNum] = t
      // Local.set(
      //   `showTime${this.setIntervalNum}`,
      //   dayjs(this.time2[this.setIntervalNum]).format('YYYY-MM-DD HH:mm:ss')
      // )
    },

    handleControlScope(i) {
      //设置时间轴倍率
      if ((i === 1 && !this.scope.last) || (i === -1 && !this.scope.first)) {
        this.scope = Object.values(SHOW_TIME_SCOPE)[this.scope.index + i]

        this.$nextTick(() => {
          this.$refs['Timeline' + this.setIntervalNum].setZoom(this.scope.value)
        })
      }
    },
    dragTimeChange(time) {
      this.$emit('handleChangeTime', this.$props.playerIdx)

      this.$emit('handleChangePlayTime', time, '拖拽', this.$props.playerIdx)

      // this.$emit('gbPlay')
    },
    changePlayerTimes(val, index) {
      console.log(
        'changePlayerTimes-----------------',
        val,
        index,
        this.childTimeSegments,
        this.$props.timeSegments
      )
      this.$nextTick(() => {
        this.time2[index] = val ? new Date(val[0]).getTime() : 0

        this.childTimeSegments = this.$props.timeSegments[index]

        this.$forceUpdate()
      })
    }

    // spiltChangePlayerTimes(val, index) {
    //   this.$nextTick(() => {
    //     this.time2[index] = val ? new Date(val[0].beginTime).getTime() : 0
    //     this.childTimeSegments = this.$props.timeSegments[index]

    //     this.$forceUpdate()
    //   })
    // }
  },
  destroyed() {
    this.timeAutoPlays.forEach((item) => {
      clearInterval(item)
    })
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
