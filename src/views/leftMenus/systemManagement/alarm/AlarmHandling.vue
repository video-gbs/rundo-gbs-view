<template>
  <div class="alarmHandling_container" v-if="isShow">
    <!-- <div class="panel-header-box">
        <div class="panel-header-box-border">告警处理</div>
      </div> -->
    <div class="main-content">
      <div class="securityArea_container">
        <div class="tree-content">
          <el-input
            placeholder="请输入搜索关键字"
            suffix-icon="el-icon-search"
            class="search-input"
            v-model="filterText"
            clearable
          ></el-input>
          <div class="operation_box">
            <el-tree
              ref="alarmTree"
              :data="treeList"
              class="tree"
              :props="{
                children: 'childList',
                label: 'resourceName'
              }"
              :default-expanded-keys="['根节点']"
              :current-node-key="resCurrentKey"
              node-key="id"
              highlight-current
              @node-expand="handleNodeClick"
              :filter-node-method="filterNode"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>
                  <svg-icon
                    v-if="data.resourceType === 1"
                    icon-class="tree1"
                    class="tree1"
                  />
                  <svg-icon
                    v-else
                    :icon-class="getIconType(data)"
                    class="tree2"
                  />
                  {{ data.resourceName }}
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="right-table">
        <div class="encoder-content" ref="appRef">
          <div class="search">
            <el-form
              ref="query"
              class="search-form"
              :inline="true"
              :model="searchParams"
              label-width="100px"
            >
              <el-form-item label="告警类型:">
                <el-select
                  v-model="searchParams.alarmDesc"
                  class="mr10"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="obj in allIncident"
                    :key="obj.id"
                    :label="obj"
                    :value="obj"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="告警时间:">
                <el-date-picker
                  v-model="searchParams.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
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

          <div class="table-content">
            <div class="btn-lists">
              <el-button @click="deteleAll($event)" style="width: 100px" plain>
                <svg-icon class="svg-btn" icon-class="del" />
                <span class="btn-span">批量删除</span>
              </el-button>
            </div>

            <el-table
              ref="alarmTable"
              class="encoder-table"
              :data="tableData"
              border
              :header-cell-style="{
                background: 'rgba(0, 75, 173, 0.06)',
                fontSize: '14px',
                fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
                fontWeight: 'bold',
                color: '#333333'
              }"
              v-loading="tableLoading"
              element-loading-text="加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="#fff"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="80" align="center">
              </el-table-column>
              <el-table-column
                type="index"
                width="50"
                align="center"
                label="序号"
              >
              </el-table-column>
              <el-table-column
                prop="channelName"
                label="通道名称"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="channelId"
                label="通道编号"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="deviceName"
                label="设备名称"
                :show-overflow-tooltip="true"
              />

              <el-table-column prop="alarmLevel" label="告警级别" width="120">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.alarmLevel === '1'"
                    class="font-span1"
                    style="margin-left: 10px"
                  >
                    <span class="yuan yuan1"></span>轻微</span
                  >
                  <span
                    v-else-if="scope.row.alarmLevel === '2'"
                    class="font-span2"
                    style="margin-left: 10px"
                  >
                    <span class="yuan yuan2"></span>中等</span
                  >
                  <span
                    v-else-if="scope.row.alarmLevel === '3'"
                    class="font-span3"
                    style="margin-left: 10px"
                  >
                    <span class="yuan yuan3"></span>严重</span
                  >
                  <span v-else style="margin-left: 10px" class="font-span4">
                    <span class="yuan yuan4"></span>非常严重</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="alarmDesc"
                label="告警描述"
                width="100"
                :show-overflow-tooltip="true"
              >
                <!-- <template slot-scope="scope">
                  <span>{{ getStatusText(scope.row.alarmDesc) }}</span>
                </template> -->
              </el-table-column>

              <el-table-column
                prop="alarmStartTime"
                label="告警时间"
                width="140"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="imageState"
                label="图片生成状态"
                width="160"
                :formatter="alarmImageStateStateFormatter"
              >
              </el-table-column>
              <el-table-column
                prop="videoState"
                label="视频生成状态"
                width="160"
                :formatter="alarmVideoStateFormatter"
              >
              </el-table-column>
              <el-table-column width="200" label="操作">
                <template slot-scope="scope">
                  <!-- v-permission="['/rbac/dict/update', 3]" -->
                  <el-button
                    type="text"
                    @click="playAlarm(scope.row)"
                    v-if="scope.row.videoState === 3"
                    >播放
                  </el-button>

                  <!-- @click="register(scope.row)" -->
                  <!-- <el-button
                    type="text"
                    v-else-if="scope.row.videoState === -1"
                    @click="playAlarm(scope.row)"
                    >重新录制
                  </el-button> -->
                  <el-button
                    type="text"
                    v-if="scope.row.videoState === 3"
                    @click="down(scope.row, scope.$index, '视频')"
                    >下载视频</el-button
                  >
                  <el-button type="text" v-if="scope.row.imageState === 3"
                    ><a :href="scope.row.imageUrl" download target="_blank"
                      >下载图片</a
                    ></el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.imageState === 3"
                    @click="handlePreView(scope.row)"
                    ><span>预览图片</span></el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.imageState === -1"
                    @click="alarmRecover(scope.row, 1)"
                    >恢复图片</el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.videoState === -1"
                    @click="alarmRecover(scope.row, 2)"
                    >恢复视频</el-button
                  >
                  <el-button type="text" @click="deleteRole(scope.row)"
                    ><span class="delete-button">删除</span></el-button
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
        </div>
      </div>
    </div>
    <div class="image__preview">
      <el-dialog
        title="正在预览图片"
        :visible.sync="showImagePreview"
        width="70%"
        top="100px"
        custom-class="formDialog"
        style="text-align: left"
      >
        <el-image :src="url" :preview-src-list="srcList" style="margin: 0 auto">
        </el-image>
      </el-dialog>
    </div>

    <div class="nowPlayVideo">
      <el-dialog
        title="正在播放视频"
        :visible.sync="playVideoVisible"
        width="70%"
        top="100px"
        custom-class="formDialog"
        style="text-align: left"
        :before-close="handleClose"
      >
        <player ref="videoPlayer" :videoUrl="videoUrl" autoplay live></player>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getAlarmMsg,
  deleteNorthAlarmEvent,
  getAlarmEventLists,
  getAlarmRecover
} from '@/api/method/alarm'
import { playVideoAreaListRecord } from '@/api/method/live'

