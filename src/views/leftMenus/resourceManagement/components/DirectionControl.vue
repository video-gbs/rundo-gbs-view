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

export default {
  name: 'DirectionControl',
  props: ['deviceData'],
  data() {
    return {
      speed: 30, //云台控制速度
      hoverClass: '', //鼠标移动的位置
      DIRECTIONS_CLASS,
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
  methods: {
    // 鼠标在方向按键上
    handleHoverWheel(direction) {
      console.log('direction~~~~~~~', direction)
      this.hoverClass = direction
    },
    // 鼠标已开方向键
    handleMouseout() {
      this.hoverClass = ''
    },
    // 云台控制
    ptzCamera(cmdCode) {
      // const { channelId } = this.deviceData

      console.log('cmdCode~~~~~~~', cmdCode)
      ptzControl({
        channelId: 21,
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
</style>
