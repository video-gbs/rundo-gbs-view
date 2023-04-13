<template>
  <div
    class="time-player-layout"
    ref="timePlayer"
    @mousedown="handleMouseDown($event)"
  >
    <!--    刻度-->
    <div class="time-grid-list" :style="`transform:translateX(${moveX}px)`">
      <!--      填充轴-->
      <div v-if="grid.length <= 12">
        <div
          class="time-grid"
          v-for="(item, idx) in grid"
          :key="`idx1-${idx}`"
          :style="`background: ${isCurrentDate ? 'rgba(255,255,255,0.3)' : ''}`"
        >
          <div class="time">
            {{ item }}
          </div>
        </div>
      </div>
      <div
        :style="`background: ${isCurrentDate ? 'rgba(255,255,255,0.3)' : ''} ${
          isCurrentDate
            ? ''
            : 'url(' +
              playableTimeImges[
                toMoment(value).subtract(1, 'days').format('YYYY-MM-DD')
              ] +
              ')'
        } 0px 38px/100% 24px no-repeat; image-rendering: pixelated;`"
      >
        <div class="time-grid" v-for="(item, idx) in grid" :key="`idx2-${idx}`">
          <div class="time">
            {{ item }}
          </div>
        </div>
      </div>
      <div
        ref="middleTimeGrid"
        class="middle-time-grid-layout"
        :style="`background: url(${
          playableTimeImges[value.format('YYYY-MM-DD')]
        })   0px 38px/100% 24px no-repeat; image-rendering: pixelated;`"
      >
        <div :key="`idx3-${idx}`" class="time-grid" v-for="(item, idx) in grid">
          <div class="time">
            {{ item }}
          </div>
        </div>
      </div>
      <div
        :style="`background: ${isCurrentDate ? 'rgba(255,255,255,0.3)' : ''} ${
          isCurrentDate
            ? ''
            : 'url(' +
              playableTimeImges[
                toMoment(value).add(1, 'days').format('YYYY-MM-DD')
              ] +
              ')'
        } 0px 38px/100% 24px no-repeat; image-rendering: pixelated;`"
      >
        <div :key="`idx5-${idx}`" class="time-grid" v-for="(item, idx) in grid">
          <div class="time">
            {{ item }}
          </div>
        </div>
      </div>
      <!--      填充轴-->
      <div v-if="grid.length <= 12">
        <div
          :key="`idx6-${idx}`"
          class="time-grid"
          v-for="(item, idx) in grid"
          :style="`background: ${isCurrentDate ? 'rgba(255,255,255,0.3)' : ''}`"
        >
          <div class="time">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <!--    当前时刻位-->
    <div class="current-time">
      <div class="current-line" />
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
import moment from 'moment'

// 显示时间范围
const SHOW_TIME_SCOPE = {
  H24: {
    show: '24h',
    splitScope: 7200, //对24小时切割的范围 2h * 60 * 60
    name: 'H24',
    index: 0,
    first: true
  },
  H12: {
    show: '12h',
    splitScope: 3600,
    name: 'H12',
    index: 1
  },
  H6: {
    show: '6h',
    splitScope: 1800,
    name: 'H12',
    index: 2
  },
  H2: {
    show: '2h',
    splitScope: 600,
    name: 'H2',
    index: 3,
    last: true
  }
}
//一天秒数 24*60 *60 * 60
const ONE_DAY_SECONDS = 86400
//一天毫秒数 24*60 *60 * 60 * 1000
const ONE_DAY_MS = 86400000
// 1小时
const HOURS = 24
// 1小时多少秒 60*60
const ONE_HOURS_SECONDS = 3600
//缓动动画时长
const ANIMATION_DURATION = 20
//可播放段（蓝条）分辨 轴最大宽度
const LAYOUT_WIDTH = 13824
// 最大滚动距离像素
const MAX_MOVE = 50

//生成时间轴每一格时间
function generatorGridList(splitScope) {
  if (!splitScope) return []
  let count = ONE_DAY_SECONDS / splitScope - 1
  //每一段代表小时数
  const hours = splitScope / ONE_HOURS_SECONDS
  //每一段代表小分钟
  const minutes = splitScope / 60

  const list = []
  do {
    list.push(
      `${String.prototype.padStart.call(
        Number.parseInt(hours * list.length),
        2,
        '0'
      )}:${String.prototype.padStart.call(
        (minutes * list.length) % 60,
        2,
        '0'
      )}`
    )
  } while (count--)
  console.log('list', list)
  return list
}

export default {
  name: 'TimePlayer',
  props: {
    value: {
      //moment对象
      type: moment,
      default: moment(),
      required: true
    },
    onChange: {
      //时间变化 (currentMomentDate, isDragEnd, record) =>{} 为了节省性能，isDragEnd为false时不会传递当前的record
      type: Function,
      default: Function.prototype
    },
    onChangeDate: {
      //日期变化 (currentMomentDate, preMomentDate, nextMomentDate) =>{}
      type: Function,
      default: Function.prototype
    },
    dataSource: {
      //视频数据列表
      type: Object,
      default: {}
    },
    isCurrentDate: {
      //是否只能在当天内滚动
      type: Boolean,
      default: false
    },
    delay: {
      type: Number, //change事件延迟
      default: 200
    },
    ignoreInterval: {
      type: Number, //蓝条忽略间隔时长
      default: 1000
    },
    onMouseDown: {
      type: Function,
      default: Function.prototype
    },
    onMouseUp: {
      type: Function,
      default: Function.prototype
    }
  },
  data() {
    return {
      scope: SHOW_TIME_SCOPE.H24,
      moveX: 0, //移动位置
      lastMoveX: 0, //最后一次移动的距离
      lastUpdateTime: this.value, //todo 临时解决方案 vm --> mv
      playableTimeImges: {},
      isDragging: false,
      isChangeFlag: false
    }
  },
  mounted() {
    window.addEventListener('resize', this.setLayoutWidth)
    this.$nextTick(() => {
      this.setMoveXByTime()
      this.computePlayableTimeList()
    })
  },
  methods: {
    toMoment(date) {
      return moment(date)
    },
    handleControlScope(ctrl) {
      //设置时间轴倍率
      if (
        (ctrl === 1 && !this.scope.last) ||
        (ctrl === -1 && !this.scope.first)
      ) {
        this.scope = Object.values(SHOW_TIME_SCOPE)[this.scope.index + ctrl]
        this.$nextTick(() => {
          this.setMoveXByTime()
          // this.computePlayableTimeList();
        })
      }
    },
    setLayoutWidth() {
      //监听窗口大小变化，设置时间轴
      this.setMoveXByTime()
    },
    //z计算可播放的时间段（蓝条）样式,（通过canvas画出播放时间段，然后贴到播放条上让它自动拉伸）
    computePlayableTimeList() {
      const curDate = moment(this.value).startOf('days')
      const preDate = moment(curDate).subtract(1, 'days')
      const nextDate = moment(curDate).add(1, 'days')

      console.log('curDate~~~~~~~', curDate, this.value)
      console.log('preDate~~~~~~~', preDate)
      console.log('nextDate~~~~~~~', nextDate)

      const [preCanvas, curCanvas, nextCanvas] = Array(3)
        .fill(true)
        .map(function () {
          let canvas = document.createElement('canvas')
          canvas.width = LAYOUT_WIDTH
          canvas.height = 24
          let ctx = canvas.getContext('2d')
          ctx.fillStyle = '#1890FF'
          return { canvas, ctx }
        })

      const objList = [
        {
          canvas: preCanvas,
          date: preDate,
          dateStr: preDate.format('YYYY-MM-DD')
        },
        {
          canvas: curCanvas,
          date: curDate,
          dateStr: curDate.format('YYYY-MM-DD')
        },
        {
          canvas: nextCanvas,
          date: nextDate,
          dateStr: nextDate.format('YYYY-MM-DD')
        }
      ]
      objList.forEach(({ canvas, date, dateStr }) => {
        if (
          !this.playableTimeImges[dateStr] &&
          this.dataSource[dateStr] &&
          this.dataSource[dateStr].length
        ) {
          this.dataSource[dateStr].forEach((item) => {
            const startDiff = -date.diff(item.startTime)
            const startAndEndDiff = moment(item.endTime).diff(item.startTime)
            const start = this.getPosition(startDiff)
            const width = this.getPosition(startAndEndDiff)

            canvas.ctx.fillRect(start, 0, Math.ceil(width), 24)
          })
          this.playableTimeImges = {
            ...this.playableTimeImges,
            [dateStr]: canvas.canvas.toDataURL('image/png')
          }
        }
      })
    },
    handleOnChange: (function () {
      //时间轴被拖动事件
      let timer
      return function (curTime) {
        this.isDragging = true
        this.onChange(moment(curTime), false)
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          this.isDragging = false
          this.$nextTick(() => {
            this.onChange(moment(curTime), true, this.currentRecord)
            if (this.isChangeFlag) this.handleOnChangeDate(curTime)
          })
        }, this.delay)
      }
    })(),
    handleOnChangeDate: (function () {
      //日期变化事件
      let timer
      return function (curTime) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          if (this.isDragging) {
            this.isChangeFlag = true
            return
          }
          this.isChangeFlag = false
          const curMomentTime = moment(curTime)
          this.onChangeDate(
            moment(curTime),
            moment(curMomentTime).startOf('days').subtract(1, 'days'),
            curMomentTime.add(1, 'days').endOf('days')
          )
        }, this.delay)
      }
    })(),
    handleMouseDown(e) {
      this.onMouseDown(e)
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
      this.lastMoveX = 0
    },
    handleMouseUp(e) {
      this.onMouseUp(e)
      document.removeEventListener('mouseup', this.handleMouseUp)
      document.removeEventListener('mousemove', this.handleMouseMove)
      this.postMoveAnimation()
    },
    handleMouseMove(e) {
      this.setMoveX(this.moveX + e.movementX)
      this.lastMoveX =
        e.movementX > MAX_MOVE
          ? MAX_MOVE
          : e.movementX < -MAX_MOVE
          ? -MAX_MOVE
          : e.movementX
    },
    postMoveAnimation() {
      //移动后的缓动动画
      if (Math.abs(this.lastMoveX) > 1) {
        this.setMoveX(this.moveX + this.lastMoveX)
        setTimeout(() => {
          this.lastMoveX > 0 ? --this.lastMoveX : ++this.lastMoveX
          this.postMoveAnimation()
        }, ANIMATION_DURATION)
      }
    },
    setMoveX(moveX) {
      //设置轴偏移距离，实现无限滚动
      const middleOffsetLeft = this.$refs.middleTimeGrid.offsetLeft
      const gridOffsetWidth = this.$refs.middleTimeGrid.offsetWidth
      let changeDate = 0
      //刻度距离边上的距离
      const halfLayoutWidth = this.$refs.timePlayer.offsetWidth / 2
      if (this.isCurrentDate) {
        //只能在当前时间内滚动
        if (moveX > halfLayoutWidth - middleOffsetLeft) {
          //轴往右边走，并超出, 日期-1
          moveX = halfLayoutWidth - middleOffsetLeft
          this.lastMoveX = 0
        } else if (
          moveX <
          halfLayoutWidth - middleOffsetLeft - gridOffsetWidth + 1
        ) {
          //轴往左边走。并超出,日期+1
          moveX = halfLayoutWidth - middleOffsetLeft - gridOffsetWidth + 1
          this.lastMoveX = 0
        }
      } else {
        //可以滚动到下一天
        if (moveX > halfLayoutWidth - middleOffsetLeft) {
          //轴往右边走，并超出, 日期-1
          moveX -= gridOffsetWidth
          changeDate = -1
        } else if (
          moveX <
          halfLayoutWidth - middleOffsetLeft - gridOffsetWidth + 1
        ) {
          //轴往左边走。并超出,日期+1
          moveX += gridOffsetWidth
          changeDate = 1
        }
      }
      this.moveX = moveX
      const curTime = this.getTimeByMoveX(changeDate)

      this.handleOnChange(curTime)
      if (changeDate) {
        this.handleOnChangeDate(curTime)
      }
    },
    setMoveXByTime(date = this.value) {
      //根据时间设置轴位移距离
      if (!this.$refs.middleTimeGrid) return
      const middleOffsetLeft = this.$refs.middleTimeGrid.offsetLeft
      const gridOffsetWidth = this.$refs.middleTimeGrid.offsetWidth
      //刻度距离边上的距离
      const halfLayoutWidth = this.$refs.timePlayer.offsetWidth / 2
      const momentDate = moment(date)
      const dateTime = momentDate.diff(
        momentDate.format('YYYY-MM-DD') + ' 00:00:00'
      )
      this.moveX =
        -middleOffsetLeft +
        halfLayoutWidth -
        (gridOffsetWidth * dateTime) / ONE_DAY_MS
    },
    getTimeByMoveX(changeDate) {
      //根据位置获取时间
      const middleOffsetLeft = this.$refs.middleTimeGrid.offsetLeft
      const gridOffsetWidth = this.$refs.middleTimeGrid.offsetWidth
      //刻度距离边上的距离
      const halfLayoutWidth = this.$refs.timePlayer.offsetWidth / 2
      const curTimeX = this.moveX + middleOffsetLeft - halfLayoutWidth
      const curDate = moment(this.value).startOf('days')
      changeDate && curDate.add(changeDate, 'days')
      curDate.add(Math.abs((curTimeX * ONE_DAY_MS) / gridOffsetWidth), 'ms')
      this.$emit('input', curDate)
      this.lastUpdateTime = curDate
      return moment(curDate)
    },

    getPosition(diffTimeStamp) {
      //计算时间点定位位置
      return (diffTimeStamp * LAYOUT_WIDTH) / ONE_DAY_MS
    }
  },
  destroyed() {
    document.removeEventListener('resize', this.setLayoutWidth)
  },
  computed: {
    grid() {
      return generatorGridList(this.scope && this.scope.splitScope)
    },
    currentRecord() {
      //根据当前的时间获取当前播发的视频记录数据
      const date = this.value.format('YYYY-MM-DD')
      if (this.value && this.dataSource[date] && this.dataSource[date].length) {
        return this.dataSource[date].find((item) =>
          this.value.isBetween(item.startTime, item.endTime, null, '[]')
        )
      }
      return undefined
    }
  },
  watch: {
    dataSource: {
      deep: true,
      handler(newval) {
        this.computePlayableTimeList()
      }
    },
    //todo 应该通过数据驱动视图定位
    value: (function () {
      let timer
      return function (newValue, oldValue) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          this.$nextTick(() => {
            if (this.lastUpdateTime != this.value) {
              this.lastUpdateTime = this.value
              this.setMoveXByTime()
            }
          })
        }, 100)
      }
    })()
  }
}
</script>

<style lang="scss" scoped>
.time-player-layout {
  height: 64px;
  position: relative;
  user-select: none;
  overflow: hidden;

  .time-grid-list {
    position: relative;
    white-space: nowrap;
    height: 100%;
    display: flex;

    & > div {
      white-space: nowrap;
      display: inline-block;
      //margin-left: -5px;
      height: 100%;
    }
  }

  .time-grid {
    display: inline-block;
    width: 96px;
    position: relative;
    height: 38px;

    &::before {
      content: ' ';
      display: inline-block;
      width: 1px;
      height: 16px;
      background-color: #fff;
      position: absolute;
      top: 0;
      left: 0;
    }

    .time {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
      text-align: center;
      width: 100%;
      margin: 16px 0 0 -48px;
    }

    #playableTime {
      width: 300%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .middle-time-grid-layout {
    position: relative;

    .play-grid {
      position: absolute;
      bottom: 2px;
      height: 24px;
      background: #1890ff;
    }
  }

  .current-time {
    height: 100%;
    position: absolute;
    left: calc(50% - 6px);
    text-align: center;
    top: 0;
    width: 12px;

    &::before {
      content: ' ';
      border: 6px solid transparent;
      position: absolute;
      border-top-color: white;
      left: 1.5px;
    }

    &::after {
      content: ' ';
      border: 6px solid transparent;
      position: absolute;
      bottom: 0;
      border-bottom-color: white;
      left: 1.5px;
    }

    .current-line {
      display: inline-block;
      height: 100%;
      background-color: #fff;
      width: 1px;
    }
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
      width: 24px;
      height: 24px;
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
      background: url('../../../../assets/imgs/icon_subtraction.png')
        center/cover no-repeat;
    }
  }
}
</style>