import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import pagination from '@/components/Pagination/index.vue'
import LineFont from '@/components/LineFont'
import { getChannelPlayList } from '@/api/method/live'

import { getGroupDictLists } from '@/api/method/dictionary'
import player from './components/liveqing.vue'
import { Local } from '@/utils/storage'
export default {
  name: '',
  components: { pagination, leftTree, LineFont, player },
  data() {
    return {
      showImagePreview: false,
      srcList: [
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      ],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      isShow: true,
      templateName: '',
      areaNames: 'resourceName',
      treeList: [],
      initData: [],
      tableLoading: false,
      resCurrentKey: '',
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      // optionsList: [
      //   {
      //     label: '轻微',
      //     value: 1
      //   },
      //   {
      //     label: '中等',
      //     value: 2
      //   },
      //   {
      //     label: '严重',
      //     value: 3
      //   },
      //   {
      //     label: '非常严重',
      //     value: 4
      //   }
      // ],
      lineTitle: {
        title: '移动位置',
        notShowSmallTitle: false
      },
      lineTitle1: {
        title: '选择编码器',
        notShowSmallTitle: false
      },
      textStyle: {
        fontSize: '18px',
        fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
        fontWeight: 'bold',
        color: '#333333'
      },
      lineBlueStyle: {
        background: 'rgba(30, 86, 160, 1)',
        width: '3px',
        height: '18px'
      },
      searchParams: {
        alarmDesc: '',
        time: ''
      },
      query: {},
      deviceTypesOptionsList: [],
      checked: false,
      dialogTableData: [],
      tableData: [],
      areaNames: 'resourceName',
      idList: [],
      dialogResourceValue: '',
      resId: '',
      resArray: [],
      filterText: '',
      detailsId: [],
      playVideoVisible: false,
      videoUrl: '',
      allIncident: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.alarmTree.filter(val)
    },
    treeList(n) {
      this.treeList = n
    }
  },
  mounted() {
    this.initTree()
    this.initAlarmEventLists()
    this.initList()
  },
  methods: {
    async initTree() {
      await playVideoAreaListRecord()
        .then((res) => {
          if (res.data.code === 0) {
            this.treeList = [res.data.data]
            this.initData = [res.data.data]
            this.$nextTick(() => {
              this.$refs.alarmTree.setCurrentKey(res.data.data.id)
              this.resCurrentKey = res.data.data.id
              this.$forceUpdate()
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async initAlarmEventLists() {
      await getAlarmEventLists()
        .then((res) => {
          if (res.data.code === 0) {
            this.allIncident = res.data.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleClose(done) {
      this.videoUrl = ''
      done()
    },
    handlePreView(row) {
      // // this.currentImageUrl = row.imageUrl
      // this.srcList = [require(`${row.imageUrl}`)]
      this.srcList = []
      this.srcList.push(row.imageUrl)
      this.url = ''
      this.url = row.imageUrl
      this.showImagePreview = true
      // window.open(row.imageUrl, '_blank')
    },
    closePreview() {
      this.showImagePreview = false
    },
    getStatusText(status) {
      const option = this.allIncident.find((option) => option === status)
      return option ? option : ''
    },
    async initList(id) {
      const startTime = this.searchParams.time ? this.searchParams.time[0] : ''
      const endTime = this.searchParams.time ? this.searchParams.time[1] : ''
      await getAlarmMsg({
        num: this.params.pageSize,
        page: this.params.pageNum,
        channelId: id,
        alarmDesc: this.searchParams.alarmDesc,
        startTime,
        endTime
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.list
            this.params.total = res.data.data.total
            this.params.pages = res.data.data.pages
            this.params.current = res.data.data.current
          } else {
          }
        })
        .catch(() => {})
    },

    filterNode(value, data) {
      if (!value) return true
      return data.resourceName && data.resourceName.indexOf(value) !== -1
      // }
    },
    domHandleClick(item, previousElementSibling, isClick) {
      if (!isClick) {
        this.handleNodeClick(item, '', '', true, previousElementSibling)
      } else {
      }
    },
    recursionTreeData(data) {
      this.$nextTick(() => {
        setTimeout(() => {
          const testDom = document.getElementsByClassName('custom-tree-node')

          data.forEach((item1) => {
            if (
              item1.childList !== null &&
              typeof item1.childList !== 'undefined' &&
              item1.childList.length === 0 &&
              Number(item1.resourceNum) > 0
            ) {
              for (let i = 0; i < testDom.length; i++) {
                const currentNode = testDom[i]

                // 获取子节点列表
                const childNodes = currentNode.childNodes

                for (let j = 0; j < childNodes.length; j++) {
                  const childNode = childNodes[j]
                  if (childNode.nodeType === Node.ELEMENT_NODE) {
                    // 确保子节点是元素节点
                    const innerText = childNode.innerText // 获取子节点的内部文本

                    if (item1.resourceName.trim() === innerText.trim()) {
                      // 获取上一个元素兄弟节点
                      let previousElementSibling =
                        currentNode.previousElementSibling

                      // 遍历上一个元素兄弟节点，直到找到上一个<span>标签或遍历完所有兄弟节点
                      while (
                        previousElementSibling &&
                        previousElementSibling.tagName.toLowerCase() !== 'span'
                      ) {
                        previousElementSibling =
                          previousElementSibling.previousElementSibling
                      }

                      if (
                        previousElementSibling &&
                        previousElementSibling.tagName.toLowerCase() === 'span'
                      ) {
                        // 在这里可以对上一个<span>标签进行处理
                        console.log('!!!!!!!!', previousElementSibling)
                        previousElementSibling.classList.remove('is-leaf')
                        previousElementSibling.addEventListener(
                          'click',
                          this.domHandleClick(
                            item1,
                            previousElementSibling,
                            false
                          )
                        )
                      } else {
                        // console.log('当前节点没有上一个<span>标签')
                      }
                    }
                  }
                }
              }
            } else {
              this.recursionTreeData(item1.childList || [])
            }
          })
        }, 0)
      })
    },
    async handleNodeClick(data, node, self) {
      this.recursionTreeData(data.childList || [])

      if (!data.hasOwnProperty('onlineState')) {
        this.resArray = []
        if (this.detailsId.indexOf(data.id) !== -1) {
          return
        } else {
          await getChannelPlayList(data.id)
            .then((res) => {
              if (res.data.code === 0) {
                if (res.data.data && res.data.data.length > 0) {
                  res.data.data.map((item) => {
                    this.resArray.push({
                      onlineState: item.onlineState,
                      resourceName: item.channelName,
                      resourceNames: item.channelName,
                      areaPid: item.channelId,
                      id: item.id,
                      ptzType: item.ptzType
                      // childList: []
                    })
                  })

                  this.detailsId.push(data.id)
                  let arr = []
                  if (data.id === '1') {
                    arr = this.resArray.concat(this.initData[0].childList)
                  } else {
                    arr = data.childList
                      ? this.resArray.concat(data.childList)
                      : this.resArray

                    const obj = {}
                    arr = arr.reduce((item, next) => {
                      obj[next.id]
                        ? ''
                        : (obj[next.id] = true && item.push(next))
                      return item
                    }, [])
                  }
                  this.recursionTreeData(arr)
                  this.$refs.alarmTree.updateKeyChildren(data.id, arr)
                }
              }
            })
            .catch((error) => {})
        }
      } else {
        if (!data.hasOwnProperty('childList')) {
          this.resId = data.areaPid
          this.initList(data.areaPid)
        }
      }
    },
    getIconType(data) {
      if (data.level) {
        return 'tree2'
      } else {
        switch (data.ptzType) {
          case 1:
            if (data.onlineState === 0) {
              return 'qiangjilx'
            } else {
              return 'qiangjizx'
            }
            break
          case 2:
            if (data.onlineState === 0) {
              return 'qjlx'
            } else {
              return 'qjzx'
            }
            break
          case 3:
            if (data.onlineState === 0) {
              return 'bqlx'
            } else {
              return 'bqzx'
            }
            break
          case 4:
            if (data.onlineState === 0) {
              return 'ytqjlx'
            } else {
              return 'ytqjzx'
            }
            break
          case 5:
            if (data.onlineState === 0) {
              return 'arqjlx'
            } else {
              return 'arqjzx'
            }
            break
          case 6:
            if (data.onlineState === 0) {
              return 'quanjinglx'
            } else {
              return 'quanjingzx'
            }
            break
          case 7:
          case 0:
            if (data.onlineState === 0) {
              return 'qitalx'
            } else {
              return 'qitazx'
            }
            break
          default:
            break
        }
      }
    },
    down(row, index, type) {
      var xhr = new XMLHttpRequest()
      let url = ''
      if (type === '视频') {
        url = row.videoUrl
      } else if (type === '图片') {
        url = row.imageUrl
      }
      xhr.open('GET', url, true)
      xhr.responseType = 'arraybuffer' // 返回类型blob
      xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let blob = this.response
          // 转换一个blob链接
          // 注: URL.createObjectURL() 静态方法会创建一个 DOMString(DOMString 是一个UTF-16字符串)，
          // 其中包含一个表示参数中给出的对象的URL。这个URL的生命周期和创建它的窗口中的document绑定
          let downLoadUrl = ''
          if (type === '视频') {
            downLoadUrl = window.URL.createObjectURL(
              new Blob([blob], {
                type: 'video/mp4'
              })
            )
          } else if (type === '图片') {
            downLoadUrl = url
          }
          // 视频的type是video/mp4，图片是image/jpeg
          // 01.创建a标签
          let a = document.createElement('a')
          // 02.给a标签的属性download设定名称
          a.download = row.channelName
          // 03.设置下载的文件名
          a.href = downLoadUrl
          // 04.对a标签做一个隐藏处理
          a.style.display = 'none'
          // 05.向文档中添加a标签
          document.body.appendChild(a)
          // 06.启动点击事件
          a.click()
          // 07.下载完毕删除此标签
          a.remove()
        }
      }
      xhr.send()
    },
    playAlarm(row) {
      this.playVideoVisible = true
      this.videoUrl = row.videoUrl
    },
    async alarmRecover(row, type) {
      await getAlarmRecover({
        alarmMsgId: row.id,
        alarmFileType: type
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.initList(this.resId)
          }
        })
        .catch(() => {})
    },

    deleteRole(row) {
      this.$confirm('删除后不可恢复，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNorthAlarmEvent([row.id]).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.initList(this.resId)
          }
        })
      })
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
        // console.log('this.$refs.encoderTable.selection',this.$refs)
        this.$refs.alarmTable.selection.map((item) => {
          roleIds.push(item.id)
        })
        deleteNorthAlarmEvent(roleIds).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.initList(this.resId)
          }
        })
      })
    },
    alarmImageStateStateFormatter(row) {
      switch (row.imageState) {
        case -1:
          return '失败'
        case 0:
          return '持续中'
        case 1:
          return '等待中'
        case 2:
          return '生成中'
        case 3:
          return '成功'
        default:
          return '待配置'
      }
    },
    alarmVideoStateFormatter(row) {
      switch (row.videoState) {
        case -1:
          return '失败'
        case 0:
          return '持续中'
        case 1:
          return '等待中'
        case 2:
          return '生成中'
        case 3:
          return '成功'
        default:
          return '待配置'
      }
    },

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
    clickLast() {
      this.$emit('last')
    },
    clickNext() {
      this.$emit('next')
    },
    goback() {
      this.$emit('goback')
    },
    async getDeviceTypesDictionaryList() {
      await getGroupDictLists('DeviceTypes').then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.itemValue
            this.deviceTypesOptionsList.push(obj)
          })
        }
      })
    },
    handleSelectionChange(data) {
      const resName = []
      this.idList = []
      if (data && data.length > 0) {
        data.map((item) => {
          this.idList.push(item.id)
          resName.push(item.name)
        })
        this.dialogForm.num = data.length
        this.dialogForm.dialogEquipmentName = resName.join(';')
      }
    },
    changeOrganization() {
      this.initList(this.resId)
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.initList(this.resId)
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.initList(this.resId)
    },
    deploymentData() {
      this.dialogShow1 = true
    },
    resetData(e) {
      this.searchParams = {
        alarmDesc: '',
        time: ''
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
      this.resId = ''
      this.initList(this.resId)
      this.$refs.alarmTree.setCurrentKey(this.treeList[0].id)
      this.resCurrentKey = this.treeList[0].id
    },
    cxData() {
      this.initList(this.resId)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;
  display: flex;
  // justify-content: space-between;
  .securityArea_container {
    height: calc(100% - 40px);
    width: 310px;
    margin: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    .btn-lists {
      display: flex;
      justify-content: space-between;
      padding: 10px 10px 0 10px;
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
        width: 70px;
        height: 32px;
      }
      .sort_div {
        display: inline-block;
        line-height: 32px;
        white-space: nowrap;
        text-align: center;
        cursor: pointer;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        width: 70px;
        height: 32px;
        .btn-span {
          position: relative;
          top: -2px;
          font-size: 14px;
          color: #606266;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
        }
        .svg-btn {
          position: relative;
          top: 1px;
          left: -6px;
        }
      }
      .clicked-button {
        border: 1px solid #0270ff !important;
        .btn-span {
          color: #0270ff !important;
        }
      }
    }
  }
  .right-table {
    width: calc(100% - 310px);
    height: calc(100% - 16px);
    margin: 6px 0 0 -20px;
    position: relative;
    .table-content {
      width: 100%;
      height: calc(100% - 75px);
      .pane-content {
        width: 100%;
        height: 100%;
      }
    }
  }
}

