<template>
  <div class="direction-control">
    <!--    方向盘-->
    <div :class="`steering-wheel ${hoverClass}`">
      <div class="hover-arrow" />
      <div
        v-for="item in DIRECTIONS_CLASS"
        :key="item.command"
        :class="item.className"
        @mousedown="ptzCamera(item.command)"
        @mouseup="ptzCamera('stop')"
        @mouseout="handleMouseout"
        @mouseover="handleHoverWheel(item.className)"
      />
    </div>

    <!--    速度控制-->
    <div class="speed-control">
      <span class="text">速度</span>
      <el-slider
        class="el-slider-component"
        v-model="speed"
        :step="1"
        :min="0"
        :max="255"
        :show-tooltip="false"
        @change="$emit('change-speed')"
      >
      </el-slider>
      <span class="text width25">{{ speed }}</span>
    </div>

    <!--    按钮控制-->
    <div class="cloudBtns-control">
      <div class="cloudBtns-control-top">
        <div
          class="cloudBtns-control-top-content"
          v-for="(item, index) in topBtnLists"
          :key="index"
        >
          <el-tooltip effect="dark" :content="item.showName1" placement="top">
            <svg-icon
              :class="
                initTopType[[resPlayerIdx]] ? 'cloudBtn' : 'cloudBtnDisable'
              "
              :icon-class="
                initTopType[[resPlayerIdx]]
                  ? !isTopHover
                    ? getIconClass(item.showName1, index)
                    : getHoverIconClass(item.showName1, index)
                  : getInitIconClass(item.showName1, index)
              "
              @mouseenter="changeTopHover(1, '移入', item.showName1)"
              @mouseleave="changeTopHover(1, '移出', item.showName1)"
            />
          </el-tooltip>

          <span class="cloudBtns-control-top-line"></span>
          <el-tooltip effect="dark" :content="item.showName2" placement="top">
            <svg-icon
              class="cloudBtn-right"
              :class="!initType[resPlayerIdx] ? 'cloudBtn' : 'cloudBtnDisable'"
              :icon-class="
                initTopType[resPlayerIdx]
                  ? !isTopHover
                    ? getIconClass(item.showName2, index)
                    : getHoverIconClass(item.showName2, index)
                  : getInitIconClass(item.showName2, index)
              "
              @mouseenter="changeTopHover(1, '移入', item.showName2)"
              @mouseleave="changeTopHover(1, '移出', item.showName2)"
            />
          </el-tooltip>
        </div>
      </div>

      <div class="cloudBtns-control-bottom">
        <div class="cloudBtns-control-content">
          <el-tooltip effect="dark" content="一键聚焦" placement="top">
            <svg-icon
              :class="!initType ? 'cloudBtn' : 'cloudBtnDisable'"
              :icon-class="
                !initType
                  ? isJujiaoHover
                    ? 'jujiao-h'
                    : 'jujiao'
                  : 'jujiaohidden'
              "
              @mouseenter="changeHover(1, '移入')"
              @mouseleave="changeHover(1, '移出')"
            />
          </el-tooltip>

          <span class="cloudBtns-control-line"></span>
          <el-tooltip effect="dark" content="3D放大" placement="top">
            <svg-icon
              class="cloudBtn-right"
              :class="!initType ? 'cloudBtn' : 'cloudBtnDisable'"
              :icon-class="
                !initType
                  ? is3DHover
                    ? '3Dfangda-h'
                    : '3Dfangda'
                  : '3Dfangdahidden'
              "
              @mouseenter="changeHover(2, '移入')"
              @mouseleave="changeHover(2, '移出')"
            />
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 方向枚举
export const DIRECTIONS_CLASS = [
  { className: 'top', command: 'up' },
  { className: 'left', command: 'left' },
  { className: 'right', command: 'right' },
  { className: 'bottom', command: 'down' },
  { className: 'top-left', command: 'upleft' },
  { className: 'top-right', command: 'upright' },
  { className: 'bottom-left', command: 'downleft' },
  { className: 'bottom-right', command: 'downright' }
]

import { ptzControl } from '@/api/method/live'
import { Local } from '@/utils/storage'

