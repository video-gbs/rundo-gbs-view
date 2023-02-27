<template>
  <el-dialog
    width="1000px"
    title="按文件下载"
    :visible="visible"
    custom-class="download-modal"
    @close="handleCloseModal"
  >
    <div class="content">
      <div class="left">
        <el-form ref="form" :model="{ filterDate }" :rules="rules">
          <div class="title">查询条件</div>
          <el-form-item>
            <el-select size="small" v-model="type" placeholder="录像类型">
              <el-option value="device" label="设备录像" />
              <el-option value="cloud" label="云端录像" />
            </el-select>
          </el-form-item>
          <el-form-item prop="filterDate">
            <el-date-picker
              @focus="addEvent"
              popper-class="download-date-picker-popper"
              v-model="filterDate"
              size="small"
              type="daterange"
              range-separator="至"
              :clearable="false"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-button
            @click="handleSearchData()"
            size="small"
            :loading="loading"
            type="primary"
          >
            查询
          </el-button>
        </el-form>
      </div>
      <div class="right">
        <el-table
          stripe
          size="small"
          height="440px"
          v-loading="loading"
          :data="
            videoList.slice(
              pageSize * (currentPage - 1),
              pageSize * currentPage
            )
          "
        >
          <el-table-column label="序号" type="index" width="60">
            <template #default="scope">
              <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="文件名称"
            min-width="150"
            show-overflow-tooltip
          >
            <template #default="scope">
              <span>{{ getFileName(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" prop="startTime" width="150" />
          <el-table-column label="结束时间" prop="endTime" width="150" />
          <el-table-column label="文件大小" width="100" align="center">
            <template #default="scope">
              <span>{{
                scope.row.fileSize ? `${scope.row.fileSize}MB` : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" type="index" width="80" align="center">
            <template #default="scope">
              <el-button
                v-if="
                  !downloadingList.includes(
                    `${deviceId}_${channelId}_${scope.row.startTime}_${scope.row.endTime}`
                  )
                "
                type="text"
                class="download-button"
                @click="handleDownload(scope.row)"
              >
                下载
              </el-button>
              <el-button
                v-else
                class="disabled-btn"
                type="text"
                :disabled="true"
              >
                下载中
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          :total="videoList.length"
        >
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment'
// import DownloadService from "../../service/DownloadService";
const pageSize = 20
export const TYPE = {
  CLOUD: 'cloud',
  DEVICE: 'device'
}

const rules = {
  filterDate: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (moment(value[1]).diff(value[0], 'days', true) > 3) {
          callback('搜索录像日期不能超过3天')
        } else {
          callback()
        }
      }
    }
  ]
}

export default {
  name: 'DownloadVideoModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defaultType: {
      type: String,
      default: 'cloud'
    },
    deviceId: String,
    channelId: String,
    id: [String, Number],
    defaultDate: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    }
  },
  data() {
    return {
      videoList: [],
      loading: false,
      type: this.defaultType,
      currentType: this.defaultType,
      filterDate: [new Date(this.defaultDate), new Date(this.defaultDate)],
      currentPage: 1,
      pageSize,
      rules,
      downloadingList: []
    }
  },
  mounted() {
    if (this.type === TYPE.CLOUD) {
      this.getCloudRecordVideo()
    } else {
      this.getDeviceRecordList()
    }
  },
  methods: {
    // 设备录像查询
    getDeviceRecordList() {
      this.$axios
        .get(`/api/gb_record/query/${this.deviceId}/${this.channelId}`, {
          params: {
            startTime: moment(this.filterDate[0]).format('YYYY-MM-DD 00:00:00'),
            endTime: moment(this.filterDate[1]).format('YYYY-MM-DD 23:59:59')
          }
        })
        .then(
          ({
            data: {
              data: { recordList }
            }
          }) => {
            this.videoList = recordList || []
          }
        )
        .finally(() => {
          this.loading = false
        })
    },

    // 通知后端下载设备录像

    /**
     * 为日期选择添加监听事件，用于获取变化的月份
     * @returns {Promise<void>}
     */
    async addEvent() {
      await this.$nextTick()
      this.monthChange()
      if (this.setClick) return

      document
        .querySelectorAll(
          '.download-date-picker-popper .el-date-range-picker__header button'
        )
        .forEach((item) =>
          item.addEventListener('click', () => {
            this.monthChange()
          })
        )
      this.setClick = true
    },
    /**
     * 月份改变
     */
    monthChange() {
      //只能查询云端视频日期数据
      document
        .querySelectorAll(
          '.download-date-picker-popper .el-picker-panel__content .el-date-table .data-picker-true'
        )
        .forEach((item) => {
          item.className = item.className.replace('data-picker-true', '')
        })

      if (this.type === 'cloud') {
        this.$nextTick(() => {
          const yearAndMonths = []
          document
            .querySelectorAll(
              '.download-date-picker-popper .el-date-range-picker__header'
            )
            .forEach((item) => {
              const [year, yearUnit, month] = item.innerText.split(' ')
              yearAndMonths.push([year, month.padStart(2, '0')])
            })

          yearAndMonths.map(this.getDateInMoth)
        })
      }
    },
    /**
     * 用年月获取存在数据的日子
     * @param val 数组[年,月]
     */
    getDateInMoth(val) {
      this.$axios({
        method: 'get',
        url: '/api/record/info/device/month',
        params: {
          year: val[0],
          month: val[1],
          deviceChannelId: this.id
        }
      })
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.length > 0) {
              this.setHaveVideoDate(res.data.data)
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //设置当前有录像日期样式
    setHaveVideoDate(dates) {
      document
        .querySelectorAll(
          '.download-date-picker-popper .el-picker-panel__content'
        )
        .forEach((item) => {
          const [year, yearUnit, month] = item
            .querySelector('.el-date-range-picker__header')
            .innerText.split(' ')
          const yearAndMonthString = `${year}-${month.padStart(2, '0')}`
          item
            .querySelectorAll(
              '.el-picker-panel__content .el-date-table .available'
            )
            .forEach((dateDom) => {
              if (
                dates.includes(
                  yearAndMonthString + '-' + dateDom.innerText.padStart(2, '0')
                )
              ) {
                dateDom.className = ~dateDom.className.indexOf(
                  'data-picker-true'
                )
                  ? dateDom.className
                  : dateDom.className + ' data-picker-true'
              }
            })
        })
    },
    getFileName(data) {
      return this.currentType === TYPE.CLOUD
        ? data.recordUrl.split('/').reverse()[0].split('.')[0]
        : `${data.startTime.replace(/.*\s/, '').replaceAll(':', '-')}`
    },
    handleDownload(data) {
      this.$message.info('正在下载，请勿关闭浏览器！')
      if (this.currentType === TYPE.CLOUD) {
        this.fileDownloadFun(
          data.recordUrl,
          `${this.getFileName(data)}.${data.recordUrl.replace(/.*\./, '')}`
        )
      } else {
        this.downloadingList.push(
          `${this.deviceId}_${this.channelId}_${data.startTime}_${data.endTime}`
        )
        this.downloadingList = this.downloadingList.slice()
        // DownloadService.serviceDownloadRecord(this.deviceId, this.channelId, data.startTime, data.endTime, 4)
      }
    },
    handleSearchData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.currentType = this.type
          this.loading = true
          this.videoList = []
          if (this.type === TYPE.CLOUD) {
            this.getCloudRecordVideo()
          } else {
            this.getDeviceRecordList()
          }
        }
      })
    },
    /**
     * 获取某日全部录像文件
     * @param callback
     */
    getCloudRecordVideo() {
      this.$axios({
        method: 'get',
        url: `/api/record/info/device/data`,
        params: {
          startDate: moment(this.filterDate[0]).format('YYYY-MM-DD'),
          endDate: moment(this.filterDate[1]).format('YYYY-MM-DD'),
          deviceChannelId: this.id
        }
      })
        .then((res) => {
          if (res.data.data && res.data.data.length) {
            this.videoList = res.data.data
          }
        })
        .finally((error) => {
          this.loading = false
        })
    },

    fileDownloadFun(fileUrl, fileName) {
      if ('undefined' == typeof fileUrl || !fileUrl) {
        alert('文件路径不能为空')
        return false
      }
      // 发送http请求，将文件链接转换成文件流
      fileAjaxFun(
        fileUrl,
        function (xhr) {
          downloadFun(xhr.response, fileName)
        },
        {
          responseType: 'blob'
        }
      )
      // 发起请求
      function fileAjaxFun(url, callback, options) {
        let xhr = new XMLHttpRequest()
        xhr.open('get', url, true)
        if (options.responseType) {
          xhr.responseType = options.responseType
        }
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr)
          }
        }
        xhr.send()
      }
      // 进行下载
      function downloadFun(content, filename) {
        window.URL = window.URL || window.webkitURL
        let a = document.createElement('a')
        let blob = new Blob([content])
        // 通过二进制文件创建url
        let url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = filename
        a.click()
        // 销毁创建的url
        window.URL.revokeObjectURL(url)
      }
    },
    // 关闭弹窗
    handleCloseModal() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .download-modal {
  .el-dialog__body {
    padding: 24px 16px !important;
  }

  .el-dialog__header {
    padding: 6px 20px;
    text-align: left;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.05);

    .el-dialog__title {
      font-size: 12px;
      font-weight: bold;
      color: #000000;
    }

    button {
      top: 9px;
    }
  }

  .content {
    display: flex;

    .left {
      width: 250px;
      padding-right: 32px;

      .el-button,
      .el-select,
      .el-input,
      .el-form-item {
        width: 100%;
      }

      .title {
        text-align: left;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 14px;
      }

      .el-date-editor--daterange {
        width: 100% !important;
      }
    }

    .right {
      width: 400px;
      flex: auto;

      .download-button {
        padding: 0;
      }
      .disabled-btn {
        cursor: not-allowed;
      }
    }
  }
}

::v-deep .download-date-picker-popper {
  ::v-deep .data-picker-true:after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background-color: #606060;
    border-radius: 4px;
    left: 45%;
    top: 74%;
  }
}
</style>
