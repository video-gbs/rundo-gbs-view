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
              <el-tooltip effect="dark" content="预置位播放" placement="top">
                <svg-icon
                  @click="presetPosition(130, presetPos)"
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
                effect="dark"
                content="预置位名称修改"
                placement="top"
              >
                <svg-icon
                  class="cloudBtn-right"
                  @click="addPresetPosition()"
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

              <el-tooltip effect="dark" content="预置位删除" placement="top">
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
            <span class="preset-span">设置预置位</span>
            <el-input v-model="inputPresetName" placeholder="输入内容">
            </el-input>
            <el-button
              style="float: right; padding-top: 12px; padding-left: 12px"
              type="text"
              size="small"
              @click="presetPosition(129, presetPos, inputPresetName)"
            >
              确定
            </el-button>
            <el-button
              style="float: right; padding-top: 12px; color: #ff4b49"
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
import {
  ptzPresetLists,
  ptzPresetDelete,
  ptzPresetEdit,
  ptzPreset
} from '@/api/method/live'
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

    console.log(111111, this.$props.playerIdx1, this.$props.showContent1)
    this.initType = []
    for (let i = 0; i < this.$props.showContent1.length; i++) {
      this.initType[i] = false
    }
  },
  mounted() {},
  watch: {
    showContent1(val) {
      this.resShowContent = val
    },
    playerIdx1(val) {
      // console.log(1111,val)
      this.optionLists = this.$props.childOptionLists[val]
      this.resChannelId = this.$props.channelExpansionId[val]

      this.resPlayerIdx = val
      this.resShowContent.map((item, index) => {
        if (item && item !== '' && item.length > 0) {
          if (index === this.resPlayerIdx) {
            this.initType[this.resPlayerIdx] = true
          } else {
            this.initType[this.resPlayerIdx] = false
          }
        }
      })
    },
    deep: true,
    immediate: true
  },
  methods: {
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

    presetPosition: function (cmdCode, presetPos, presetName) {
      const reg = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,15}$/
      if (!reg.test(presetName)) {
        return this.$message({
          message: `平台ID命名规则：1-15个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `,
          type: 'error'
        })
      }
      const { deviceID, channelId } = this.deviceData
      // console.log('预置位控制：' + this.presetPos + ' : 0x' + cmdCode.toString(16));
    },
    async deletePreset() {
      await ptzPresetDelete({
        channelExpansionId: this.resChannelId,
        presetId: this.nowPreset
      })
        .then((res) => {
          if (res.code === 0) {
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 设置预置位
    addPresetPosition() {
      this.inputBoxDisplay = !this.inputBoxDisplay
      this.presetPos = this.nowPreset.substring(0, this.nowPreset.indexOf('-'))
      this.inputPresetName = this.nowPreset.substring(
        this.nowPreset.indexOf('-') + 1
      )
    },
    handleChange(val) {
      this.presetPos = this.nowPreset.substring(0, this.nowPreset.indexOf('-'))
      this.inputPresetName = this.nowPreset.substring(
        this.nowPreset.indexOf('-') + 1
      )
      this.presetEnable =
        this.presetList[
          this.nowPreset.substring(0, this.nowPreset.indexOf('-')) - 1
        ].enable
    },
    cancelPreset() {
      this.inputBoxDisplay = false
    },
    // 预置位查询
    queryPreset(val) {
      console.log('预置位查询')
      this.presetList = []
      const { deviceID, channelId } = val

      //数据库中批量添加预置位
      const batchPreset = { deviceID }.deviceID + { channelId }.channelId
      // console.log(this.presetExistence,"已经批量新建的")
      if (!this.presetExistence.includes(batchPreset)) {
        this.presetExistence.push(batchPreset)
      } else {
        // console.log("数据库中已经存在")
      }
    },
    changePos: function (params) {
      this.presetPos = params.presetId
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
