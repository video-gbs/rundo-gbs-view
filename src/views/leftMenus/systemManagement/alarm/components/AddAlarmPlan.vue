<template>
  <div class="addAlarmPlan-content" v-if="isShow">
    <div class="panel-header-box">
      <div class="panel-header-box-border">
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
          class="back-title"
          >新建预案</span
        >
      </div>
    </div>
    <div :class="active === 0 ? 'step1' : 'step'">
      <el-steps
        :active="active"
        finish-status="success"
        class="setp-content"
        align-center
      >
        <el-step title="时间模板"> </el-step>
        <el-step title="告警源"> </el-step>
        <el-step title="告警事件"> </el-step>
      </el-steps>
    </div>
    <div class="search" v-show="active === 0">
      <el-form
        ref="alarmAccountForm"
        class="search-form"
        :inline="true"
        :model="dialogParams.params"
        :rules="rules"
      >
        <!-- <span class="alarm-span">基本信息</span> -->
        <el-form-item label="预案名称:" prop="schemeName">
          <el-input
            v-model="dialogParams.params.schemeName"
            placeholder="请输入"
            clearable
            style="width: 240px"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div :class="active === 0 ? 'step-bottom' : 'step-bottom1'">
      <Step1
        v-show="active === 0"
        @next="next"
        @goback="goback"
        @saveAll="saveAll"
      />
      <Step2
        v-show="active === 1"
        @next="next"
        @goback="goback"
        @last="last"
        @stepParams2="stepParams2"
      />
      <Step3
        v-show="active === 2"
        @lastClickAll="lastClickAll"
        @next="next"
        @goback="goback"
        @last="last"
        @submitStep="submitStep"
        @stepParams3="stepParams3"
      />
    </div>
  </div>
</template>

