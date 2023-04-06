<template>
  <!-- 云台控制 -->
  <div class="cloud-control-container">
    <DirectionControl
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
                  v-for="item in presetList"
                  :key="item.preset"
                  :value="item.preset"
                  style="height: 24px"
                >
                </el-option>
              </el-select>
            </div>

            <div class="yuzhiwei-control-content">
              <el-tooltip effect="dark" content="预置位播放" placement="top">
                <svg-icon
                  class="cloudBtn"
                  @click="presetPosition(130, presetPos)"
                  :icon-class="
                    !isCloudBtnsHover ? 'yuzhiweibofang-h' : 'yuzhiweibofang'
                  "
                />
              </el-tooltip>

              <el-tooltip
                effect="dark"
                content="预置位名称修改"
                placement="top"
              >
                <svg-icon
                  class="cloudBtn cloudBtn-right"
                  @click="addPresetPosition()"
                  :icon-class="
                    !isCloudBtnsHover ? 'yuzhiweixiugai-h' : 'yuzhiweixiugai'
                  "
                />
              </el-tooltip>

              <el-tooltip effect="dark" content="预置位删除" placement="top">
                <svg-icon
                  class="cloudBtn cloudBtn-right"
                  @click="presetPosition(131, presetPos)"
                  :icon-class="
                    !isCloudBtnsHover ? 'yuzhiweishanchu-h' : 'yuzhiweishanchu'
                  "
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
export default {
  name: 'cloudControl',
  components: {
    DirectionControl
  },
  data() {
    return {
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
  props: {
    deviceData: Object
  },
  mounted() {
    // setTimeout(() => {
    //   this.queryPreset();
    // }, 0);
    // this.$bus.$on("ptzCamera", (type) => {
    //   console.info("bus.type", type);
    //   this.ptzCamera(type);
    // });
  },
  watch: {
    deviceData: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.deviceID) {
          this.queryPreset(newVal)
        }
      }
    }
  },
  methods: {
    changeHover(num, value) {
      if (num === 1) {
        switch (value) {
          case 0:
            this.isHoverNum = 0
            break
          case 1:
            this.isHoverNum = 1
            break
          case 2:
            this.isHoverNum = 2
            break
          case 3:
            this.isHoverNum = 3
            break
          case 4:
            this.isHoverNum = 4
            break
          case 5:
            this.isHoverNum = 5
            break
          case 6:
            this.isHoverNum = 6
            break
          case 7:
            this.isHoverNum = 7
            break
          default:
            break
        }
      } else {
        switch (value) {
          case 0:
            this.isHoverNum = 0
            break
          case 1:
            this.isHoverNum = 1
            break
          case 2:
            this.isHoverNum = 2
            break
          case 3:
            this.isHoverNum = 3
            break
          case 4:
            this.isHoverNum = 4
            break
          case 5:
            this.isHoverNum = 5
            break
          case 6:
            this.isHoverNum = 6
            break
          case 7:
            this.isHoverNum = 7
            break
          default:
            break
        }
      }
    },
    callPosition(deviceId, channelId) {
      this.$axios({
        method: 'post',
        url: `/api/ptz/front_end_command/${deviceId}/${channelId}`
      })
        .then((res) => {
          console.info('=====#####111', res)
        })
        .catch(() => {
          that.$message({
            message: '调用失败！',
            type: 'error'
          })
        })
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
      // console.log(this.deviceData,"deviceData")
      // console.log('预置位控制：' + this.presetPos + ' : 0x' + cmdCode.toString(16));
      this.$axios({
        method: 'post',
        // url: '/api/ptz/front_end_command/' + deviceID + '/' + channelId + '?cmdCode=' + cmdCode + '&parameter1=0&parameter2=' + presetPos + '&combindCode2=0'
        url: '/api/ptz/front_end_command',
        params: {
          deviceId: { deviceID }.deviceID,
          channelId: { channelId }.channelId,
          cmdCode: cmdCode,
          parameter1: 0,
          parameter2: presetPos,
          combindCode2: 0,
          presetName: presetName
        }
      }).then((res) => {
        this.inputBoxDisplay = false
        this.queryPreset(this.deviceData)
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
    handleChange() {
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
        //往数据库批量添加
        this.batchPresetPosition({ deviceID }.deviceID, { channelId }.channelId)
        // console.log(this.presetExistence,"数据库中不存在")
      } else {
        // console.log("数据库中已经存在")
      }
      this.$axios({
        method: 'get',
        // url: `/api/ptz/preset/query/${deviceID}/${channelId}`
        url: '/api/ptz/preset/query',
        params: {
          deviceId: { deviceID }.deviceID,
          channelId: { channelId }.channelId
        }
      }).then((res) => {
        // console.log(res,"预置位列表")
        if (res.data.data && Array.isArray(res.data.data)) {
          this.presetList = res.data.data
          this.presetList.forEach((element) => {
            const preset = element.presetId + '-' + element.presetName
            element.preset = preset
          })
          const currentPreset =
            this.presetList[
              this.nowPreset.substring(0, this.nowPreset.indexOf('-')) - 1
            ]
          this.nowPreset = currentPreset.preset
          this.presetEnable = currentPreset.enable
          // console.log(this.presetEnable,"是否启动")
        }
        // console.log(this.presetList,"预置位列表")
      })
    },
    //批量添加预置位（默认预置位）
    batchPresetPosition(deviceId, channelId) {
      this.$axios({
        method: 'get',
        url: '/api/ptz/preset/batchAdd',
        params: {
          deviceId: deviceId,
          channelId: channelId,
          count: this.count
        }
      }).then(() => {})
    },
    // 云台控制
    ptzCamera: function (command) {
      const { deviceID, channelId } = this.deviceData
      console.log('云台控制数据：' + this.deviceData)
      console.log('云台控制：' + command)
      this.$axios({
        method: 'post',
        url:
          '/api/ptz/control/' +
          deviceID +
          '/' +
          channelId +
          '?command=' +
          command +
          '&horizonSpeed=' +
          this.controSpeed +
          '&verticalSpeed=' +
          this.controSpeed +
          '&zoomSpeed=' +
          this.controSpeed
      }).then(function (res) {})
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
}
</style>
