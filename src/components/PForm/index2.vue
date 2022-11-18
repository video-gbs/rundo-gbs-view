<!--
* @Author: duminquan
* @Date: 2022-03-23 11:16:23
 * @LastEditors: luojunyao
 * @LastEditTime: 2022-03-25 18:10:43
* @Description: 通用动态表单组件
-->
<template>
  <el-form ref="form" :model="form" :rules="rules" class="p-form">
    <div v-for="(rows, index1) in formats" :key="index1" class="p-form-row">
      <template v-for="(item, index2) in rows">
        <el-form-item v-if="item.show"
                      :key="index2"
                      :label="`${item.label}：`"
                      :prop="item.name"
                      label-width="130px">
          <div class="form-item-warrp" :class="{'front-warrp': item.front ? true : false}" :font-length="item.front? String(item.front.length): ''">
            <div v-if="item.front" class="front">{{ item.front }}</div>
            <el-upload v-if="item.type == 'upload'"
                       :ref="`upload-${item.name}`"
                       class="p-upload"
                       :action="item.name"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :on-exceed="handleExceed"
                       :on-success="handleSuccess"
                       :on-change="handleChange"
                       :limit="item.cover ? (item.limit ? item.limit + 1 : 2) : (item.limit ? item.limit : 999)"
                       :file-list="fileList[item.name]"
                       :auto-upload="true"
                       :show-file-list="true"
                       :multiple="item.multiple"
                       :http-request="handleUpload">
              <el-button size="small" type="upload" @click="chooseFile(item)">{{ item.label }}</el-button>
            </el-upload>
            <el-select v-else-if="item.type === 'select'"
                       v-model="form[item.name]"
                       :placeholder="`请选择${item.label}`">
              <el-option v-for="(op, index3) in $dict(item.dict)"
                         :key="index3"
                         :label="op.value"
                         :value="op.key" />
            </el-select>
            <el-radio-group v-else-if="item.type === 'radio'"
                            v-model="form[item.name]"
                            @change="changeRadio($event, item)">
              <el-radio v-for="(op, index3) in $dict(item.dict)"
                        :key="index3"
                        :label="op.key">{{ op.value }}</el-radio>
            </el-radio-group>
            <el-input v-else-if="item.type == 'textarea'"
                      v-model="form[item.name]"
                      type="textarea"
                      :rows="item.rows"
                      :resize="item.resize ? 'vertical' : 'none'"
                      :placeholder="`请输入${item.label}`" />
            <el-date-picker v-else-if="item.type == 'date'"
                            v-model="form[item.name]"
                            type="date"
                            :value-format="item.format ? item.format : 'yyyy-MM-dd HH:mm:ss'"
                            :picker-options="item.pickerOptions? item.pickerOptions : {}"
                            :placeholder="`请选择${item.label}`" />
            <el-radio-group v-else-if="item.type == 'boolean'"
                            v-model="form[item.name]"
                            @change="changeBoolean($event, item)">
              <el-radio v-for="(itm, idx) in item.radios"
                        :key="idx"
                        :label="itm.label">{{ itm.value }}</el-radio>
            </el-radio-group>
            <el-time-select
              v-else-if="item.type == 'time'"
              v-model="form[item.name]"
              :style="{ width: `${item.inputWdth}px` }"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '23:00'
              }"
              placeholder="选择时间" />
            <span v-else-if="item.type == 'text'">{{ item.format? parseTime(item.value, item.format): item.value }}</span>
            <el-input-number
              v-else-if="item.type == 'number'"
              v-model="form[item.name]"
              :style="{ width: `${item.inputWdth}px` }"
              :min="item.min ? item.min: null"
              :max="item.max ? item.max: Infinity"
              :precision="item.precision? item.precision: 0"
              :controls="false"
            />
            <el-input v-else
                      v-model="form[item.name]"
                      :style="{ width: `${item.inputWdth}px` }"
                      :placeholder="`请输入${item.label}`" />
            <span v-if="item.unit" class="unit">{{ item.unit }}</span>
          </div>
        </el-form-item>
      </template>
    </div>
    <div v-if="periodic && form['isReply'] == 2" class="link">
      <el-link type="primary" :underline="false" @click="initFormData">汇报周期表</el-link>
    </div>
    <div class="p-form-operation">
      <el-button type="blue" size="small" @click="submit">提交</el-button>
    </div>
    <MsgBox
      title="温馨提示"
      :show.sync="showConfirm"
      :show-confirm-btn="true"
      :show-cancel-btn="true"
      @handleConfirm="handleConfirm">
      <div class="confirm">{{ tips }}</div>
    </MsgBox>
    <MsgBox
      title="反馈截止周期表"
      width="400"
      show-confirm-btn
      :show.sync="cycle"
      @handleConfirm="handleSubmit"
    >
      <div class="cycle">
        <div class="cycle-table">
          <div class="cycle-form-row th">
            <div class="cycle-form-item">周期</div>
            <div class="cycle-form-item">截止日期</div>
          </div>
          <div class="cycle-form-container">
            <div
              v-for="(item, index) in cycles"
              :key="index"
              class="cycle-form-row"
            >
              <div class="cycle-form-item">
                <el-input v-model="item.periodName" />
              </div>
              <div class="cycle-form-item">
                <el-date-picker
                  v-model="item.deadtime"
                  type="date"
                  disabled
                  placeholder="选择日期"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MsgBox>
  </el-form>