<script>
import { addSchemeAlarmEvent } from '@/api/method/alarm'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'
import Step3 from './Step3.vue'
export default {
  name: '',
  components: { Step1, Step2, Step3 },
  data() {
    const checkName = (rule, value, cb) => {
      const regName = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/
      if (value.length === 0) {
        return cb(new Error('此为必填项。'))
      }
      setTimeout(() => {
        if (regName.test(value)) {
          return cb()
        } else {
          return cb(
            new Error(
              `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `
            )
          )
        }
      }, 500)
    }
    const checkPassword = (rule, value, cb) => {
      const regPassword =
        /^(?!^\d+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^a-z0-9]+$)(?!^[^A-Z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S*$/
      if (value.length === 0) {
        return cb(new Error('此为必填项。'))
      }
      setTimeout(() => {
        if (regPassword.test(value)) {
          return cb()
        } else {
          return cb(
            new Error(
              '8~20个字符;至少由大写字母、小写字母、数字、特殊字符任意两种组成。'
            )
          )
        }
      }, 500)
    }
    const checkModel = (rule, value, cb) => {
      if (value.length === 0) {
        return cb(new Error('此为必填项。'))
      }
      setTimeout(() => {
        if (value.length <= 128) {
          return cb()
        } else {
          return cb(new Error('1~128个字符。'))
        }
      }, 500)
    }
    return {
      active: 0,
      isShow: true,
      treeValue: '',
      dialogParams: {
        params: {
          schemeName: ''
        }
      },
      step1DataId: '',
      step2Data: [],
      step3Data: [],
      form: {
        model: '',
        username: '',
        deviceType: '1',
        manufacturer: '',
        videoAreaId: '',
        deviceId: '',
        name: '',
        password: ''
      },
      form1: {
        transport: '',
        longitude: '',
        longitude: '',
        port: '',
        ip: ''
      },
      isRequired: true,
      // treeList: [],
      List: '',
      Ids: [],
      Id: '',
      resAreaName: '',
      defaultProps: {
        children: 'childList',
        label: 'resourceName'
      },
      allNorthTypeOptions: [],
      rules: {
        schemeName: {
          required: true,
          message: '预案名称不能为空',
          trigger: 'blur'
        }
      }
    }
  },
  mounted() {
    // this.getAllGatewayLists()
  },
  methods: {
    async getAllGatewayLists() {
      await getAllGatewayLists().then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.name
            obj.value = item.id
            obj.protocol = item.protocol
            this.allNorthTypeOptions.push(obj)
          })
        }
      })
    },
    next() {
      if (this.active++ > 2) this.active = 0
    },
    last() {
      this.active--
      // if ( > 0) this.active = 0
    },
    submitStep() {
      this.active = 0
      this.goback()
    },
    saveAll(val) {
      this.$refs['alarmAccountForm'].validate((valid) => {
        console.log('valid', valid)
        if (valid) {
          this.step1DataId = val
          if (this.active++ > 2) this.active = 0
        }
      })
    },
    stepParams2(val) {
      this.step2Data = val
      console.log('this.step2Data', this.step2Data)
    },
    stepParams3(val) {
      this.step3Data = val
      this.lastClickAll()
    },
    async lastClickAll() {
      await addSchemeAlarmEvent({
        schemeName: this.dialogParams.params.schemeName,
        templateId: this.step1DataId,
        channelIds: this.step2Data,
        alarmSchemeEventReqList: this.step3Data
      }).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            message: '新建成功！',
            type: 'success'
          })
          this.goback()
          this.$emit('getList')
        }
      })
    },
    goback() {
      this.$emit('changeIsShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-step__title.is-success {
  color: #333333 !important;
}

::v-deep .el-step__head.is-success {
  // color: #60be2a;
  border-color: #4b8afe !important;
}
// ::v-deep .el-step__icon
::v-deep .el-icon-check:before {
  color: #ffffff;
}
::v-deep .el-step__main {
  // margin-left: -15px;
}
::v-deep .is-process {
  font-size: 16px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #333333;
}
::v-deep .is-success > .el-step__icon {
  // ::v-deep  {
  background: #4b8afe !important;
  // }
}
.selectTree {
  .el-select-dropdown__item {
    height: 200px !important;
    min-width: 260px;
    overflow-y: scroll !important;
    background: #fff !important;
  }
}
::v-deep .el-card__header {
  padding: 0 16px;
  height: 62px;
}
::v-deep .el-card__body {
  padding-bottom: 0;
}
// 滚动条大小设置
::v-deep .step-bottom::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .step-bottom::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .step-bottom::-webkit-scrollbar-track {
  background: none;
}
// 滚动条大小设置
::v-deep .step-bottom1::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .step-bottom1::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .step-bottom1::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .box-card::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
// 去掉顶部线条
::v-deep .addEquipment-treeForm > .el-tree-node::after {
  border-top: none !important;
}
::v-deep .addEquipment-treeForm > .el-tree-node::before {
  border-left: none;
}
.addAlarmPlan-content {
  height: 100%;
  .panel-header-box {
    margin: 0;
    padding: 0 16px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    .back-svg {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
    .back-title {
      position: relative;
      top: 0px;
      left: 10px;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
    }
    .panel-header-box-border {
      border-top: 1px solid #eaeaea;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #011f53;
    }
  }
  .dialog-footer {
    width: 100%;
    height: 52px;
    line-height: 52px;
    position: relative;
    bottom: 0;
    right: 0px;
    text-align: right;
    border-top: 1px solid #eaeaea;
    > .el-button {
      margin-right: 20px;
    }
    .svg-btn {
      position: relative;
      top: 1px;
      left: -4px;
    }
  }

  .search {
    width: calc(100% - 40px);
    height: 80px;
    margin: 0 20px;
    background: #ffffff;
    border-radius: 2px;
    border-bottom: 1px solid #eaeaea;
    .search-form {
      padding-top: 25px;
      margin-left: 30px;
    }
    // .alarm-span {
    //   position: relative;
    //   font-size: 14px;
    //   color: #606266;
    //   top: -30px;
    //   left: 57px;
    // }
  }

  .step {
    width: calc(100% - 40px);
    height: 100px;
    margin: 20px 20px 0 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #eaeaea;
    border-radius: 2px;
    .setp-content {
      width: 50%;
      margin: 0 auto;
      padding: 30px 10px 20px 40px;
    }
  }
  .step1 {
    width: calc(100% - 40px);
    height: 100px;
    margin: 20px 20px 0 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .setp-content {
      width: 50%;
      margin: 0 auto;
      padding: 30px 10px 20px 40px;
    }
  }
  .step-bottom {
    // height: calc(100% - 200px);
    height: calc(100% - 285px);
    width: calc(100% - 40px);
    overflow-y: auto;
    margin: 0 20px 20px 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
  .step-bottom1 {
    height: calc(100% - 205px);

    width: calc(100% - 40px);
    overflow-y: auto;
    margin: 0 20px 20px 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
}
</style>
