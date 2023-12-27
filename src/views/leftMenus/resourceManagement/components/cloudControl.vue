<template>
  <!-- 云台控制 -->
  <div class="cloud-control-container">
    <DirectionControl
      ref="directionControl"
      :device-data="deviceData"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <div class="control-operate-box">
      <div class="preliminary-position">
        <div class="position-title">预置位</div>
        <div class="position-control-panel"></div>
        <div class="position-preset">
          <div class="position-preset-middle">
            <div>
              <el-select
                v-model="nowPreset"
                placeholder="请选择预置位"
                clearable
                @change="handleChange"
              >
                <el-option
                  v-for="item in optionLists"
                  :key="item.presetId"
                  :value="item.presetId"
                  :label="item.presetName"
                >
                </el-option>
              </el-select>
            </div>

            <div class="yuzhiwei-control-content">
              <el-tooltip
                v-permission="['/expansion/ptz/preset/invoke', 3]"
                effect="dark"
                content="预置位播放"
                placement="top"
              >
                <svg-icon
                  @click="ptzPlay"
                  :class="
                    initType[resPlayerIdx] ? 'cloudBtn' : 'cloudBtnDisable'
                  "
                  :icon-class="
                    initType[resPlayerIdx]
                      ? isBofangHover
                        ? 'yuzhiweibofang-h'
                        : 'yuzhiweibofang'
                      : 'yuzhiweibofanghidden'
                  "
                  @mouseenter="changeHover(1, '移入')"
                  @mouseleave="changeHover(1, '移出')"
                />
              </el-tooltip>

              <el-tooltip
                v-permission="['/expansion/ptz/preset/edit', 3]"
                effect="dark"
                content="预置位名称修改"
                placement="top"
              >
                <svg-icon
                  class="cloudBtn-right"
                  @click="presetEdit()"
                  :class="
                    initType[resPlayerIdx] ? 'cloudBtn' : 'cloudBtnDisable'
                  "
                  :icon-class="
                    initType[resPlayerIdx]
                      ? isXiugaiHover
                        ? 'yuzhiweixiugai-h'
                        : 'yuzhiweixiugai'
                      : 'yuzhiweixiugaihidden'
                  "
                  @mouseenter="changeHover(2, '移入')"
                  @mouseleave="changeHover(2, '移出')"
                />
              </el-tooltip>

              <el-tooltip
                v-permission="['/expansion/ptz/preset/delete', 4]"
                effect="dark"
                content="预置位删除"
                placement="top"
              >
                <svg-icon
                  class="cloudBtn-right"
                  @click="
                    initType[resPlayerIdx] ? deletePreset(131, presetPos) : ''
                  "
                  :class="
                    initType[resPlayerIdx] ? 'cloudBtn' : 'cloudBtnDisable'
                  "
                  :icon-class="
                    initType[resPlayerIdx]
                      ? isShanchuHover
                        ? 'yuzhiweishanchu-h'
                        : 'yuzhiweishanchu'
                      : 'yuzhiweishanchuhidden'
                  "
                  @mouseenter="changeHover(3, '移入')"
                  @mouseleave="changeHover(3, '移出')"
                />
              </el-tooltip>
            </div>
          </div>

          <div class="preset-input-box" v-if="inputBoxDisplay">
            <span class="preset-span">修改预置位名称</span>
            <el-input v-model="inputPresetName" placeholder="输入内容">
            </el-input>
            <el-button
              style="
                float: right;
                padding-top: 12px;
                padding-left: 12px;
                position: relative;
                top: -4px;
              "
              type="text"
              size="small"
              @click="presetPosition(inputPresetName)"
            >
              确定
            </el-button>
            <el-button
              style="
                float: right;
                padding-top: 12px;
                color: #ff4b49;
                position: relative;
                top: -4px;
              "
              type="text"
              size="small"
              @click="cancelPreset()"
            >
              取消
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DirectionControl from './DirectionControl'
import { ptzPresetDelete, ptzPresetEdit, ptzPreset } from '@/api/method/live'
export default {
  name: 'cloudControl',
  components: {
    DirectionControl
  },
  data() {
    return {
      resChannelId: '',
      optionLists: [],
      resShowContent: [],
      isBofangHover: false,
      isXiugaiHover: false,
      isShanchuHover: false,
      resPlayerIdx: 0,
      hoverNum: 0,
      initType: [],
      isCloudBtnsHover: false,
      isHoverNum: null,
      videoUrl: '',
      controSpeed: 30, //云台控制速度
      presetPos: 0,
      presetList: [], //预置位数据
      presetExistence: [], //数据库中有数据了
      count: 10, //预置位的数量
      nowPreset: '',
      inputPresetName: '', //预置位名称
      inputBoxDisplay: false, //是否显示输入框
      presetEnable: false //是否禁用删除或调用
    }
  },
  props: [
    'deviceData',
    'showContent1',
    'playerIdx1',
    'childOptionLists',
    'channelExpansionId'
  ],
  created() {
    this.resShowContent = this.$props.showContent1

    this.resPlayerIdx = this.$props.playerIdx1

    this.optionLists = this.$props.childOptionLists[this.$props.playerIdx1]

    this.resChannelId = this.$props.channelExpansionId[this.$props.playerIdx1]

    this.initType = []
    for (let i = 0; i < this.$props.showContent1.length; i++) {
      this.initType[i] = false
    }
  },
  mounted() {},
  watch: {
    showContent1(val) {
      this.resShowContent = val

      this.resShowContent.map((item, index) => {
        if (item && item.length > 0) {
          this.initType[index] = true
        } else {
          this.initType[index] = false
        }
      })

      this.$forceUpdate()
    },
    playerIdx1(val) {
      this.optionLists = this.$props.childOptionLists[val]
      this.resChannelId = this.$props.channelExpansionId[val]

      this.resPlayerIdx = val
      // this.resShowContent.map((item, index) => {
      //   if (item && item !== '' && item.length > 0) {
      //     if (index === this.resPlayerIdx) {
      //       this.initType[this.resPlayerIdx] = true
      //     } else {
      //       this.initType[this.resPlayerIdx] = false
      //     }
      //   }
      // })
      this.resShowContent.map((item, index) => {
        if (item && item !== '' && item.length > 0) {
          // this.initTopType[index] = true
          this.initType[index] = true
        } else {
          // this.initTopType[index] = false
          this.initType[index] = false

          if (
            this.resShowContent.length > 1 &&
            this.resShowContent.length - 1 === val &&
            this.resShowContent[this.resShowContent.length - 1] !== ''
          ) {
            // this.initTopType[this.resShowContent.length - 1] = true
            this.initType[this.resShowContent.length - 1] = true
          }
        }
      })
      this.nowPreset =
        this.optionLists !== undefined &&
        this.optionLists.length > 0 &&
        this.optionLists[0].presetId
          ? this.optionLists[0].presetId
          : ''
      this.$forceUpdate()
    },
    deep: true,
    immediate: true
  },
  methods: {
    async ptzPlay() {
      await ptzPreset({
        channelExpansionId: this.resChannelId,
        presetId: this.nowPreset
      }).then((res) => {
        if (res.data.code === 0) {
        }
      })
    },
    getOptionLists(index) {
      this.optionLists = this.$props.childOptionLists[index]
    },
    changeHover(num, value) {
      if (this.initType) {
        if (num === 1) {
          switch (value) {
            case '移入':
              this.isBofangHover = true
              break
            case '移出':
              this.isBofangHover = false
              break
            default:
              break
          }
        } else if (num === 2) {
          switch (value) {
            case '移入':
              this.isXiugaiHover = true
              break
            case '移出':
              this.isXiugaiHover = false
              break
            default:
              break
          }
        } else {
          switch (value) {
            case '移入':
              this.isShanchuHover = true
              break
            case '移出':
              this.isShanchuHover = false
              break
            default:
              break
          }
        }
      }
    },

    async presetPosition(presetName) {
      const reg = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,15}$/
      if (!reg.test(presetName)) {
        return this.$message({
          message: `平台ID命名规则：1-15个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `,
          type: 'error'
        })
      }
      await ptzPresetEdit({
        channelExpansionId: this.resChannelId,
        presetId: this.nowPreset,
        presetName
      }).then((res) => {
        if (res.data.code === 0) {
          // if (this.nowPreset !== '') {
          //   this.nowPreset = presetName
          // }

          if (
            this.nowPreset === '' ||
            this.nowPreset === null ||
            this.nowPreset === undefined
          ) {
            this.$message({
              message: '新增预置位成功',
              type: 'success'
            })
          } else {
            this.$message({
              type: 'success',
              message: '修改名称成功'
            })
          }

          this.inputBoxDisplay = false
          this.inputPresetName = ''
          this.$emit(
            'changeChildOptionLists',
            this.resChannelId,
            this.resPlayerIdx
          )
        }
      })
    },
    async deletePreset() {
      if (
        this.nowPreset === '' ||
        this.nowPreset === null ||
        this.nowPreset === undefined
      ) {
        this.$message({
          message: '请选择预置位',
          type: 'warning'
        })
        return
      }
      await ptzPresetDelete({
        channelExpansionId: this.resChannelId,
        presetId: this.nowPreset
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.optionLists = this.optionLists.filter((item) => {
              return item.presetId !== this.nowPreset
            })
            this.nowPreset = ''

            this.$message({
              type: 'success',
              message: '删除成功'
            })

            this.$emit('changeOptionLists', this.resPlayerIdx, this.nowPreset)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 设置预置位
    presetEdit() {
      this.inputBoxDisplay = !this.inputBoxDisplay
      this.$emit('wrapperBottomContentScroll')
    },
    handleChange(val) {
      this.nowPreset = val
    },
    cancelPreset() {
      this.inputBoxDisplay = false
      this.inputPresetName = ''
    }
  },
  destroyed() {}
}
</script>

<style lang="scss">
.cloud-control-container {
  position: relative;
  .position-title {
    margin-bottom: 0px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 10px;
  }

  .direction-control {
    .steering-wheel {
      margin: 24px auto 2px;

      &::before {
        opacity: 1;
      }
      &::after {
        opacity: 0.9;
      }

      &:active::after {
        opacity: 1;
      }
    }

    .speed-control {
      background-color: transparent;
      margin: 0 auto 12px;

      .text {
        color: rgba(0, 0, 0, 0.85);
      }
      .el-slider-component .el-slider__runway {
        background: rgba(0, 0, 0, 0.04);
      }
    }
  }
}
.position-preset .position-preset-middle {
  display: flex;
  //  justify-content: center;
  padding-bottom: 20px;

  div {
    width: 178px;
    height: 36px;
    .el-input--suffix .el-input__inner {
      padding-right: 30px;
      height: 32px;
      border-radius: 2px;
    }
    .el-select .el-input .el-select__caret {
      // display: none;
    }
  }
}
.selectTree {
  .el-select-dropdown__item {
    height: 200px !important;
    min-width: 260px;
    overflow-y: scroll !important;
    background: #fff !important;
  }
}
.position-preset-middle .el-button--primary {
  height: 32px;
  font-size: 14px;
  border-radius: 2px;
  font-family: PingFangSC-Regular, PingFang SC;
}
.position-preset-middle .el-button--primary.is-plain {
  color: white !important;
}
.position-preset-middle .el-button--primary.is-plain.is-disabled {
  background-color: rgba(0, 0, 0, 0.04) !important;
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  color: rgba(0, 0, 0, 0.25) !important;
}
.preset-input-box {
  padding: 12px;
  width: 200px;
  height: 98px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  margin-bottom: 24px;

  span {
    font-size: 14px;
  }

  .preset-span {
    float: left;
    padding-bottom: 8px;
  }
}
.yuzhiwei-control-content {
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  margin: 0 20px;
  .cloudBtn {
    position: relative;
    top: 5px;
    left: 25px;
    width: 24px;
    height: 24px;
  }
  .cloudBtnDisable {
    position: relative;
    top: 5px;
    left: 25px;
    width: 24px;
    height: 24px;
    cursor: not-allowed;
  }
}
</style>
