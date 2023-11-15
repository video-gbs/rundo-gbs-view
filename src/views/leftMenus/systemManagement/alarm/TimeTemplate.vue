<template>
  <div class="dataDictionary_container" v-if="isShow">
    <div class="panel-header-box">
      <div class="panel-header-box-border">时间模板</div>
    </div>

    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="120px"
      >
        <el-form-item label="模板名称:">
          <el-input
            v-model="searchParams.templateName"
            placeholder="请输入"
            clearable
            style="width: 240px"
          ></el-input>
        </el-form-item>

        <el-form-item
          style="float: right; margin-right: 20px"
          class="form-btn-list"
        >
          <el-button @click="resetData($event)"
            ><svg-icon class="svg-btn" icon-class="cz" />
            <span class="btn-span">重置</span></el-button
          >
          <el-button type="primary" @click="cxData"
            ><svg-icon class="svg-btn" icon-class="cx" />
            <span class="btn-span">搜索</span></el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <div class="securityArea_container">
        <div class="btn-lists">
          <el-button
            v-permission="['/timer-utils/template/add', 2]"
            type="primary"
            @click="dialogShow(1)"
            ><svg-icon class="svg-btn" icon-class="add" /><span class="btn-span"
              >新建</span
            ></el-button
          >
          <el-button
            v-permission="['/timer-utils/template/delete', 4]"
            @click="deteleAll($event)"
            style="width: 100px"
            plain
          >
            <svg-icon class="svg-btn" icon-class="del" />
            <span class="btn-span">批量删除</span>
          </el-button>
        </div>
      </div>
      <el-table
        ref="timeTemTable"
        :data="tableData"
        style="width: 100%"
        class="dataDictionary-table"
        border
        :header-cell-style="{
          background: '#F4F9FF',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
          fontWeight: 'bold',
          color: '#333333'
        }"
      >
        <el-table-column
          type="selection"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column
          prop="templateName"
          label="模板名称"
          width="450"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="dateTypeStrList"
          label="模板详情"
          :formatter="planDetailFormatter"
        />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="修改时间" width="180" />
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <!-- v-permission="['/rbac/dict/update', 3]" -->
            <el-button
              v-permission="['/timer-utils/template/update', 3]"
              type="text"
              @click="dialogShow(0, scope.row)"
              ><span class="table-button-span">编辑</span></el-button
            >
            <el-button
              v-permission="['/timer-utils/template/delete', 4]"
              type="text"
              @click="deleteRole(scope.row)"
              ><span class="table-button-span delete-button"
                >删除</span
              ></el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pages-data="params"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <el-dialog
      v-if="dialog.show"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="950px"
      top="100px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div style="display: flex; justify-content: space-between">
          <div style="font-weight: bold">
            {{ isEdit ? '编辑时间模板' : '新建时间模板' }}
          </div>
        </div>
      </div>
      <el-form
        ref="accountForm"
        label-width="140px"
        :rules="rules"
        :model="dialog.params"
      >
        <el-form-item
          label="模板名称"
          prop="templateName"
          class="time-template"
        >
          <el-input
            class="item-input"
            v-model="dialog.params.templateName"
            clearable
            style="width: 340px"
          ></el-input>
        </el-form-item>

        <el-form-item label="配置预案开启时段"> </el-form-item>

        <div class="timeSlider-container">
          <div
            class="timeslider-box"
            id="timeSlider1"
            onselectstart="return false;"
          >
            <label class="label-week">星期一</label>
          </div>

          <div
            class="timeslider-box"
            id="timeSlider2"
            onselectstart="return false;"
          >
            <label class="label-week">星期二</label>
          </div>

          <div
            class="timeslider-box"
            id="timeSlider3"
            onselectstart="return false;"
          >
            <label class="label-week">星期三</label>
          </div>

          <div
            class="timeslider-box"
            id="timeSlider4"
            onselectstart="return false;"
          >
            <label class="label-week">星期四</label>
          </div>

          <div
            class="timeslider-box"
            id="timeSlider5"
            onselectstart="return false;"
          >
            <label class="label-week">星期五</label>
          </div>

          <div
            class="timeslider-box"
            id="timeSlider6"
            onselectstart="return false;"
          >
            <label class="label-week">星期六</label>
          </div>

          <div
            class="timeslider-box"
            id="timeSlider7"
            onselectstart="return false;"
          >
            <label class="label-week">星期日</label>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit('accountForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- <TimeTest /> -->
  </div>
</template>

<script>
import {
  getTemplateAlarmEventLists,
  addTemplateAlarmEvent,
  editTemplateAlarmEvent,
  deleteTemplateAlarmEvent
} from '@/api/method/alarm'
import pagination from '@/components/Pagination/index.vue'
import '../../../../../static/js/timeSlider/timeSlider'
import '../../../../../static/css/timeSlider.css'
import '../../../../../static/css/normalize.css'
import TimeTest from './components/TimeTest.vue'
export default {
  name: '',
  components: { pagination, TimeTest },
  data() {
    const checkName = (rule, value, cb) => {
      const regName = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/
      if (
        value === '' ||
        value === null ||
        value !== undefined ||
        value.length === 0
      ) {
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
    return {
      isShow: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      isEdit: false,
      formData: {
        templateName: null
      },
      tableData: [],
      dialog: {
        show: false,
        title: '新建',
        params: {
          templateName: '',
          timePeriodList: []
        }
      },
      searchParams: {
        templateName: ''
      },
      rules: {
        templateName: {
          required: true,
          max: 32,
          validator: checkName,
          trigger: 'blur'
        }
      },
      roleId: '',
      buttonLoading: false,
      treeData: [],
      timeSliderList: {
        initState: false,
        timeS1: null,
        timeS2: null,
        timeS3: null,
        timeS4: null,
        timeS5: null,
        timeS6: null,
        timeS7: null
      },
      timeMergeList: []
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.getList()
    },
    cxData() {
      this.getList()
    },
    planDetailFormatter(row) {
      if (row.dateTypeStrList && row.dateTypeStrList.length > 0) {
        let result = ''
        row.dateTypeStrList.forEach((type, index) => {
          switch (index + 1) {
            case 1:
              result += `${type}、`
              break
            case 2:
              result += `${type}、`
              break
            case 3:
              result += `${type}、`
              break
            case 4:
              result += `${type}、`
              break
            case 5:
              result += `${type}、`
              break
            case 6:
              result += `${type}、`
              break
            case 7:
              result += `${type}、`
              break
            default:
              break
          }
        })
        return result.substring(0, result.length - 1)
      }
    },
    resetData(e) {
      this.searchParams = {
        templateName: ''
      }
      let target = e.target
      if (target.nodeName === 'SPAN' || target.nodeName === 'svg') {
        target = e.target.parentNode.parentNode
      } else if (target.nodeName === 'user') {
        target = e.target.parentNode.parentNode.parentNode
      } else {
        target = e.target
      }
      target.blur()
      this.params.pageNum = 1
      this.getList()
    },
    isShowChildren(data) {
      return data.find((res) => {
        return res.childs.length !== 0
      })
    },
    dialogShow(act, data) {
      this.dialog.params = {
        templateName: null,
        timePeriodList: []
      }
      if (act === 0) {
        this.isEdit = true
        this.editId = data.id
        this.dialog.params = Object.assign({}, data, {
          templateName: data.templateName,
          timePeriodList: data.timePeriodDtoList
        })
        console.log('this.dialog.params', this.dialog.params)
      }
      this.dialog.title = act ? '新建' : '编辑'
      this.dialog.show = !this.dialog.show
      this.$nextTick(() => {
        this.initTimeSlider()
        if (data && data.timePeriodDtoList) {
          this.planTimeListToTimeSlider(data.timePeriodDtoList)
        }
      })
    },
    /**
     * 将计划时间段转化为时间滑块时间
     * @param timePeriodDtoList
     */
    planTimeListToTimeSlider(timePeriodDtoList) {
      let time1Array = []
      let time2Array = []
      let time3Array = []
      let time4Array = []
      let time5Array = []
      let time6Array = []
      let time7Array = []
      timePeriodDtoList.forEach((planTime) => {
        let endTimeSplit = planTime.endTime.split(':')
        let startTimeSplit = planTime.startTime.split(':')
        let endTime = endTimeSplit[0] + ':' + endTimeSplit[1]
        let startTime = startTimeSplit[0] + ':' + startTimeSplit[1]
        if (planTime.isNextDay === 1) {
          endTime = '24:00'
        }
        let scopeTime = startTime + '-' + endTime
        switch (planTime.dateType) {
          case 1:
            time1Array.push(scopeTime)
            break
          case 2:
            time2Array.push(scopeTime)
            break
          case 3:
            time3Array.push(scopeTime)
            break
          case 4:
            time4Array.push(scopeTime)
            break
          case 5:
            time5Array.push(scopeTime)
            break
          case 6:
            time6Array.push(scopeTime)
            break
          case 7:
            time7Array.push(scopeTime)
            break
          default:
            break
        }
      })
      this.timeSliderList.timeS1.set({ setTimeArray: time1Array })
      this.timeSliderList.timeS2.set({ setTimeArray: time2Array })
      this.timeSliderList.timeS3.set({ setTimeArray: time3Array })
      this.timeSliderList.timeS4.set({ setTimeArray: time4Array })
      this.timeSliderList.timeS5.set({ setTimeArray: time5Array })
      this.timeSliderList.timeS6.set({ setTimeArray: time6Array })
      this.timeSliderList.timeS7.set({ setTimeArray: time7Array })
    },

    /**
     * 将时间滑块时间转化为计划时间
     */
    timeSliderToPlanTimeList() {
      this.dialog.params.timePeriodList = []

      this.timeSliderList.timeS1.get().times.forEach((item) => {
        this.createPlanTime(item)
      })
      this.convertPlanTime(1)

      this.timeSliderList.timeS2.get().times.forEach((item) => {
        this.createPlanTime(item)
      })
      this.convertPlanTime(2)

      this.timeSliderList.timeS3.get().times.forEach((item) => {
        this.createPlanTime(item)
      })
      this.convertPlanTime(3)

      this.timeSliderList.timeS4.get().times.forEach((item) => {
        this.createPlanTime(item)
      })
      this.convertPlanTime(4)

      this.timeSliderList.timeS5.get().times.forEach((item) => {
        this.createPlanTime(item)
      })
      this.convertPlanTime(5)

      this.timeSliderList.timeS6.get().times.forEach((item) => {
        this.createPlanTime(item)
      })
      this.convertPlanTime(6)

      this.timeSliderList.timeS7.get().times.forEach((item) => {
        this.createPlanTime(item)
      })
      this.convertPlanTime(7)
    },
    /**
     * 创建录像计划时间
     * @param time
     */
    createPlanTime(time) {
      console.log('time~~~~~~~', time)
      let startTimeAndEndTime = time.split('-')
      let newStartTime = startTimeAndEndTime[0]
      if (newStartTime.length < 6) {
        newStartTime += ':00'
      }

      let newEndTime = startTimeAndEndTime[1]
      if (newEndTime.length < 6) {
        newEndTime += ':00'
      }
      let isNextDay = 0
      if (newEndTime.split(':')[0] === '24') {
        newEndTime = '23:59:00'
        isNextDay = 1
      }

      let isNeedMerge = false
      this.timeMergeList.forEach((item) => {
        if (item.endTime === newStartTime) {
          item.endTime = newEndTime
          isNeedMerge = true
        } else if (item.startTime === newEndTime) {
          item.startTime = newStartTime
          isNeedMerge = true
        }
      })
      if (!isNeedMerge) {
        this.timeMergeList.push({
          startTime: newStartTime,
          endTime: newEndTime,
          isNextDay: isNextDay
        })
      }
    },
    /**
     * 将时间段添加到传输List
     */
    convertPlanTime(type) {
      this.timeMergeList.forEach((item) => {
        this.dialog.params.timePeriodList.push({
          dateType: type,
          startTime: item.startTime,
          endTime: item.endTime,
          isNextDay: item.isNextDay
        })
      })
      this.timeMergeList = []
    },
    handleClose(done) {
      done()
    },
    permissionHandleClose(done) {
      done()
    },
    async getList() {
      await getTemplateAlarmEventLists({
        num: this.params.pageSize,
        page: this.params.pageNum,
        ...this.searchParams
      })
        .then((res) => {
          if (res && res.data.code === 0) {
            this.tableData = res.data.data.list
            this.params.total = res.data.data.total
            this.params.pages = res.data.data.pages
            this.params.current = res.data.data.pageSize
            setTimeout(() => {
              this.isShow = true
            }, 500)
          }
        })
        .catch((error) => console.log(error))
    },
    deteleAll(e) {
      let target = e.target
      if (target.nodeName === 'SPAN' || target.nodeName === 'svg') {
        target = e.target.parentNode.parentNode
      } else if (target.nodeName === 'user') {
        target = e.target.parentNode.parentNode.parentNode
      } else {
        target = e.target
      }
      target.blur()
      this.$confirm('删除后数据无法恢复，是否确认全部删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const roleIds = []
        this.$refs.timeTemTable.selection.map((item) => {
          roleIds.push(item.id)
        })
        deleteTemplateAlarmEvent(roleIds).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.getList()
          }
        })
      })
    },
    deleteRole(row) {
      this.$confirm(` 是否删除模板"${row.templateName}" ？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTemplateAlarmEvent([row.id]).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.getList()
          }
        })
      })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let resData = []
          const resTimePeriodList = []

          let params1 = {}
          Object.values(this.timeSliderList).map((item, index) => {
            if (index !== 0) {
              resData.push(item)
            }
          })
          // console.log('resData', resData)
          resData.forEach((itemFirst) => {
            if (itemFirst.startTimeArray.length > 0) {
              itemFirst.startTimeArray.map((childFirst) => {
                let bool = itemFirst.stopTimeArray.findIndex((it) => {
                  return childFirst === it
                })
                if (bool !== -1) {
                  itemFirst.startTimeArray = [itemFirst.startTimeArray[0]]
                  itemFirst.stopTimeArray = [itemFirst.stopTimeArray[1]]
                } else {
                }
              })
            }
          })
          // console.log('resData~~~~~~~~~~~', resData)
          resData.forEach((item1) => {
            if (item1.startTimeArray.length > 0) {
              item1.startTimeArray.map((child, index) => {
                params1 = {
                  startTime: `${child}:00`,
                  dateType: item1.timeSliderNums,
                  endTime:
                    item1.stopTimeArray[index] === '24:00'
                      ? '23:59:59'
                      : `${item1.stopTimeArray[index]}:59`
                }

                resTimePeriodList.push(params1)
              })
            }
          })
          // return
          switch (this.dialog.title) {
            case '新建':
              addTemplateAlarmEvent({
                timePeriodList: resTimePeriodList,
                templateName: this.dialog.params.templateName
              }).then((res) => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新建成功'
                  })
                  this.dialog.show = false
                  this.getList()
                }
              })
              break
            case '编辑':
              this.timeSliderToPlanTimeList()
              editTemplateAlarmEvent({
                templateId: this.editId,
                templateName: this.dialog.params.templateName,
                timePeriodList: resTimePeriodList
              }).then((res) => {
                if (res.data.code === 0) {
                  this.$message.success('编辑成功')
                  this.dialog.show = false
                  this.getList()
                }
              })
              break

            default:
              break
          }
        }
      })
    },
    /**
     * 初始化时间段选择工具
     */
    initTimeSlider() {
      this.timeSliderList.initState = true
      this.timeSliderList.timeS1 = new TimeSlider({
        mountedId: 'timeSlider1',
        language: 'cn',
        defaultOneTimeBlockTime: 30,
        minBlockTime: 1,
        allInit: true
      })

      console.log('this.timeSliderListthis.timeSliderList', this.timeSliderList)

      this.timeSliderList.timeS2 = new TimeSlider({
        mountedId: 'timeSlider2',
        language: 'cn',
        defaultOneTimeBlockTime: 30,
        minBlockTime: 1
      })

      this.timeSliderList.timeS3 = new TimeSlider({
        mountedId: 'timeSlider3',
        language: 'cn',
        defaultOneTimeBlockTime: 30,
        minBlockTime: 1
      })

      this.timeSliderList.timeS4 = new TimeSlider({
        mountedId: 'timeSlider4',
        language: 'cn',
        defaultOneTimeBlockTime: 30,
        minBlockTime: 1
      })

      this.timeSliderList.timeS5 = new TimeSlider({
        mountedId: 'timeSlider5',
        language: 'cn',
        defaultOneTimeBlockTime: 30,
        minBlockTime: 1
      })

      this.timeSliderList.timeS6 = new TimeSlider({
        mountedId: 'timeSlider6',
        language: 'cn',
        defaultOneTimeBlockTime: 30,
        minBlockTime: 1
      })

      this.timeSliderList.timeS7 = new TimeSlider({
        mountedId: 'timeSlider7',
        language: 'cn',
        defaultOneTimeBlockTime: 30,
        minBlockTime: 1
      })

      console.log('this.timeSliderListthis.timeSliderList', this.timeSliderList)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table::before {
  height: 0 !important;
}
::v-deep .time-template {
  margin-left: -60px;
}
::v-deep .el-table--border {
  border-bottom: 1px solid #eaeaea;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #eaeaea;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #eaeaea;
}

::v-deep .dataDictionary-table .el-table__fixed-right {
  height: 100% !important;
}
// ::v-deep .el-table--enable-row-transition {
//   height: 100% !important;
// }
// ::v-deep .el-table::before {
//   height: 0;
// }
// 滚动条大小设置
::v-deep .dataDictionary-table::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .dataDictionary-table::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .dataDictionary-table::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .dataDictionary-table::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
.dataDictionary_container {
  width: 100%;
  .panel-header-box {
    margin: 0;
    padding: 0 16px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    .panel-header-box-border {
      border-top: 1px solid #eaeaea;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #011f53;
    }
  }

  .search {
    width: calc(100% - 40px);
    height: 80px;
    margin: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .search-form {
      position: relative;
      top: 60%;
      transform: translate(0%, -50%);
    }
  }
  .table-list {
    margin: 20px;
    padding: 16px 20px 20px 20px;
    background: #ffffff;
    height: calc(100% - 240px);
    -webkit-box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
    box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
    border-radius: 2px;
    .dataDictionary-table {
      height: calc(100% - 100px);
      overflow-y: auto;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
    }
    .securityArea_container {
      margin-bottom: 20px;
      .btn-lists {
        float: right;
        margin-bottom: 17px;
        .btn-span {
          position: relative;
          top: -2px;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
        }
        .svg-btn {
          position: relative;
          top: -1px;
          left: -6px;
        }
        .el-button {
          width: 80px;
          height: 32px;
        }
      }
    }
  }
}

.el-input {
  width: 100%;
}

.params-form {
  .el-input,
  .el-select {
    width: 100%;
    margin-right: 30px;
  }
}
.password-level-box {
  height: 28px !important;
  width: 100px;
  .password-level {
    height: 10px;
    width: 100px;

    > div {
      height: inherit;
      width: 33%;
      border: 1px solid #eee;
      margin-right: 5px;

      &:last-child {
        margin-right: 0px;
      }
    }
  }
}

.form-btn-list {
  .btn-span {
    position: relative;
    top: -1px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
  }
  .svg-btn {
    position: relative;
    top: -1px;
    left: -6px;
  }
}
.table-button-span {
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
}
.delete-button {
  color: red !important;
}

.page-main {
  background: $mainBg;
  .main-operation {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $mainBg;
    .title {
      padding-left: 20px;
      position: relative;
    }
  }

  .main-content {
    background: #fff;
    .perms-tree {
      .tree-title {
        height: 56px;
        line-height: 56px;
        background: rgba(245, 245, 245, 0.39);
        display: flex;
        .title {
          width: 120px;
          font-size: 14px;
          text-align: center;
          &:last-child {
            flex: 1;
          }
        }
      }
      .tree-item {
        display: flex;
        .item-title {
          width: 120px;
          // height: 56px;
          line-height: 24px;
          font-size: 14px;
          text-align: center;
          padding: 12px;
          white-space: nowrap;
        }
        .item-children {
          flex: 1;
        }
      }
      .item-border {
        // border-bottom: 1px solid #CCCCCC;
        border-bottom: 1px solid #ebeef5;
      }
      .tree-operation {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        padding: 12px;
        display: flex;
        margin-left: 140px;
      }
      .tree-empty {
        line-height: 24px;
        padding: 12px;
        text-align: center;
        color: #909399;
      }
    }
  }
}
.perms-operation {
  margin-right: 20px;
}
.button-back {
  margin-right: 20px;
}
::v-deep .el-table::before {
  height: 0;
}
::v-deep div {
  box-sizing: unset;
}
.dialogRelation {
  display: flex;
  flex-wrap: wrap;
}
.marginR {
  margin: 0 16px 16px 0;
}
</style>