::v-deep .el-table::before {
  height: 0 !important;
}
::v-deep .el-table--border {
  border-bottom: 1px solid #eaeaea;
}
::v-deep .el-dialog__body {
  padding-bottom: 0;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}

// ::v-deep .encoder-table .el-table__fixed-right {
//   height: 100% !important;
// }
::v-deep .el-table--enable-row-transition {
  // height: 100% !important;
}
// ::v-deep .el-table::before {
//   height: 0;
// }

// 滚动条大小设置
::v-deep .encoder-table::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .encoder-table::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .encoder-table::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .encoder-table::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
.image__preview {
  width: 800px;
  height: 800px;
}

.encoder-content {
  height: 100%;
  width: 100%;
  padding: 12px 20px 26px 20px;
  .search {
    width: 100%;
    // min-height: 80px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .search-form {
      padding-top: 25px;
    }
  }
  .table-content {
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 17px;
    width: 100%;
    height: calc(100% - 96px);
    margin-top: 16px;
    .btn-lists {
      float: right;
      margin-bottom: 10px;
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
    .encoder-table {
      max-height: calc(100% - 145px);
      overflow-y: auto;
    }
  }
  .delete-button {
    color: red !important;
  }
  .yuan {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .font-span1 {
    color: #0092e0;
  }
  .yuan1 {
    background: #0092e0;
    margin-right: 12px;
  }
  .font-span2 {
    color: #1fad8c;
  }
  .yuan2 {
    background: #1fad8c;
    margin-right: 12px;
  }
  .font-span3 {
    color: #cd9500;
  }
  .yuan3 {
    background: #cd9500;
    margin-right: 12px;
  }
  .font-span4 {
    color: #b30000;
  }
  .yuan4 {
    background: #b30000;
    margin-right: 12px;
  }

  .securityArea_container {
    height: 500px;
    width: 310px;
    margin: 10px;
    // background: #ffffff;
    // box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
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
.svg-btn {
  position: relative;
  top: 1px;
}

.alarmHandling_container {
  width: 100%;
}
::v-deep .nowPlayVideo {
  .el-dialog__title {
    font-size: 16px;
    font-weight: bolder;
  }
}
::v-deep .nowPlayVideo {
  .el-dialog__header {
    padding: 16px 24px;
  }
}
::v-deep .image__preview {
  .el-dialog__title {
    font-size: 16px;
    font-weight: bolder;
  }
}
::v-deep .image__preview {
  .el-dialog__header {
    padding: 16px 24px;
  }
}
::v-deep .nowPlayVideo {
  .el-dialog__body {
    padding: 24px 24px 22px;
    /*border: #e4e7ed solid 1px;*/
  }
}
::v-deep .image__preview {
  .el-dialog__body {
    padding: 24px 24px 22px;
    /*border: #e4e7ed solid 1px;*/
  }
}

::v-deep .tree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  // margin:6px;
}
// 没有展开且有子节点
::v-deep .tree .el-icon-caret-right:before {
  background: url('~@/assets/imgs/treeOpen.png') no-repeat 0 0;
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  position: relative;
  top: 1px;
}
// 已经展开且有子节点
::v-deep .tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  background: url('~@/assets/imgs/treeClose.png') no-repeat 0 0;
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  position: relative;
  top: 1px;
}
// 没有子节点
::v-deep .tree .el-tree-node__expand-icon.is-leaf::before {
  // background: url("~@/assets/imgs/tree+.png") no-repeat 0 3px;
  content: '';
  display: none;
  width: 8px;
  height: 8px;
}
</style>