</template>
<script>
import MsgBox from '@/components/MsgBox'
import { parseTime } from '@/utils'
import { Loading } from 'element-ui'
import { checkSize, checkType } from '@/utils/upload'
export default {
  name: 'PForm',
  components: {
    MsgBox
  },
  props: {
    tips: {
      type: String,
      default: '是否确认提交信息？'
    },
    periodic: {
      type: Boolean,
      default: false
    },
    formats: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {},
      files: {},
      fileList: {},
      cycle: false,
      cycles: [],
      formItem: null,
      hiddenPath: {},
      cycleForm: {
        date: '2022-02-27'
      },
      showConfirm: false,
      deadtimeData: null,
      loading: null,
      uploadCount: 0
    }
  },
  created() {
    const form = {}
    this.formats.forEach((row) => {
      row.forEach((item) => {
        if (!Object.prototype.hasOwnProperty.call(item, 'show')) {
          item.show = true
        }
        if (item.type === 'boolean') {
          item.hidden && item.hidden.split(',').forEach((k) => {
            this.formats.forEach((row1, i1) => {
              row1.forEach((item1, i2) => {
                if (item1.name === k) {
                  this.hiddenPath[k] = [i1, i2]
                }
              })
            })
          })
        }
        if (item.type === 'upload') {
          this.fileList[item.name] = []
          this.files[item.name] = {}
          form[item.name] = item.value ? item.value.split(',') : []
        } else {
          form[item.name] = item.value ? item.value : ''
        }
      })
    })
    this.form = form
  },
  methods: {
    /**
     * 确认按钮
     */
    handleConfirm() {
      this.$emit('submit', this.form)
    },
    /**
     * 初始化周期列表
     */
    initFormData() {
      this.cycles = this.getFormData()
      this.cycle = true
    },
    /**
     * 获取周期表
     */
    getFormData() {
      var cycles = []
      const { firstDeadtime, intervalDadtime, deadtimeCnt } = this.form
      if (!firstDeadtime) {
        this.$message({
          message: '请选择首次汇报截止时间',
          type: 'warning'
        })
        return
      }
      if (!intervalDadtime) {
        this.$message({
          message: '请输入汇报周期间隔',
          type: 'warning'
        })
        return
      }
      if (!deadtimeCnt) {
        this.$message({
          message: '请输入汇报次数',
          type: 'warning'
        })
        return
      }
      // 判断是否存在汇报周期表缓存数据
      let isRefresh = false
      if (this.cycles.length > 0 && this.deadtimeData) {
        for (const key in this.deadtimeData) {
          // 判断首次汇报截至时间、汇报周期间隔、汇报次数是否变更， 存在变更则重新加载汇报周期表数据
          if (this.deadtimeData[key] !== this.form[key]) isRefresh = true
        }
      }
      console.log(this.cycles, isRefresh)
      if (this.cycles.length === 0 || isRefresh) {
        this.deadtimeData = {
          firstDeadtime,
          intervalDadtime,
          deadtimeCnt
        }
        var num = 0
        do {
          const deadtime = this.$utils.getMonthBetween(firstDeadtime, intervalDadtime * num)
          cycles.push({
            periodName: `第${this.$utils.toChinesNum(num + 1)}季度汇报`,
            deadtime,
            periodNumber: num
          })
          num++
        } while (num < deadtimeCnt)
        console.log(cycles)
      } else {
        cycles = this.cycles
      }
      return cycles
    },
    handleSubmit() {
      const { cycles, form } = this
      console.log(cycles)
      console.log(form)
    },

    submit() {
      Object.keys(this.files).forEach((key) => {
        this.form[key] = (Object.values(this.files[key]) || []).join(',')
      })
      if (this.form.remindTime && this.form.remindTime.length == 5) {
        const time = this.form.remindTime + ':00'
        this.form.remindTime = time
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.isReply == 2) {
            this.form.planEndTime = this.form.firstDeadtime
            this.form.periodList = this.getFormData()
          }
          this.showConfirm = true
        } else {
          this.$message({
            message: '提交失败，请检查参数！',
            type: 'warning'
          })
        }
      })
    },
    handleRemove(file, fileList) {
      Object.keys(this.files).forEach((k) => {
        if (this.files[k][file.uid]) {
          delete this.files[k][file.uid]
        }
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    handleChange(file, fileList) {
      if (this.formItem.cover && !this.formItem.limit) {
        this.formItem.limit = 2
      }
      // 超出上传文件限制数量是否覆盖文件
      if (this.formItem.cover && fileList.length > this.formItem.limit - 1) {
        // 上传文件ID列表删除第一个ID
        if (this.files[this.formItem.name][fileList[0].uid]) {
          delete this.files[this.formItem.name][fileList[0].uid]
        }
        // 上传文件列表删除第一个文件
        const limit = this.formItem.limit ? this.formItem.limit - 1 : 1
        this.fileList[this.formItem.name] = fileList.slice(-limit)
        console.log(limit, this.fileList[this.formItem.name])
      } else {
        this.fileList[this.formItem.name] = fileList
      }
    },
    handleExceed(files, fileList) {
      console.log(files, fileList)
      this.$message({
        type: 'warning',
        message: '超出数量限制，请先移除文件'
      })
    },
    beforeRemove(file, fileList) {
      console.log('移除：', file)
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess(res) {
      console.log('上传成功：', res)
    },
    chooseFile(item) {
      this.formItem = item
      console.log('选择了', item)
    },
    // 主题文件上传
    handleUpload(option) {
      const { file } = option
      if (!checkType(file) || !checkSize(file)) {
        const ref = this.$refs[`upload-${option.action}`][0]
        ref.uploadFiles = ref.uploadFiles.filter(item => {
          return item.uid !== file.uid
        })
        return
      }
      if (!this.loading) {
        this.loading = Loading.service({
          text: '上传中……',
          fullscreen: true
        })
      }
      this.uploadCount++
      const forms = new FormData()
      const uid = file.uid
      forms.append('file', file)
      if (!this.files[option.action]) {
        this.files[option.action] = {}
      }
      // kobe
      this.$api.file.upload(forms, {
        type: '3'
      }).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          if (this.formItem && this.formItem.change) {
            this.formItem.change(this.form, file)
          }
          if (option.action == 'docFileId') {
            // this.files[option.action] = {}
            this.files[option.action][uid] = res.data.data.id
          } else {
            this.files[option.action][uid] = res.data.data.id
          }
        } else {
          const ref = this.$refs[`upload-${option.action}`][0]
          ref.uploadFiles = ref.uploadFiles.filter(item => {
            return item.uid !== file.uid
          })
          this.$message({
            type: 'error',
            message: '上传失败'
          })
          this.fileList[option.action] = this.fileList[option.action].filter(
            (f) => {
              return f.uid !== uid
            }
          )
        }
        this.uploadCount--
        if (this.uploadCount <= 0) {
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            this.loading.close()
            this.loading = null
          })
        }
      }).catch(() => {
        const ref = this.$refs[`upload-${option.action}`][0]
        ref.uploadFiles = ref.uploadFiles.filter(item => {
          return item.uid !== file.uid
        })
        this.$message({
          type: 'error',
          message: '上传失败'
        })
        this.fileList[option.action] = this.fileList[option.action].filter(
          (f) => {
            return f.uid !== uid
          }
        )
        this.uploadCount--
        if (this.uploadCount <= 0) {
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            this.loading.close()
            this.loading = null
          })
        }
      })
    },
    changeRadio(value, item) {
      const formats = []
      this.formats.forEach(r => {
        r.forEach(i => {
          if (item.filter.indexOf(i.name) !== -1) {
            formats.push(i)
          }
        })
      })
      item.change && item.change(value, formats)
      this.$forceUpdate()
    },
    changeBoolean(value, item) {
      Object.keys(this.hiddenPath).forEach((k) => {
        if (this.hiddenPath[k]) {
          this.formats[this.hiddenPath[k][0]][this.hiddenPath[k][1]].show =
            value
        }
      })
      this.$forceUpdate()
    },
    parseTime(time, format) {
      return parseTime(time, format)
    }
  }
}
</script>
<style lang="scss">
.confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 120px;
  font-size: 20px;
}
.form-item-warrp {
  width: 100%;
  display: flex;
  align-items: center;
  .unit {
    margin: 0 0 0 5px;
    white-space: nowrap;
  }
  .front {
    margin: 0 5px 0 0;
    white-space: nowrap;
  }
  .el-radio {
    margin: 0 15px 0 0;
  }
  .el-radio-group {
    display: flex;
    height: 40px;
    align-items: center;
}
}
.form-item-warrp.front-warrp[font-length='1'] + .el-form-item__error {
  left: 35px + 14px +5px !important;
}
.form-item-warrp.front-warrp[font-length='2'] + .el-form-item__error {
  left: 35px + 14*2px +5px !important;
}

.link {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 20px;
  .el-link:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 0;
    bottom: 0;
    border-bottom: 1px solid #409eff;
  }
  span {
    font-weight: bold;
  }
}

.cycle {
  margin: 15px;
  height: 400px;
  border-radius: 8px;
  padding: -2px 0 0 -1px;
  border: 1px solid #ccc;
  .cycle-table {
    margin: 10px;
    overflow: hidden;
    color: #fff;
    border: 1px solid #0079e8;
    .th {
      background-color: #0079e8;
    }
    .cycle-form-container {
      height: 335px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .cycle-form-row {
      margin: -1px 0 0 -1px;
      border-bottom: 1px solid #0079e8;
      display: flex;
      .cycle-form-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 50%;
        border-left: 1px solid #0079e8;
      }
    }
  }
}
</style>