export default {
  name: 'DirectionControl',
  props: ['deviceData', 'showContent', 'playerIdx'],
  data() {
    return {
      isHoverNum: 0,
      isCloudBtnsHover1: false,
      isJujiaoHover: false,
      is3DHover: false,
      isTopHover: false,
      topBtnLists: [
        {
          showName1: '缩小',
          showName2: '放大'
        },
        {
          showName1: '焦点拉进',
          showName2: '焦点拉远'
        },
        {
          showName1: '光圈缩小',
          showName2: '光圈放大'
        }
      ],
      initTopType: [],
      resPlayerIdx: 0,
      hoverNum: 0,
      initType: true,
      speed: 30, //云台控制速度
      hoverClass: '', //鼠标移动的位置
      DIRECTIONS_CLASS,
      resShowContent: [],
      status: {
        up: 8,
        left: 2,
        right: 1,
        down: 4,
        upleft: 10,
        upright: 9,
        downleft: 6,
        downright: 5,
        stop: 0
      }
    }
  },
  watch: {
    showContent(val) {
      console.log('~~~~~~~', val)
      this.resShowContent = val
    },
    playerIdx(val) {
      console.log('~~~~~~~resPlayerIdx', val)
      this.resPlayerIdx = val
      this.resShowContent.map((item, index) => {
        if (item && item !== '' && item.length > 0) {
          this.topBtnLists.map((item, j) => {
            if (index === this.resPlayerIdx) {
              console.log('chang')
              this.initTopType[this.resPlayerIdx] = true
            } else {
              console.log('changelse')
              this.initTopType[this.resPlayerIdx] = false
            }
          })
        }
      })
    },
    deep: true,
    immediate: true
  },

  created() {
    this.resShowContent = Local.get('videoUrl') || this.$props.showContent

    this.resPlayerIdx = this.$props.playerIdx

    this.initTopType = []
    for (let i = 0; i < this.$props.showContent; i++) {
      this.initTopType[i] = false
    }
  },
  mounted() {},
  methods: {
    getInitIconClass(value, index) {
      switch (index) {
        case 0:
          if (value === '缩小') {
            return 'suofanghidden'
          } else {
            return 'fangdahidden'
          }
          break
        case 1:
          if (value === '焦点拉进') {
            return 'jiaodianlajinhidden'
          } else {
            return 'jiaodianlayuanhidden'
          }
          break
        case 2:
          if (value === '光圈缩小') {
            return 'guangquansuofanghidden'
          } else {
            return 'guangquanfangdahidden'
          }
          break
        default:
          break
      }
    },
    getHoverIconClass(item, k) {
      console.log(item, this.hoverNum)
      switch (this.hoverNum) {
        case 1:
          switch (item) {
            case '缩小':
              return 'suofang-h'
              break
            case '放大':
              return 'fangda'
              break
            case '焦点拉进':
              return 'jiaodianlajin'
              break
            case '焦点拉远':
              return 'jiaodianlayuan'
              break
            case '光圈缩小':
              return 'guangquansuofang'
              break
            case '光圈放大':
              return 'guangquanfangda'
              break
            default:
              break
          }
          break
        case 2:
          switch (item) {
            case '缩小':
              return 'suofang'
              break
            case '放大':
              return 'fangda-h'
              break
            case '焦点拉进':
              return 'jiaodianlajin'
              break
            case '焦点拉远':
              return 'jiaodianlayuan'
              break
            case '光圈缩小':
              return 'guangquansuofang'
              break
            case '光圈放大':
              return 'guangquanfangda'
              break
            default:
              break
          }
          break
        case 3:
          switch (item) {
            case '缩小':
              return 'suofang'
              break
            case '放大':
              return 'fangda'
              break
            case '焦点拉进':
              return 'jiaodianlajin-h'
              break
            case '焦点拉远':
              return 'jiaodianlayuan'
              break
            case '光圈缩小':
              return 'guangquansuofang'
              break
            case '光圈放大':
              return 'guangquanfangda'
              break
            default:
              break
          }
          break
        case 4:
          switch (item) {
            case '缩小':
              return 'suofang'
              break
            case '放大':
              return 'fangda'
              break
            case '焦点拉进':
              return 'jiaodianlajin'
              break
            case '焦点拉远':
              return 'jiaodianlayuan-h'
              break
            case '光圈缩小':
              return 'guangquansuofang'
              break
            case '光圈放大':
              return 'guangquanfangda'
              break
            default:
              break
          }
          break
        case 5:
          switch (item) {
            case '缩小':
              return 'suofang'
              break
            case '放大':
              return 'fangda'
              break
            case '焦点拉进':
              return 'jiaodianlajin'
              break
            case '焦点拉远':
              return 'jiaodianlayuan'
              break
            case '光圈缩小':
              return 'guangquansuofang-h'
              break
            case '光圈放大':
              return 'guangquanfangda'
              break
            default:
              break
          }
          break
        case 6:
          switch (item) {
            case '缩小':
              return 'suofang'
              break
            case '放大':
              return 'fangda'
              break
            case '焦点拉进':
              return 'jiaodianlajin'
              break
            case '焦点拉远':
              return 'jiaodianlayuan'
              break
            case '光圈缩小':
              return 'guangquansuofang'
              break
            case '光圈放大':
              return 'guangquanfangda-h'
              break
            default:
              break
          }
          break
        default:
          break
      }
    },
    getIconClass(item, j) {
      console.log(333)
      switch (j) {
        case 0:
          if (item === '缩小') {
            return 'suofang'
          } else {
            return 'fangda'
          }
          break
        case 1:
          if (item === '焦点拉进') {
            return 'jiaodianlajin'
          } else {
            return 'jiaodianlayuan'
          }
          break
        case 2:
          if (item === '光圈缩小') {
            return 'guangquansuofang'
          } else {
            return 'guangquanfangda'
          }
          break
        default:
          break
      }
    },
    changeTopHover(num, value, showName) {
      if (this.initTopType) {
        if (num === 1) {
          switch (value) {
            case '移入':
              if (showName === '缩小') {
                this.hoverNum = 1
              } else if (showName === '放大') {
                this.hoverNum = 2
              } else if (showName === '焦点拉进') {
                this.hoverNum = 3
              } else if (showName === '焦点拉远') {
                this.hoverNum = 4
              } else if (showName === '光圈缩小') {
                this.hoverNum = 5
              } else if (showName === '光圈放大') {
                this.hoverNum = 6
              } else {
              }
              this.isTopHover = true
              break
            case '移出':
              this.isTopHover = false
              break
            default:
              break
          }
        } else {
          switch (value) {
            case '移入':
              this.isTopHover = true
              break
            case '移出':
              this.isTopHover = false
              break
            default:
              break
          }
        }
      }
    },
    changeHover(num, value) {
      if (this.initType) {
        if (num === 1) {
          switch (value) {
            case '移入':
              this.isJujiaoHover = true
              break
            case '移出':
              this.isJujiaoHover = false
              break
            default:
              break
          }
        } else {
          switch (value) {
            case '移入':
              this.is3DHover = true
              break
            case '移出':
              this.is3DHover = false
              break
            default:
              break
          }
        }
      }
    },
    // 鼠标在方向按键上
    handleHoverWheel(direction) {
      // console.log('direction~~~~~~~', direction)
      this.hoverClass = direction
    },
    // 鼠标已开方向键
    handleMouseout() {
      this.hoverClass = ''
    },
    // 云台控制
    ptzCamera(cmdCode) {
      // const { channelId } = this.deviceData

      // console.log('cmdCode~~~~~~~', cmdCode, Local.get('cloudId'))
      ptzControl({
        channelId: Local.get('cloudId'),
        cmdCode: this.status[cmdCode],
        horizonSpeed: this.speed,
        verticalSpeed: this.speed,
        zoomSpeed: this.speed,
        totalSpeed: this.speed
      })
    }
  }
}
</script>

