<template>
  <div class="step1-content">
    <div class="table-list">
      <el-table
        ref="timeTemTable"
        :data="tableData"
        style="width: 100%"
        class="dataDictionary-table"
        border
        :header-cell-style="{
          background: 'rgba(0, 75, 173, 0.06)',
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
        <el-table-column prop="templateName" label="模板名称" />
        <el-table-column
          prop="dateTypeStrList"
          label="模板详情"
          width="350"
          :formatter="planDetailFormatter"
        />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <!-- v-permission="['/rbac/dict/update', 3]" -->
            <el-button type="text" @click="dialogShow(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pages-data="params"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <div class="btn-lists">
        <!-- <div style="float: right"> -->
        <el-button @click="goback">返回</el-button>
        <el-button type="primary" @click="clickNext">下一步</el-button>
        <!-- </div> -->
      </div>
    </div>

    <el-dialog
      v-if="dialog.show"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="950px"
      :before-close="handleClose"
    >
      <el-form
        :model="dialog.params"
        ref="accountForm"
        style="overflow-x: auto"
      >
        <el-form-item
          label="模板名称"
          :rules="[
            { required: true, message: '模板名称不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            class="item-input"
            v-model="dialog.params.templateName"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="配置预案开启时段"> </el-form-item>

        <div class="timeSlider-container disabled-div">
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
    </el-dialog>
  </div>
</template>

<script>
import { getTemplateAlarmEventLists } from '@/api/method/alarm'
import pagination from '@/components/Pagination/index.vue'
import '../../../../../../static/js/timeSlider/timeSlider'
import '../../../../../../static/css/timeSlider.css'
import '../../../../../../static/css/normalize.css'
export default {
  name: '',
  components: { pagination },
  props: [
    'treeList',
    'manufacturerTypeOptions',
    'transportProtocolTypeOptions'
  ],
  data() {
    return {
      templateName: '',
      tableData: [],
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dialog: {
        show: false,
        title: '时间模板',
        params: {
          templateName: '',
          timePeriodList: []
        }
      },
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
      timeMergeList: [],
      editId: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      await getTemplateAlarmEventLists({
        num: this.params.pageSize,
        page: this.params.pageNum
      })
        .then((res) => {
          if (res && res.data.code === 0) {
            this.tableData = res.data.data.list
            this.params.total = res.data.data.total
            this.params.pages = res.data.data.pages
            this.params.current = res.data.data.pageSize
          }
        })
        .catch((error) => console.log(error))
    },
    dialogShow(data) {
      this.dialog.params = {
        templateName: null,
        timePeriodList: []
      }
      this.editId = data.id
      this.dialog.params = Object.assign({}, data, {
        templateName: data.templateName,
        timePeriodList: data.timePeriodDtoList
      })
      this.dialog.show = !this.dialog.show
      this.$nextTick(() => {
        this.initTimeSlider()
        if (data.timePeriodDtoList) {
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
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.getList()
    },
    clickNext() {
      this.$emit('next')
    },
    goback() {
      this.$emit('goback')
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
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep div {
  box-sizing: unset;
}
.table-list {
  margin: 20px;
  padding: 20px;
  background: #ffffff;
  height: calc(100% - 200px);
  .dataDictionary-table {
    max-height: calc(100% - 100px);
    overflow-y: auto;
  }
  .btn-lists {
    text-align: right;
    margin-top: 10px;
  }
}
.disabled-div {
  pointer-events: none;
}
</style>
