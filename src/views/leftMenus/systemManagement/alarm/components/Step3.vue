<template>
  <div class="step3-content">
    <div class="init-img-div" v-if="checkeLists.length === 0">
      <img
        class="init-img"
        src="../../../../../assets/imgs/addgjsj.png"
        alt=""
        @click="showContent"
      />
    </div>

    <div class="init-main" v-else>
      <div class="tag-group">
        <span class="tag-group__title">选择事件</span>
        <el-tag
          v-for="tag in checkeLists"
          :key="tag.eventName"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          size="medium"
          class="tag-btn"
        >
          {{ tag.eventName }}
        </el-tag>
        <div class="button-new-tag" @click="showContent">+ 添加事件</div>
      </div>

      <div class="tag-group-content">
        <el-card
          v-for="(tag, index) in checkeLists"
          :key="tag.eventCode"
          class="box-card"
        >
          <div slot="header" class="clearfix">
            <LineFont
              :line-title="{
                title: tag.eventName,
                notShowSmallTitle: false
              }"
              :text-style="textStyle"
              :line-blue-style="lineBlueStyle"
            />
          </div>
          <el-form
            ref="stepForm"
            :model="stepform3[index]"
            :rules="rules"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="入侵等级" prop="eventLevel">
              <span
                v-for="(level, i) in intrusionLevel[index]"
                :key="level"
                class="intrusionLevel-span"
                :class="`intrusionLevel${i + 1}`"
                @click="onclick(index, i + 1)"
              >
                {{ level }}
                <!-- <el-input v-model="stepform3[index].isactive" type="hidden"></el-input> -->
                <svg-icon
                  v-if="stepform3[index].isactive === i + 1"
                  :icon-class="`intrusionLevel${i + 1}`"
                  class="intrusionLevel_svg"
                />
              </span>
            </el-form-item>
            <el-form-item label="间隔时间(秒)" prop="eventInterval">
              <el-select
                placeholder="请选择"
                v-model="stepform3[index].eventInterval"
                style="width: 288px"
              >
                <el-option label="0" :value="0"></el-option>
                <el-option label="15" :value="15"></el-option>
                <el-option label="30" :value="30"></el-option>
                <el-option label="60" :value="60"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="告警截图" prop="enablePhoto">
              <el-switch
                v-model="stepform3[index].enablePhoto"
                active-color="#13ce66"
                inactive-color="#DCDFE6"
              ></el-switch>
            </el-form-item>
            <el-form-item label="录制视频" prop="enableVideo">
              <el-switch
                v-model="stepform3[index].enableVideo"
                active-color="#13ce66"
                inactive-color="#DCDFE6"
              ></el-switch>
            </el-form-item>

            <el-form-item
              v-if="stepform3[index].enableVideo"
              label="录像时长(秒)"
              prop="videoLength"
            >
              <el-select
                placeholder="请选择"
                v-model="stepform3[index].videoLength"
                style="width: 288px"
              >
                <el-option label="0" :value="0"></el-option>
                <el-option label="15" :value="15"></el-option>
                <el-option label="30" :value="30"></el-option>
                <el-option label="60" :value="60"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="stepform3[index].enableVideo"
              label='设备"拾音"'
              prop="enableVideo"
            >
              <el-switch
                v-model="stepform3[index].videoHasAudio"
                active-color="#13ce66"
                inactive-color="#DCDFE6"
              ></el-switch>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>

    <el-dialog
      v-if="dialog.show"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="720px"
      :before-close="handleClose1"
    >
      <el-input
        placeholder="请输入搜索关键字"
        suffix-icon="el-icon-search"
        class="search-input"
        v-model="filterText"
        style="width: 580px"
        clearable
      ></el-input>
      <div class="allIncident-div">
        <el-checkbox-group
          v-model="checkeLists"
          class="allIncident-checkbox-group"
          @change="testChange"
        >
          <el-checkbox
            v-for="incident in allIncident"
            :label="incident"
            :key="incident.eventCode"
            class="allIncident-checkbox"
            >{{ incident.eventName }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="dialog.show = false">确 定</el-button>
      </span>
    </el-dialog>

    <div class="btn-lists">
      <el-button @click="goback"
        ><svg-icon class="svg-btn" icon-class="back-svg" />返回</el-button
      >
      <el-button type="primary" @click="clickLast" class="step-btn"
        >上一步</el-button
      >
      <el-button type="primary" @click="submitStep3" class="step-btn"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import { getAlarmEventLists } from '@/api/method/alarm'
import LineFont from '@/components/LineFont'
import { Local } from '@/utils/storage'
export default {
  name: '',
  components: { LineFont },
  props: [],
  data() {
    return {
      isShowImg: true,
      dialog: {
        show: false,
        title: '事件清单',
        params: {
          // eventName: ''
        }
      },
      stepform3: [],
      filterText: '',
      intrusionLevel: [],
      form: {},
      allIncident: [],
      checkeLists: [],
      inputVisible: false,
      inputValue: '',
      textStyle: {
        fontSize: '14px',
        fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
        fontWeight: 'bold',
        color: '#333333'
      },
      lineBlueStyle: {
        background: 'rgba(30, 86, 160, 1)',
        width: '3px',
        height: '18px'
      },
      isHas: false,
      rules: {
        eventLevel: [
          {
            message: '此为必选项。',
            required: true,
            trigger: 'change'
          }
        ],
        videoLength: {
          required: true,
          message: '此为必填项。',
          trigger: 'change'
        },
        eventInterval: {
          required: true,
          message: '此为必填项。',
          trigger: 'change'
        }
      }
    }
  },
  watch: {
    filterText(val) {
      this.initAlarmEventLists(val)
    },
    checkeLists(newValue) {
      console.log('newValue', newValue)
      console.log('newValue1', newValue)
      let resStepform3 = []
      let resStepform3Obj = {
        eventCode: {},
        eventLevel: 0,
        eventInterval: '',
        enableVideo: 0,
        videoLength: '',
        videoHasAudio: 0,
        enablePhoto: 0
      }
      let array = ['轻微', '中等', '严重', '非常严重']
      if (newValue.length < this.stepform3.length) {
        this.stepform3 = this.stepform3.slice(0, newValue.length)
        this.intrusionLevel = this.intrusionLevel.slice(0, newValue.length)
      } else if (newValue.length > this.stepform3.length) {
        for (let i = 0; i < newValue.length; i++) {
          if (i >= this.stepform3.length) {
            resStepform3Obj.eventCode = newValue[i]
            resStepform3.push(resStepform3Obj)
            this.intrusionLevel.push(array)
          }
        }
        this.stepform3 = this.stepform3.concat(resStepform3)
      } else {
      }
    },
    deep: true
  },
  created() {
    if (Object.keys(Local.get('detailsData')).length > 0) {
      let params = {}
      let params1 = {}
      Local.get('detailsData').alarmSchemeEventRelList.map((item) => {
        params = {
          eventCode: item.eventCode,
          eventLevel: item.eventLevel,

          eventInterval: item.eventInterval,

          videoLength: item.videoLength,

          videoHasAudio: item.videoHasAudio === 1 ? true : false,
          enablePhoto: item.enablePhoto === 1 ? true : false,

          enableVideo: item.enableVideo === 1 ? true : false
        }
        params1 = {
          eventName: item.eventName,
          eventCode: item.eventCode
        }
        this.checkeLists.push(params1)

        this.stepform3.push({ isactive: item.eventLevel, ...params })
        this.intrusionLevel.push(['轻微', '中等', '严重', '非常严重'])
        this.$forceUpdate()
      })

      console.log('this.checkeLists', this.checkeLists, this.stepform3)
    }
  },
  mounted() {
    this.initAlarmEventLists()
  },
  methods: {
    async initAlarmEventLists(val) {
      await getAlarmEventLists({ eventName: val })
        .then((res) => {
          if (res.data.code === 0) {
            this.allIncident = res.data.data
            // let resParams = {}
            // res.data.data.map((item) => {
            //     resParams = {
            //       eventCode: item.eventCode,
            //       eventName: item.eventName
            //     }

            //     this.allIncident.push(resParams)
            //   })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    compareObjectProperties(obj1, obj2) {
      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return Object.keys(obj1).length > Object.keys(obj2).length ? obj1 : obj2
      }
      return obj1
    },
    testChange(val) {
      console.log(val)
      // this.checkeLists=[]
      this.checkeLists = this.removeDuplicates(val)
    },

    removeDuplicates(arr) {
      this.checkeLists = []
      var idSet = {}
      var result = []

      for (var i = 0; i < arr.length; i++) {
        var obj = arr[i]
        var eventCode = obj.eventCode

        if (!idSet[eventCode]) {
          idSet[eventCode] = true
          result.push(obj)
        } else {
          var prevObj = result.find(function (item) {
            return item.eventCode === eventCode
          })

          if (Object.keys(obj).length > Object.keys(prevObj).length) {
            var index = result.indexOf(prevObj)
            result[index] = obj
          }
        }
      }
      console.log('resultresultresultresultresultresultresult', result)
      return result
    },

    showContent() {
      this.isShowImg = false
      this.dialog.show = !this.dialog.show
      if (Object.keys(Local.get('detailsData')).length > 0) {
        this.$nextTick(() => {
          const myDiv = document.getElementsByClassName('allIncident-checkbox')

          this.allIncident.forEach((item1, index) => {
            this.checkeLists.map((item) => {
              if (item.eventCode === item1.eventCode) {
                this.checkeLists = []
                this.checkeLists.push(item1)
                myDiv[index].classList.add('is-checked')
                myDiv[index].firstChild.classList.add('is-checked')
              }
            })
          })
          this.$forceUpdate()
        })
      }
    },
    handleClose(tag) {
      this.checkeLists.splice(this.checkeLists.indexOf(tag), 1)
    },
    handleClose1() {
      this.dialog.show = false
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    submit() {
      console.log(this.checkeLists)
    },
    onclick(index, i) {
      this.stepform3[index].isactive = i
      this.$forceUpdate()
    },
    clickLast() {
      this.$emit('last')
    },
    clickNext() {
      this.$emit('next')
    },
    goback() {
      this.$emit('goback')
    },
    submitStep3() {
      console.log('this.$refs', this.$refs, this.checkeLists)

      const alarmSchemeEventReqList = []

      let params = {}

      this.$refs.stepForm.map((item) => {
        params = {
          eventCode: item.model.eventCode,

          eventLevel: item.model.isactive,

          eventInterval: item.model.eventInterval,

          videoLength: item.model.videoLength,

          videoHasAudio: item.model.videoHasAudio ? 1 : 0,
          enablePhoto: item.model.enablePhoto ? 1 : 0,

          enableVideo: item.model.enableVideo ? 1 : 0
        }
        alarmSchemeEventReqList.push(params)
      })

      this.checkeLists.map((item1, i) => {
        if (this.stepform3[i].isactive && this.stepform3[i].isactive !== '') {
          // this.$refs.stepForm[i].resetFields()

          this.isHas = true
        } else {
          this.isHas = false

          // this.$refs.stepForm[i].resetFields()
          this.$refs.stepForm[i].validate((valid) => {
            if (valid) {
              console.log('stepform3~~~~~~~~', stepform3)
              this.isHas = true

              this.$emit('submitStep')
            }
          })
        }
      })

      const uniqueArr = alarmSchemeEventReqList.filter(
        (item3, index) =>
          alarmSchemeEventReqList.findIndex(
            (i) => i.eventCode === item3.eventCode
          ) === index
      )
      if (this.isHas) {
        this.$emit('stepParams3', uniqueArr)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  text-align: center;
}
.step3-content {
  position: relative;
  min-height: 100%;
  .init-img-div {
    height: 100%;
    .init-img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
  }
  .allIncident-div {
    margin-top: 20px;
    .allIncident-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      .allIncident-checkbox {
        flex-basis: calc(25% - 10px); /* 每个元素占据容器的25%宽度，减去间距 */
        margin-right: 10px;
        margin-bottom: 10px;
        text-align: left;
        margin-left: 50px;
      }
    }
  }
  .init-main {
    margin: 20px;
    .tag-group {
      .tag-group__title {
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #606266;
        display: inline;
        margin-right: 20px;
      }
      .tag-btn {
      }
      .button-new-tag {
        display: inline-block;
        width: 96px;
        height: 32px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        border: 1px dashed #0270ff;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #0270ff;
        text-align: center;
        cursor: pointer;
      }
    }
    .tag-group-content {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
      .box-card {
        flex-basis: calc(33% - 52px);
        // min-width: 504px;
        height: 450px;
        background: #fefefe;
        box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.1);
        border-radius: 4px 4px 4px 4px;
        border: 1px solid rgba(0, 73, 168, 0);
        margin-right: 36px;
        margin-bottom: 20px;
      }
    }
  }

  .btn-lists {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: right;
    padding-right: 24px;
    height: 64px;
    line-height: 64px;
    background: #ffffff;
    box-shadow: 0px -2px 4px 1px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 0px 0px;
    .svg-btn {
      position: relative;
      top: 1px;
      left: -4px;
    }
    .step-btn {
      height: 36px;
      position: relative;
      top: -1px;
    }
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.intrusionLevel-span {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 26px;
  line-height: 26px;
  background: #e4f0ff;
  border-radius: 4px 4px 4px 4px;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  margin-right: 16px;
  text-align: center;
  cursor: pointer;
}
.intrusionLevel1 {
  border: 1px solid #0092e0;
  background: #e4f0ff;
  color: #0092e0;
}
.intrusionLevel2 {
  border: 1px solid #1fad8c;
  background: #f0fffb;
  color: #1fad8c;
}
.intrusionLevel3 {
  border: 1px solid #cd9500;
  background: #fff9ea;
  color: #cd9500;
}
.intrusionLevel4 {
  border: 1px solid #b30000;
  background: #ffeded;
  color: #b30000;
  margin-right: 0px !important;
}
.intrusionLevel_svg {
  position: absolute;
  right: 0px;
  bottom: 0;
  width: 10px;
  height: 9px;
}
.demo-ruleForm {
  // margin-left: -20px;
}
</style>