<style lang="scss">
.direction-control {
  .speed-control {
    width: 214px;
    height: 46px;
    margin-left: -7px;
    background: rgba(16, 85, 189, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    margin-top: 16px;
    padding: 12px 24px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-slider-component {
      width: 82px;
      height: 6px;

      .el-slider__runway {
        background: rgba(255, 255, 255, 0.12);
        border-radius: 3px 3px 3px 3px;
        margin: 0;
      }

      .el-slider__button {
        display: none;
      }

      .el-slider__bar {
        border-radius: 3px;
      }
    }

    &:hover .el-slider__button {
      display: inline-block !important;
    }

    .el-slider__bar {
      background-color: #1890ff !important;
    }

    .text {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
    }
    .width25 {
      width: 25px;
    }
  }

  .front-wheel {
    display: grid;
    grid-auto-columns: 60px;
    grid-auto-rows: 100px;
  }

  .steering-wheel {
    width: 200px;
    height: 200px;
    overflow: hidden;
    position: relative;

    &::before {
      content: ' ';
      display: block;
      width: 100%;
      height: 100%;
      background: url('../../../../assets/imgs/ctrl_bg1.png') no-repeat;
      background-size: cover;
      opacity: 0.3;
      z-index: -1;
    }
    &:active .hover-arrow {
      opacity: 0.8;
    }

    .hover-arrow {
      display: none;
      position: absolute;
      left: 0;
      top: 0;
      width: 200px;
      height: 200px;
      background: url('../../../../assets/imgs/ctrl_right_arrow.png') no-repeat;
      background-size: cover !important;
      opacity: 0.6;
      z-index: 0;
    }

    &::after {
      display: block;
      content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      width: 200px;
      height: 200px;
      background: url('../../../../assets/imgs/ctrl_bg2.png') no-repeat;
      background-size: cover !important;
      opacity: 0.3;
    }

    &.top .hover-arrow {
      display: block;
    }
    &.right .hover-arrow {
      display: block;
      transform: rotateZ(90deg);
    }
    &.left .hover-arrow {
      display: block;
      transform: rotateZ(-90deg);
    }
    &.bottom .hover-arrow {
      display: block;
      transform: rotateZ(180deg);
    }
    &.bottom-left .hover-arrow {
      display: block;
      background: url('../../../../assets/imgs/ctrl_top_right_arrow.png')
        no-repeat;
      transform: rotateZ(180deg);
    }
    &.bottom-right .hover-arrow {
      display: block;
      background: url('../../../../assets/imgs/ctrl_top_right_arrow.png')
        no-repeat;
      transform: rotateZ(90deg);
    }
    &.top-left .hover-arrow {
      display: block;
      background: url('../../../../assets/imgs/ctrl_top_right_arrow.png')
        no-repeat;
      transform: rotateZ(-90deg);
    }
    &.top-right .hover-arrow {
      display: block;
      background: url('../../../../assets/imgs/ctrl_top_right_arrow.png')
        no-repeat;
    }

    & > div {
      position: absolute;
      width: 42px;
      height: 42px;
      //background: rgba(255,255,255,.5); //调试
      cursor: pointer;
      z-index: 1;

      //按键方向
      &.top-left {
        top: 37px;
        left: 37px;
      }
      &.top-right {
        top: 37px;
        right: 37px;
      }
      &.bottom-left {
        bottom: 37px;
        left: 37px;
      }
      &.bottom-right {
        bottom: 37px;
        right: 37px;
      }
      &.left {
        top: calc(50% - 21px);
        left: 13px;
      }
      &.right {
        top: calc(50% - 21px);
        right: 13px;
      }
      &.top {
        left: calc(50% - 21px);
        top: 13px;
      }
      &.bottom {
        left: calc(50% - 21px);
        bottom: 13px;
      }
    }
  }
}

.cloudBtns-control {
  .cloudBtns-control-top {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    .cloudBtns-control-top-content {
      width: 96px;
      height: 36px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #ecf0f3;
      display: flex;
      justify-content: space-between;
      .cloudBtn {
        position: relative;
        top: 5px;
        left: 12px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
      .cloudBtnDisable {
        position: relative;
        top: 5px;
        left: 12px;
        width: 24px;
        height: 24px;
        cursor: not-allowed;
      }
      .cloudBtn-right {
        left: -10px;
      }
      .cloudBtns-control-top-line {
        display: inline-block;
        position: relative;
        top: 8px;
        width: 1px;
        height: 20px;
        background: #ecf0f3;
      }
    }
  }
  .cloudBtns-control-bottom {
    padding: 10px 20px;
    .cloudBtns-control-content {
      width: 100%;
      height: 36px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #ecf0f3;
      display: flex;
      justify-content: space-between;
      .cloudBtn {
        position: relative;
        top: 5px;
        left: 25%;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
      .cloudBtnDisable {
        position: relative;
        top: 5px;
        left: 25%;
        width: 24px;
        height: 24px;
        cursor: not-allowed;
      }
      .cloudBtn-right {
        left: -25%;
      }
      .cloudBtns-control-line {
        display: inline-block;
        position: relative;
        top: 8px;
        width: 1px;
        height: 20px;
        background: #ecf0f3;
      }
    }
  }
}
</style>
