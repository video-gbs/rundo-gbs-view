<template>
  <div class="recordView" style="height: 100%; width: 100%">
    <el-container style="height: 100%">
      <el-main
        style="display: flex; flex-direction: column"
        class="monitoring-content-box"
      >
        <div style="display: flex; flex-direction: row; height: 100%">
          <div class="left-tree" v-show="isShowMenu">
            <div class="equipment-group-wrapper-top">
              <el-tabs v-model="activeTab" class="real-time-monitoring">
                <el-tab-pane label="安防通道分组" name="equipmentGroup">
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
                          ref="recordViewTree"
                          :data="treeList"
                          class="tree"
                          :props="{
                            children: 'children',
                            label: 'areaNames'
                          }"
                          default-expand-all
                          :default-expanded-keys="['根节点']"
                          :expand-on-click-node="false"
                          node-key="id"
                          highlight-current
                          @node-click="handleNodeClick"
                          :filter-node-method="filterNode"
                        >
                          <span
                            slot-scope="{ node, data }"
                            class="custom-tree-node"
                          >
                            <span>
                              <svg-icon
                                v-if="data.level === 1"
                                icon-class="tree1"
                                class="tree1"
                              />
                              <svg-icon
                                v-else-if="
                                  data.level === 2 ||
                                  data.level === 3 ||
                                  data.level === 4
                                "
                                icon-class="tree2"
                                class="tree2"
                              />
                              <svg-icon
                                v-else
                                icon-class="tree3"
                                class="tree3"
                              />
                              {{ data.orgName || data.areaName }}
                            </span>
                          </span>
                        </el-tree>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="equipment-group-wrapper-bottom">
              <div class="date-select">
                <!-- <el-select
                  size="small"
                  v-model="formData.type"
                  placeholder="录像类型"
                  style="margin-left: 16px !important"
                >
                  <el-option value="device" label="设备录像" />
                  <el-option value="cloud" label="云端录像" />
                </el-select>-->

                <!-- :disabled="!selData.isLeaf" -->
                <el-button
                  @click="handleSearch"
                  type="primary"
                  size="small"
                  :loading="formData.loading"
                  style="float: right; margin: 16px 16px 0 0 !important"
                  >查询</el-button
                >

                <el-date-picker
                  @focus="addEvent"
                  popper-class="form-date-picker-popper"
                  size="small"
                  class="date"
                  v-model="formData.date"
                  type="date"
                  :clearable="false"
                  :picker-options="cloudDateOptions"
                  placeholder="请选择日期"
                />
              </div>
            </div>
          </div>
          <div
            class="player-container"
            id="recordPlayerLayout"
            :style="`margin-left:${isShowMenu ? '' : '16px'}`"
          >
            <div
              class="player-box playerBox"
              @dblclick.capture.stop
              @click="handleClickPlayer($event)"
              @mousewheel="handleMouseWheel($event)"
              :class="{
                show: tabsActiveName === 'device',
                'zoom-in': isZoom === ZOOM_TYPE.in,
                'zoom-out': isZoom === ZOOM_TYPE.out
              }"
            >
              <div v-loading="timeChangeLoading">
                <cloud-player
                  ref="devicesPlayer"
                  v-if="videoUrl"
                  :stretch="isFill ? true : false"
                  :onChangePlayTime="handleChangeCurrentTime"
                  :onPlayEnded="handleDevicesPlayEnded"
                  :onError="handleDevicesPlayEnded"
                  :onPlay="handleOnPlay"
                  :onPause="handleOnPause"
                  :videoStyle="`transform: translate(${zoomStyle.translateX}px , ${zoomStyle.translateY}px) scale(${zoomStyle.scale});`"
                  :videoUrl="videoUrl"
                  :playbackRate="speedArr[currentSpeed]"
                  :autoplay="play"
                  live
                ></cloud-player>
              </div>
              <div
                class="not-player"
                v-if="!videoHistory.searchHistoryResult.length && !videoUrl"
              >
                <img src="../../../../assets/imgs/player_error.png" />
              </div>
              <div class="player-header">
                <span class="head-left">视频播放</span>
                <div class="head-right">
                  <i class="el-icon-close" @click="handleCloseVideo"></i>
                </div>
              </div>
            </div>
            <!-- 云端录像 -->
            <div
              class="player-box playerBox"
              @dblclick.capture.stop
              @mousewheel="handleMouseWheel($event)"
              @click="handleClickPlayer($event)"
              :class="{
                show: tabsActiveName === 'cloud',
                'zoom-in': isZoom === ZOOM_TYPE.in,
                'zoom-out': isZoom === ZOOM_TYPE.out
              }"
            >
              <cloud-player
                ref="cloudPlayer"
                :stretch="isFill"
                v-if="cloudPlayerUrl"
                :onChangePlayTime="handleChangeCurrentTime"
                :onPlayEnded="handleDevicesPlayEnded"
                :onPlay="handleOnPlay"
                :muted="isMuted"
                :onPause="handleOnPause"
                @dblclick.capture.stop
                :videoStyle="`transform: translate(${zoomStyle.translateX}px , ${zoomStyle.translateY}px) scale(${zoomStyle.scale});`"
                :videoUrl="cloudPlayerUrl"
                :playbackRate="speedArr[currentSpeed]"
                :autoplay="play"
                live
              ></cloud-player>
              <div class="not-player" v-else>
                <img src="../../../../assets/imgs/player_error.png" />
              </div>
            </div>
            <!-- 时间进度条 -->
            <div class="player-time">
              <!-- 设备录像 -->
              <template v-if="tabsActiveName === 'device'">
                <TimePlayer
                  ref="TimePlayer"
                  v-model="playTime"
                  :onChange="handleChangePlayTime"
                  :delay="500"
                  :is-current-date="true"
                  :onChangeDate="handleChangePlayDate"
                  :dataSource="deviceVideoList"
                />
              </template>
              <!-- 云端录像 -->
              <template v-else>
                <div class="player-option-box">
                  <TimePlayer
                    ref="TimePlayer"
                    v-model="cloudPlayTime"
                    :is-current-date="true"
                    :onChange="handleChangeCloudPlayTime"
                    :onChangeDate="handleChangePlayDate"
                    :dataSource="cloudVideoList"
                  />
                </div>
              </template>
            </div>
            <div class="player-toolbar">
              <div class="toolbar-left">
                <el-tooltip
                  effect="dark"
                  :content="isShowMenu ? '收起' : '展开'"
                  placement="top"
                >
                  <i
                    :class="
                      'hidden-menu-icon ' +
                      (isShowMenu ? 'el-icon-s-fold' : 'el-icon-s-unfold')
                    "
                    @click="handleHiddenMenu()"
                  ></i>
                </el-tooltip>
                <span class="parting-line" />
                <el-tooltip
                  effect="dark"
                  :content="isMuted ? '关闭声音' : '开启声音'"
                  placement="top"
                >
                  <i
                    :class="isMuted ? 'icon-wuyinliang' : 'icon-yinliang'"
                    @click="handleSetVolume()"
                  />
                </el-tooltip>
                <el-tooltip effect="dark" content="截屏" placement="top">
                  <i class="icon-jieping" @click="handleScreenShot()" />
                </el-tooltip>
                <el-tooltip effect="dark" content="下载" placement="top">
                  <i
                    :class="`icon-xiazai ${channelId ? '' : 'disabled'}`"
                    @click="handleDownload()"
                  />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  :content="isShowStream ? '显示码流信息' : '隐藏码流信息'"
                  placement="top"
                >
                  <i
                    :class="`icon-xianshimaliuxinxi ${
                      isShowStream ? 'active' : ''
                    }`"
                    @click="handleShowStream()"
                  />
                </el-tooltip>
              </div>
              <div class="tool-center">
                <el-tooltip effect="dark" content="关闭视频" placement="top">
                  <i class="close-video" @click="handleCloseVideo" />
                </el-tooltip>

                <el-time-picker
                  class="toolbar-date-picker"
                  prefixIcon="data-picker-icon"
                  :clearable="false"
                  v-model="selectTime"
                  :disabled="timePickerDisabled()"
                  @change="handleChangeTimePicker"
                />

                <el-tooltip
                  effect="dark"
                  :content="play ? '暂停' : '播放'"
                  placement="top"
                >
                  <div
                    @click="handlePauseOrPlay()"
                    :class="`play-btn ${play ? 'pause' : 'play'} ${
                      !cloudPlayerUrl && !videoUrl ? 'disabled' : ''
                    }`"
                  />
                </el-tooltip>
                <div class="speed-box">
                  <el-tooltip effect="dark" content="减速" placement="top">
                    <span
                      @click="handleChangeSpeed('sub')"
                      :class="`speed-icon speed-down ${
                        !currentSpeed ? 'disabled' : ''
                      }`"
                    />
                  </el-tooltip>
                  <span class="speed-text">{{ speedArr[currentSpeed] }}x</span>
                  <el-tooltip effect="dark" content="快进" placement="top">
                    <span
                      @click="handleChangeSpeed('plus')"
                      :class="`speed-icon speed-up ${
                        currentSpeed === speedArr.length - 1 ? 'disabled' : ''
                      }`"
                    />
                  </el-tooltip>
                </div>
              </div>
              <div class="tool-right">
                <el-tooltip effect="dark" content="放大/缩小" placement="top">
                  <i
                    :class="`iconfont icon-fangda ${isZoom ? 'active' : ''}`"
                    @click="handleZoom(ZOOM_TYPE.in)"
                  />
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  :content="isFill ? '拉伸' : '自适应'"
                  placement="top"
                >
                  <i
                    @click="handleChangeFill"
                    :class="`iconfont icon-zishiying ${isFill ? 'active' : ''}`"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  :content="isFullScreen ? '退出全屏' : '全屏'"
                  placement="top"
                >
                  <i
                    @click="toogleFullScreen"
                    class="iconfont"
                    :class="
                      isFullScreen ? 'icon-tuichuquanping' : 'icon-quanping'
                    "
                  ></i>
                </el-tooltip>
              </div>
            </div>

            <div class="trank" v-if="isShowStream">
              <p
                v-if="tracksNotLoaded"
                style="text-align: center; padding-top: 3rem"
              >
                暂无数据
              </p>
              <div
                :key="index"
                v-for="(item, index) in tracks"
                style="width: 50%; float: left"
                loading
              >
                <span>流 {{ index }}</span>
                <div class="trankInfo" v-if="item.codec_type == 0">
                  <p>格式: {{ item.codec_id_name }}</p>
                  <p>类型: 视频</p>
                  <p>分辨率: {{ item.width }} x {{ item.height }}</p>
                  <p>帧率: {{ item.fps }}</p>
                </div>
                <div class="trankInfo" v-if="item.codec_type == 1">
                  <p>格式: {{ item.codec_id_name }}</p>
                  <p>类型: 音频</p>
                  <p>采样位数: {{ item.sample_bit }}</p>
                  <p>采样率: {{ item.sample_rate }}</p>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <DownloadVideoModal
      v-if="downloadModalVisible"
      :visible.sync="downloadModalVisible"
      :defaultType="tabsActiveName"
      :deviceId="deviceId"
      :id="id"
      :channelId="channelId"
      :defaultDate="
        (tabsActiveName === 'device' ? playTime : cloudPlayTime).format(
          'YYYY-MM-DD'
        )
      "
    />
  </div>
</template>

<script>
import moment from 'moment'
import jPlayer from '../recordComponents/jessibuca.vue'
import cloudPlayer from '../recordComponents/cloudPlayer.vue'
import TimePlayer from '../recordComponents/TimePlayer.vue'
import MonitorEquipmentGroup from './monitorEquipmentGroup'
import DownloadVideoModal from '../recordComponents/DownloadVideoModal'
import { getVideoAraeTree } from '@/api/method/role'
import { getPlaybackList } from '@/api/method/moduleManagement'
import { getPlayBackUrlLists, getChannelPlayList } from '@/api/method/live'

// import flvJs from './flvJs'
const ZOOM_TYPE = {
  in: 'in',
  out: 'out'
}

export default {
  name: 'recordView',
  components: {
    jPlayer,
    cloudPlayer,
    TimePlayer,
    // flvJs,
    MonitorEquipmentGroup,
    DownloadVideoModal
  },
  data() {
    return {
      filterText: '',
      treeList: [],
      activeTab: 'equipmentGroup',
      detailsId: [],
      datePickerPlayTime: new Date(new Date().setHours(0, 0, 0, 0)),
      isShowMenu: true,
      downloadModalVisible: false,
      playTime: moment().startOf('days'),
      deviceVideoList: {}, //录像视频
      play: false,
      currentList: '',
      skipTime: 0, //拖拽时间
      streamId: '',
      cloudVideoList: {}, //云端设备录像
      datePickerCloudPlayTime: new Date(new Date().setHours(0, 0, 0, 0)),
      cloudPlayTime: moment().startOf('days'),
      currentCloudList: '',
      isMuted: true, //音量
      isFill: false, //是否拉伸视频
      isShowStream: false, //是否显示码流
      tracks: [],
      cloudPlay: false,
      isZoom: false, //放大缩小类型
      id: null,
      zoomStyle: {
        scale: 1,
        translateX: 0,
        translateY: 0
      },
      selectTime: new Date().setHours(0, 0, 0, 0),
      isDragging: false, //拖拽中
      ZOOM_TYPE: ZOOM_TYPE,
      recordStartTime: null,
      cloudRecordStartTime: null,
      toolDateTime: new Date(),
      dateValue: new Date(),
      // cloundDateValue: new Date(),
      tabsActiveName: this.$route.params.type || 'device',
      formData: {
        type: '',
        date: new Date(),
        loading: false
      },
      deviceId: this.$route.params.deviceId,
      channelId: '',
      selData: {},
      // recordsLoading: false,
      // mediaServerObj: new MediaServer(),
      mediaServerObj: '',
      hasAudio: false,
      videoUrl: '',
      detailFiles: [],
      mediaServerId: '',
      videoHistory: {
        date: '',
        searchHistoryResult: [] //媒体流历史记录搜索结果
      },
      cloudSliderMIn: 0,
      cloudSliderMax: 86400,
      playTimeHasRecords: [],
      speedArr: [0.25, 0.5, 1.0, 2.0, 4.0],
      currentSpeed: 2,
      isFullScreen: false,
      recordFile: {
        app: '',
        stream: ''
      },
      mediaServerPath: '', // 录像path http + 域名+端口
      cloudPlayerUrl: '',
      cloudData: [],
      recordVideoData: [],
      timeChangeLoading: false,
      cloudDateOptions: {
        // 云端录像日期选择器格式
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      dateFilesObj: {},
      filerData: {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        }
      },
      showBackBtn: false,

      //缓存通道管理页面的数据
      SchannelId: this.$route.params.SchannelId,
      SchannelName: this.$route.params.SchannelName,
      // count: appStore.channelSearch.,
      SdeviceId: this.$route.params.SdeviceId,
      SdeviceName: this.$route.params.SdeviceName,
      SincludeEquipment: this.$route.params.SincludeEquipment,
      Sip: this.$route.params.Sip,
      Sstatus: this.$route.params.Sstatus,
      SselectedNode: this.$route.params.SselectedNode
        ? this.$route.params.SselectedNode
        : 1, // 选中的节点
      ischannel: this.$route.params.SselectedNode
        ? this.$route.params.SselectedNode
        : 0,
      ScurrentPage: this.$route.params.ScurrentPage
    }
  },
  watch: {
    treeList(n) {
      this.treeList = n
    }
  },

  mounted() {
    this.init()

    document.addEventListener('fullscreenchange', (e) => {
      // 监听到屏幕变化，更改全屏状态，该页面不能存在多个全屏元素
      this.isFullScreen = !this.isFullScreen
    })
  },
  methods: {
    async init() {
      await getVideoAraeTree()
        .then((res) => {
          if (res.code === 0) {
            this.treeList = res.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    async getPlaybackList(date, playStartTime = this.playTime) {
      console.log(11111111, date, playStartTime, this.playTime)
      this.videoUrl = ''
      this.videoHistory.searchHistoryResult = []
      let listData = this.deviceVideoList[date] || []
      console.log('listData~~~~~~~~~~~~', this.deviceVideoList[date], listData)
      // if (!listData.length) {

      await getPlaybackList({
        channelId: this.channelId,
        startTime: `${date} 00:00:00`,
        endTime: `${date} 23:59:59`
      })
        .then((res) => {
          if (res.code === 0) {
            console.log('getPlaybackList', res.data)
            if (res.data && res.data.recordList.length > 0) {
              listData = res.data.recordList.map((item) => {
                const { startTime, endTime } = item
                item.duration =
                  (new Date(endTime).getTime() -
                    new Date(startTime).getTime()) /
                  1000 // ms
                return item
              })

              this.deviceVideoList = {
                [date]: listData
              }
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })

      this.formData.loading = false
      this.playRecord(1, date)
    },

    filterNode(value, data) {
      if (!value) return true
      return data.areaNames && data.areaNames.indexOf(value) !== -1
      // }
    },
    async getDeviceList(id) {
      await getPlayLists({ channelId: id })
        .then((res) => {
          if (res.code === 0) {
            console.log(111111, res)
          }
        })
        .catch(function (error) {
          console.log(error)
          // this.getDeviceListLoading = false
        })
    },
    async handleNodeClick(data, node, self) {
      if (!data.onlineState) {
        this.resArray = []
        if (this.detailsId.indexOf(data.id) !== -1) {
          return
        } else {
          await getChannelPlayList(data.id)
            .then((res) => {
              if (res.code === 0) {
                if (res.data && res.data.length > 0) {
                  res.data.map((item) => {
                    this.resArray.push({
                      onlineState: item.onlineState,
                      areaName: item.channelName,
                      areaNames: item.channelName,
                      areaPid: item.id,
                      children: []
                    })
                  })

                  this.detailsId.push(data.id)
                  let arr = data.children
                    ? this.resArray.concat(data.children)
                    : this.resArray
                  const obj = {}
                  arr = arr.reduce((item, next) => {
                    obj[next.areaPid]
                      ? ''
                      : (obj[next.areaPid] = true && item.push(next))
                    return item
                  }, [])
                  this.$refs.recordViewTree.updateKeyChildren(data.id, arr)
                  this.defaultExpandedKeys = [data.id]
                }
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      } else {
        this.channelId = data.areaPid
      }
    },
    initData() {
      //如果是其他地方跳转过来
      if (this.$route.query.channelId) {
        this.selData = {
          isLeaf: true,
          deviceId: this.$route.query.deviceId,
          channelId: this.$route.query.channelId,
          id: this.$route.query.id
        }
        this.formData.type = this.$route.query.type
        this.showBackBtn = true
        this.handleSearch()
      }
    },
    handleChangeTimePicker(val) {
      const isPlay = this.play
      if (this.play) this.handlePauseOrPlay()

      const timeString = moment(val).format('HH:mm:ss')
      if (this.tabsActiveName === 'device') {
        const date = this.playTime.format('YYYY-MM-DD')
        this.playTime = moment(`${date} ${timeString}`)
      } else {
        const date = this.cloudPlayTime.format('YYYY-MM-DD')
        this.cloudPlayTime = moment(`${date} ${timeString}`)
        // this.getCloudRecordVideo(date, this.cloudPlayTime);
      }
      this.handleDevicesPlayEnded()
      if (isPlay) this.handlePauseOrPlay()
    },
    timePickerDisabled() {
      const data =
        this.tabsActiveName === 'device'
          ? this.deviceVideoList[this.playTime.format('YYYY-MM-DD')]
          : this.cloudVideoList[this.cloudPlayTime.format('YYYY-MM-DD')]
      return !(data && data.length)
    },
    // 关闭视频
    handleCloseVideo() {
      this.cloudPlay = this.play = false
      if (this.tabsActiveName === 'device') {
        this.stopPlayRecord()
        this.videoUrl = ''
        this.currentList = ''
        this.currentSpeed = 2
      } else {
        this.cloudPlayerUrl = ''
      }
    },
    handleSelectTreeNode(data) {
      this.selData = data
    },
    // 查询视频
    handleSearch() {
      if (this.channelId === '' && this.channelId.length === 0) {
        this.$message({
          message: '请选择节点',
          type: 'warning'
        })
        return
      } else if (this.formData.date === '' && this.formData.date.length === 0) {
        this.$message({
          message: '请选择时间',
          type: 'warning'
        })
        return
      } else {
        this.formData.loading = true

        this.dateChange(this.formData.date)
      }
    },
    // 设备滚动控制放大缩小
    handleMouseWheel() {
      if (!this.isZoom) return
      this.isZoom = event.wheelDeltaY > 0 ? ZOOM_TYPE.in : ZOOM_TYPE.out
      this.handleClickPlayer(event)
    },
    // 放大缩小事件
    handleClickPlayer(event) {
      if (this.isZoom) {
        const scale =
          this.isZoom === ZOOM_TYPE.in
            ? this.zoomStyle.scale + 0.1
            : this.zoomStyle.scale - 0.1
        const dom = document.getElementById('recordPlayerLayout')
        const centerX = dom.clientWidth / 2
        const centerY = dom.clientHeight / 2

        this.zoomStyle = {
          scale,
          translateX:
            scale <= 1
              ? 0
              : this.zoomStyle.translateX +
                (centerX - event.layerX) / (scale * 3),
          translateY:
            scale <= 1
              ? 0
              : this.zoomStyle.translateY +
                (centerY - event.layerY) / (scale * 3)
        }
      }
    },
    // 控制放大缩小
    handleZoom(type) {
      this.isZoom = this.isZoom === type ? false : type
    },
    //获取码流信息
    getStreamInfo() {
      if (this.mediaServerId && this.app && this.streamId) {
        const that = this
        that.tracks = []
        this.$axios({
          method: 'get',
          url:
            '/zlm/' +
            this.mediaServerId +
            '/index/api/getMediaInfo?vhost=__defaultVhost__&schema=rtmp&app=' +
            this.app +
            '&stream=' +
            this.streamId
        }).then(function (res) {
          if (res.data.code == 0 && res.data.online) {
            that.tracks = res.data.tracks
            that.isShowStream = true
          } else {
            that.$message({
              showClose: true,
              message: '获取编码信息失败,',
              type: 'warning'
            })
          }
        })
      } else {
        this.$message({
          showClose: true,
          message: '获取编码信息失败,',
          type: 'warning'
        })
      }
    },
    //控制显示码流
    handleShowStream() {
      if (!this.isShowStream) {
        this.getStreamInfo()
      } else {
        this.isShowStream = !this.isShowStream
      }
    },
    //缩放拉伸屏幕
    handleChangeFill() {
      this.isFill = !this.isFill
    },
    handleDownload() {
      //下载视频
      if (this.deviceId && this.channelId) {
        this.downloadModalVisible = true

        // const [startTime]= this.currentCloudList.split("_");
        //   this.downMp4({
        //     startTime,
        //     recordUrl: this.cloudPlayerUrl
        // })
      }
    },
    handleScreenShot() {
      //截屏
      this.tabsActiveName === 'device'
        ? this.$refs.devicesPlayer.handleScreenShot()
        : this.$refs.cloudPlayer.handleScreenShot()
    },
    handleSetVolume() {
      //设置声音
      this.isMuted = !this.isMuted
    },
    //收起展开菜单
    handleHiddenMenu() {
      this.isShowMenu = !this.isShowMenu
      this.$nextTick(() => {
        this.$refs.TimePlayer.setMoveXByTime()
      })
    },
    //视频暂停监听时件
    handleOnPause() {
      // this.play = false;
      console.log('暂停播放设备视频')
      if (this.tabsActiveName === 'device') {
        this.gbPause()
      }
    },
    //监听播放视频事件
    handleOnPlay() {
      if (this.tabsActiveName === 'device') {
        console.log('播放设备视频')
        this.gbPlay()
        if (this.currentSpeed != 2) {
          this.gbScale(this.speedArr[this.currentSpeed])
        }
      }
      this.play = true
    },
    //滚动时间轴事件
    handleChangePlayTime(curTime, isDragEnd, record) {
      switch (true) {
        case !!(isDragEnd && record): {
          //拖拽完成,并且该时间有播放内容数据
          console.log('拖拽结束')
          this.playRecord(record, curTime)
          this.isDragging = false
          break
        }
        case isDragEnd: //拖拽后没有播放内容
          console.log('拖拽结束--没数据')
          this.isDragging = false
          this.handleCloseVideo()

          break

        case !!(!isDragEnd && this.play): {
          //拖拽中
          console.log('拖拽中')
          this.isDragging = true
          this.$refs.devicesPlayer && this.$refs.devicesPlayer.pause()
          break
        }
      }
    },
    //云录像滚动时间轴事件
    handleChangeCloudPlayTime(curTime, isDragEnd, record) {
      switch (true) {
        case !!(isDragEnd && record): {
          //拖拽完成,并且该时间有播放内容数据
          this.isDragging = false
          console.log('拖拽完成', record)
          this.playCloudVideo(record, curTime.diff(record.startTime), curTime)
          break
        }
        case isDragEnd: //拖拽后没有播放内容
          this.isDragging = false
          this.handleCloseVideo()
          // const date = curTime.format("YYYY-MM-DD");
          // if(this.cloudVideoList[date]){ //数据已经加载过了
          //   if(this.play){
          //     this.play = false;
          //     this.$refs.cloudPlayer && this.$refs.cloudPlayer.pause();
          //   }
          // }else{
          //   this.getCloudRecordVideo(date, curTime);
          // }
          break

        case !isDragEnd: {
          //拖拽中
          console.log('拖拽中')
          this.isDragging = true
          if (this.play) this.cloudPlay = this.play
          this.play = false
          this.$refs.cloudPlayer && this.$refs.cloudPlayer.pause()
          break
        }
      }
    },
    //事件轴上的日期发生变化
    handleChangePlayDate(currentDate, ...preAndNextDate) {
      if (this.tabsActiveName === 'device') {
        //设备列表
        this.queryRecords(currentDate.format('YYYY-MM-DD'))
        preAndNextDate.forEach((date) => {
          this.getDevicesVideData(date.format('YYYY-MM-DD'))
        })
      } else {
        //云播
        this.getCloudRecordVideo(currentDate.format('YYYY-MM-DD'))
        preAndNextDate.forEach((date) => {
          this.getCloudRecordVideo(date.format('YYYY-MM-DD'), null, true)
        })
      }
    },
    //监听播放中的时间变化消息时间
    handleChangeCurrentTime: (function () {
      let lastPlayTime
      return function (currentTime) {
        if (this.play && !this.isDragging) {
          if (this.tabsActiveName === 'device') {
            this.playTime = moment(this.recordStartTime).add(
              currentTime * 1000 + this.skipTime,
              'milliseconds'
            )
            if (lastPlayTime === currentTime) {
              console.log('播放结束')
              this.handleDevicesPlayEnded()
            }
            lastPlayTime = currentTime
          } else {
            this.cloudPlayTime = moment(this.cloudRecordStartTime).add(
              currentTime * 1000,
              'milliseconds'
            )
          }
        }
      }
    })(),
    //监听设备播放完毕,自动播放下一个视频
    handleDevicesPlayEnded(ref, event) {
      let minDateRecord,
        maxDiff = -99999999999
      if (this.tabsActiveName === 'device') {
        const date = this.playTime.format('YYYY-MM-DD')
        console.log(
          '播放结束或者报错停止设备播放' +
            this.playTime.format('YYYY-MM-DD HH:mm:ss')
        )
        const [startTime, endTime] = this.currentList.split('_')
        if (this.playTime.isBetween(startTime, endTime)) {
          //如果当前没有播完，就停了继续播
          this.playRecord({ startTime, endTime }, this.playTime)
        } else if (this.deviceVideoList[date]) {
          for (const item of this.deviceVideoList[date]) {
            const diff = this.playTime.diff(item.startTime)
            if (diff <= 0 && maxDiff < diff) {
              //记录开始时间在当前时间之后,并且比之前的值更接近
              maxDiff = diff
              minDateRecord = item
            }
          }
          if (minDateRecord) {
            this.playRecord(minDateRecord)
          } else {
            //如果今天已经没数据了就到下一天看
            this.cloudPlay = this.play = false
            // this.queryRecords(moment(this.playTime).add(1, "days").format("YYYY-MM-DD"));
          }
        }
      } else {
        if (this.play) this.cloudPlay = this.play
        const date = this.cloudPlayTime.format('YYYY-MM-DD')
        if (this.cloudVideoList[date]) {
          for (const item of this.cloudVideoList[date]) {
            const diff = this.cloudPlayTime.diff(item.startTime)
            //误差值小于1000是弥补js计算运行耗时
            if (diff <= 1000 && maxDiff < diff) {
              //记录开始时间在当前时间之后,并且比之前的值更接近
              maxDiff = diff
              minDateRecord = item
            }
          }
          if (minDateRecord) {
            this.playCloudVideo(minDateRecord)
          } else {
            this.cloudPlay = this.play = false
            // this.getCloudRecordVideo(moment(this.cloudPlayTime).add(1, "days").format("YYYY-MM-DD"))
          }
        }
      }
    },
    //点击暂停播放按钮
    handlePauseOrPlay() {
      console.log('点击了播放', this.play)
      if (this.play) {
        //暂停
        this.cloudPlay = this.play = false
        this.$refs.devicesPlayer && this.$refs.devicesPlayer.pause()
        this.$refs.cloudPlayer && this.$refs.cloudPlayer.pause()
      } else if (
        this.tabsActiveName === 'device' ? this.videoUrl : this.cloudPlayerUrl
      ) {
        //播放
        this.play = true
        this.$refs.devicesPlayer && this.$refs.devicesPlayer.play()
        this.$refs.cloudPlayer && this.$refs.cloudPlayer.play()
      }
    },
    //倍数按钮
    handleChangeSpeed(type) {
      if (type === 'plus' && this.currentSpeed != this.speedArr.length - 1) {
        //加速
        this.currentSpeed++
        if (this.tabsActiveName === 'device')
          this.gbScale(this.speedArr[this.currentSpeed])
      } else if (type === 'sub' && this.currentSpeed) {
        //减速
        this.currentSpeed--
        if (this.tabsActiveName === 'device')
          this.gbScale(this.speedArr[this.currentSpeed])
      }
    },

    // 切换倍速
    switchSpeed(val) {
      let newVal = val.toString()
      this.currentSpeed = this.speedArr.indexOf(val)
      if (newVal.indexOf('.') === -1) {
        newVal = val.toFixed(1)
      }
      this.gbScale(newVal)
    },
    toogleFullScreen() {
      const playerMain = document.getElementById('recordPlayerLayout')

      if (this.isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (playerMain.requestFullscreen) {
          playerMain.requestFullscreen()
        } else if (playerMain.webkitRequestFullScreen) {
          playerMain.webkitRequestFullScreen()
        } else if (playerMain.mozRequestFullScreen) {
          playerMain.mozRequestFullScreen()
        } else if (playerMain.msRequestFullscreen) {
          // IE11
          playerMain.msRequestFullscreen()
        }
      }
    },
    // 点击设备录像列表
    clickRecordList(row) {
      this.currentSpeed = 2
      this.playRecord(row)
    },
    // 点击云端录像列表
    playCloudVideo(row, skipTime = 0, curTime) {
      this.currentCloudList = `${row.startTime}_${row.endTime}`

      this.cloudPlayTime = curTime || moment(row.startTime)
      this.cloudRecordStartTime = row.startTime
      this.play = this.cloudPlay

      if (this.cloudPlayerUrl != row.recordUrl)
        //播放不同时间段视频
        this.cloudPlayerUrl = row.recordUrl

      if (skipTime) {
        //快进的时间段
        this.$nextTick(() => {
          this.$refs.cloudPlayer &&
            this.$refs.cloudPlayer.setCurrentTime(parseInt(skipTime / 1000))
        })
      }
    },
    // 日期更改
    dateChange(val) {
      const date = moment(val).format('YYYY-MM-DD')
      if (this.tabsActiveName === 'device') {
        this.videoHistory.date = date
        this.playTime = moment(val)
        // this.queryRecords(this.videoHistory.date)
        this.getPlaybackList(this.videoHistory.date)
      } else {
        this.cloudPlayTime = moment(val)
        this.getCloudRecordVideo(date)
      }
    },
    /**
     * 获取某日全部录像文件
     * @param callback
     */
    getCloudRecordVideo: function (
      date = this.cloudPlayTime.format('YYYY-MM-DD'),
      playStartTime,
      isGetData,
      callback
    ) {
      let that = this

      if (isGetData && playStartTime && this.cloudPlayTime !== playStartTime) {
        this.cloudPlayTime = playStartTime
      }
      that
        .$axios({
          method: 'get',
          url: `/api/record/info/device/data`,
          params: {
            startDate: date,
            endDate: date,
            deviceChannelId: this.id
          }
        })
        .then((res) => {
          let flag = false,
            minStartTimeRecord = res.data.data[0] //是否找到播放的时间

          if (res.data.data && res.data.data.length) {
            that.cloudVideoList = {
              // ...that.cloudVideoList,
              [date]: res.data.data
            }
            if (isGetData) return //只是获取数据渲染时间轴

            that.recordVideoData = res.data.data.map((item) => {
              const startTime = item.startTime.split(' ')
                ? item.startTime.split(' ')[1]
                : item.startTime
              const endTime = item.endTime.split(' ')
                ? item.endTime.split(' ')[1]
                : item.endTime

              if (this.play && !playStartTime) {
                //当前是播放状态
                minStartTimeRecord =
                  moment(minStartTimeRecord.startTime).diff(item.startTime) > 0
                    ? item
                    : minStartTimeRecord
              } else if (
                !flag &&
                playStartTime &&
                playStartTime.isBetween(
                  item.startTime,
                  item.endTime,
                  null,
                  '[]'
                )
              ) {
                //找到指定要播放的记录
                flag = true
                this.playCloudVideo(
                  item,
                  playStartTime.diff(item.startTime),
                  playStartTime
                )
              }

              return {
                ...item,
                duration:
                  (new Date(date + ' ' + endTime).getTime() -
                    new Date(date + ' ' + startTime).getTime()) /
                  1000 // ms
              }
            })
          } else {
            that.cloudVideoList[date] = []
            that.recordVideoData = []
          }

          that.formData.loading = false

          switch (true) {
            case this.play && !playStartTime && !!minStartTimeRecord: //找到要播放的视频
              this.playCloudVideo(minStartTimeRecord)
              break
            case this.play && !playStartTime:
            case res.data.data.length === 0:
            case !!flag:
              this.play = false
              break
          }

          if (callback) callback()
        })
        .catch(function (error) {
          console.log(error)
          that.formData.loading = false
          that.loading = false
        })
    },
    // 秒转换成时分秒
    formatSeconds(value) {
      // 转换为式分秒
      let h = parseInt((value / 60 / 60) % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt((value / 60) % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(value % 60)
      s = s < 10 ? '0' + s : s
      // 作为返回值返回
      return `${h}:${m}:${s}`
    },
    goBack() {
      if (this.ischannel == 1) {
        this.$router.push({
          name: `ChannelManagement`,
          params: {
            SchannelId: this.SchannelId,
            SchannelName: this.SchannelName,
            // Scount : this.count,
            SdeviceId: this.SdeviceId,
            SdeviceName: this.SdeviceName,
            SincludeEquipment: this.SincludeEquipment,
            Sip: this.Sip,
            Sstatus: this.Sstatus,
            SselectedNode: this.SselectedNode,
            ScurrentPage: this.ScurrentPage
          }
        })
      } else {
        this.$router.go(-1)
      }
    },
    // 请求设备录像
    getDevicesVideData(
      date,
      startTime = date + ' 00:00:00',
      endTime = date + ' 23:59:59'
    ) {
      if (this.deviceVideoList[date]) return
      this.deviceVideoList[date] = []
      this.$axios({
        method: 'get',
        url:
          '/api/gb_record/query/' +
          this.deviceId +
          '/' +
          this.channelId +
          '?startTime=' +
          startTime +
          '&endTime=' +
          endTime
      }).then((res) => {
        if (res.data.data.recordList && res.data.data.recordList.length) {
          this.deviceVideoList = {
            ...this.deviceVideoList,
            [date]: res.data.data.recordList.map((item) => {
              const { startTime, endTime } = item
              item.duration =
                (new Date(endTime).getTime() - new Date(startTime).getTime()) /
                1000 // ms
              return item
            })
          }
        } else {
          this.deviceVideoList[date] = []
        }
      })
    },

    // 请求设备录像
    queryRecords: async function (date, playStartTime = this.playTime) {
      console.log(11111111, date, playStartTime, this.playTime)
      this.videoUrl = ''
      this.videoHistory.searchHistoryResult = []
      let listData = this.deviceVideoList[date] || []
      if (!listData.length) {
        await this.$axios({
          method: 'get',
          url: `/api/gb_record/query/${this.deviceId}/${this.channelId}?startTime=${date} 00:00:00&endTime=${date} 23:59:59`
        })
          .then((response) => {
            if (response.data.data && response.data.data.recordList) {
              listData = response.data.data.recordList.map((item) => {
                const { startTime, endTime } = item
                item.duration =
                  (new Date(endTime).getTime() -
                    new Date(startTime).getTime()) /
                  1000 // ms
                return item
              })

              this.deviceVideoList = {
                // ...this.deviceVideoList,
                [date]: listData
              }
            }
          })
          .catch(() => {})
      }
      this.formData.loading = false

      // 处理时间信息
      this.videoHistory.searchHistoryResult = listData
      if (!listData.length) return

      if (playStartTime) {
        //如果有播放开始时间
        const record = listData.find((item) =>
          playStartTime.isBetween(item.startTime, item.endTime, null, '[]')
        )
        if (record) this.playRecord(record, playStartTime)
      } else if (this.play) {
        //播放中,日期发生变化，找当天最早播放的
        let minStartTimeRecord = listData[0]
        for (const item of listData) {
          minStartTimeRecord = moment(minStartTimeRecord.startTime).isBefore(
            item.startTime
          )
            ? minStartTimeRecord
            : item
        }
        if (minStartTimeRecord) {
          this.playRecord(minStartTimeRecord)
        } else {
          this.play = false
        }
      }
      if (!this.play) {
        //没有自动播放
        setTimeout(() => {}, 0)
      }
    },
    stopPlayRecord: function (callback) {
      if (!this.streamId) return
      this.$refs.devicesPlayer && this.$refs.devicesPlayer.pause()
      this.videoUrl = ''
      return this.$axios({
        method: 'get',
        url:
          '/api/playback/stop/' +
          this.deviceId +
          '/' +
          this.channelId +
          '/' +
          this.streamId
      }).then(function (res) {
        return callback && callback()
      })
    },
    // 点击tabs
    handleClick(e) {
      this.isShowStream = false
      this.play = false
    },
    // 下载mp4
    downMp4(data) {
      // const url = `${this.mediaServerPath}/${this.cloudDate}/${data}`;
      const { recordUrl, startTime } = data
      const url = recordUrl
      // 实现下载功能
      var filePath = url
      var fileNewName = `${this.cloudPlayTime.format('YYYY-MM-DD')}_${
        startTime.split(' ')[1]
      }`
      this.fileDownloadFun(filePath, fileNewName)
      // this.downVideo(filePath, fileNewName);
    },
    downVideo(filePath, fileNewName) {
      const this_ = this
      const xhr = new XMLHttpRequest()
      xhr.open('GET', filePath, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let blob = this.response
          let u = window.URL.createObjectURL(
            new Blob([blob], { type: 'video/mp4' })
          )
          let a = document.createElement('a')
          a.download = fileNewName
          a.href = u
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
          window.URL.revokeObjectURL(u)
        }
      }
      xhr.onprogress = function (e) {
        if (e.lengthComputable) {
          // // 文件总体积
          // console.log('totoal', e.total)
          // // 已下载体积
          // console.log('load', e.loaded)
          const num = (e.loaded / e.total) * 100
          Object.assign(this_.alarmList[index], { percentage: num })
          if (e.total == e.loaded) {
            this_.$message({
              type: 'success',
              message: '下载成功'
            })
            this_.percentage = 100
            Object.assign(this_.alarmList[index], {
              isDownLoad: false,
              percentage: 0
            })
          }
        }
      }
      xhr.onerror = function () {
        console.log('失败')
        this_.$message({
          type: 'error',
          message: '下载失败'
        })
        Object.assign(this_.alarmList[index], {
          isDownLoad: false,
          percentage: 0
        })
      }
      xhr.send()
    },
    fileDownloadFun(fileUrl, fileName) {
      if ('undefined' == typeof fileUrl || !fileUrl) {
        alert('文件路径不能为空')
        return false
      }
      let fileUrlArr = fileUrl.split('.')
      // let fileFix = "undefined" != typeof fileUrlArr[1] && fileUrlArr[1] ? '.' + fileUrlArr[1] : '';
      // fileName = fileName+fileFix;
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
    // 组装视频url
    getUrlByStreamInfo(streamInfo) {
      console.log(streamInfo, 'streamInfo')
      const urlType = 'FLV'
      let videoUrl = [streamInfo.ws_flv, streamInfo.wss_flv] // [0]为http，[1]为https
      // let videoUrl = [streamInfo.wss_flv, streamInfo.wss_flv]; // [0]为http，[1]为https
      let baseZlmApi =
        process.env.NODE_ENV === 'development'
          ? `${location.host}/debug/zlm`
          : `${location.host}/zlm`
      // return `${baseZlmApi}/${streamInfo.app}/${streamInfo.streamId}.flv`;
      // return `http://${baseZlmApi}/${streamInfo.app}/${streamInfo.streamId}.flv`;
      // 2020/03/14
      if (urlType === 'HLS') {
        videoUrl = [streamInfo.hls, streamInfo.https_hls]
      } else if (urlType === 'WEB-RTC') {
        videoUrl = [streamInfo.rtc, streamInfo.rtc]
      }

      if (location.protocol === 'https:') {
        if (streamInfo.wss_flv === null) {
          console.error('媒体服务器未配置ssl端口, 使用http端口')
          // this.$message({
          //   showClose: true,
          //   message: '媒体服务器未配置ssl端口, ',
          //   type: 'error'
          // });
          return videoUrl[0]
        } else {
          return videoUrl[1]
        }
      } else {
        return videoUrl[0]
      }
    },
    playTimeFormat(val) {
      let h = parseInt(val / 3600)
      let m = parseInt((val - h * 3600) / 60)
      let s = parseInt(val - h * 3600 - m * 60)
      return h + ':' + m + ':' + s
    },
    // 切换播放进度
    playTimeChange: (function () {
      //采用队列形式请求，防止等待响应过程中又发起一次请求
      let lastQuery = null,
        isWait = false //请求队列
      return function (ms, videoUrl = this.videoUrl, curRow, playTime) {
        if (!this.streamId || !ms) return (this.videoUrl = videoUrl)
        lastQuery = { ms, videoUrl, streamId: this.streamId }
        this.skipTime = ms

        if (!isWait && lastQuery) {
          isWait = true
          const {
            ms: lastMs,
            streamId: lastStreamId,
            videoUrl: lastVideoUrl
          } = lastQuery
          lastQuery = null
          return this.$axios({
            method: 'get',
            url: `/api/playback/seek/${lastStreamId}/${parseInt(lastMs / 1000)}`
          })
            .then((res) => {
              this.videoUrl = ''
              this.timeChangeLoading = true
              return new Promise((resolve) => {
                setTimeout(() => {
                  isWait = false
                  if (lastQuery) {
                    //如果在等待数据回来的时候有调用，就再次调用
                    this.playTimeChange(lastQuery.ms, lastQuery.videoUrl)
                  } else {
                    this.videoUrl = lastVideoUrl
                    this.timeChangeLoading = false
                  }
                  resolve()
                }, 2000)
              })
            })
            .catch(() => {
              this.stopPlayRecord(() => {
                isWait = false
                this.streamId = ''
                if (curRow) this.playRecord(curRow, playTime)
              })
            })
        }
      }
    })(),
    downloadRecord: function (row) {
      let that = this
      if (that.streamId != '') {
        that.stopDownloadRecord(function (res) {
          if (res.code == 0) {
            that.streamId = ''
            that.downloadRecord(row)
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$axios({
          method: 'get',
          url:
            '/api/gb_record/download/start/' +
            this.deviceId +
            '/' +
            this.channelId +
            '?startTime=' +
            row.startTime +
            '&endTime=' +
            row.endTime +
            '&downloadSpeed=4'
        }).then(function (res) {
          if (res.data.code == 0) {
            let streamInfo = res.data.data
            that.recordPlay = false
            that.$refs.recordDownload.openDialog(
              that.deviceId,
              that.channelId,
              streamInfo.app,
              streamInfo.stream,
              streamInfo.mediaServerId
            )
          } else {
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            })
          }
        })
      }
    },
    stopDownloadRecord: function (callback) {
      this.$refs.videoPlayer && this.$refs.videoPlayer.pause()
      this.videoUrl = ''
      this.$axios({
        method: 'get',
        url:
          '/api/gb_record/download/stop/' +
          this.deviceId +
          '/' +
          this.channelId +
          '/' +
          this.streamId
      }).then((res) => {
        if (callback) callback(res)
      })
    },
    ptzCamera: function (command) {
      let that = this
      this.$axios({
        method: 'post',
        url:
          '/api/ptz/control/' +
          this.deviceId +
          '/' +
          this.channelId +
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

    //////////////////////播放器事件处理//////////////////////////
    videoError: function (e) {},
    presetPosition: function (cmdCode, presetPos) {
      let that = this
      this.$axios({
        method: 'post',
        url:
          '/api/ptz/front_end_command/' +
          this.deviceId +
          '/' +
          this.channelId +
          '?cmdCode=' +
          cmdCode +
          '&parameter1=0&parameter2=' +
          presetPos +
          '&combindCode2=0'
      }).then(function (res) {})
    },
    setSpeedOrTime: function (cmdCode, groupNum, parameter) {
      let that = this
      let parameter2 = parameter % 256
      let combindCode2 = Math.floor(parameter / 256) * 16
      this.$axios({
        method: 'post',
        url:
          '/api/ptz/front_end_command/' +
          this.deviceId +
          '/' +
          this.channelId +
          '?cmdCode=' +
          cmdCode +
          '&parameter1=' +
          groupNum +
          '&parameter2=' +
          parameter2 +
          '&combindCode2=' +
          combindCode2
      }).then(function (res) {})
    },
    setCommand: function (cmdCode, groupNum, parameter) {
      let that = this
      this.$axios({
        method: 'post',
        url:
          '/api/ptz/front_end_command/' +
          this.deviceId +
          '/' +
          this.channelId +
          '?cmdCode=' +
          cmdCode +
          '&parameter1=' +
          groupNum +
          '&parameter2=' +
          parameter +
          '&combindCode2=0'
      }).then(function (res) {})
    },
    formatTooltip: function (val) {
      var h = parseInt(val / 60)
      var hStr = h < 10 ? '0' + h : h
      var s = val % 60
      var sStr = s < 10 ? '0' + s : s
      return h + ':' + sStr
    },
    timeFormatter: function (row, column, cellValue, index) {
      return cellValue.split(' ')[1]
    },
    mergeTime: function (timeArray) {
      var resultArray = []
      for (let i = 0; i < timeArray.length; i++) {
        var startTime = new Date(timeArray[i].startTime)
        var endTime = new Date(timeArray[i].endTime)
        if (i == 0) {
          resultArray[0] = {
            startTime: startTime,
            endTime: endTime
          }
        }
        for (let j = 0; j < resultArray.length; j++) {
          if (startTime > resultArray[j].endTime) {
            // 合并
            if (startTime - resultArray[j].endTime <= 1000) {
              resultArray[j].endTime = endTime
            } else {
              resultArray[resultArray.length] = {
                startTime: startTime,
                endTime: endTime
              }
            }
          } else if (resultArray[j].startTime > endTime) {
            // 合并
            if (resultArray[j].startTime - endTime <= 1000) {
              resultArray[j].startTime = startTime
            } else {
              resultArray[resultArray.length] = {
                startTime: startTime,
                endTime: endTime
              }
            }
          }
        }
      }
      return resultArray
    },
    onTimeChange: function (video) {
      // this.queryRecords()
    },
    playRecord: (function () {
      return async function (row, playTime) {
        console.log(2222222222222, row, playTime)
        await getPlayBackUrlLists({
          channelId: this.channelId,
          startTime: `${playTime} 00:00:00`,
          endTime: `${playTime} 23:59:59`
        })
          .then((res) => {
            if (res.code === 0) {
              this.videoUrl = res.data.wsFlv
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })(),
    gbPlay() {
      console.log('前端控制：播放')
      this.$axios({
        method: 'get',
        url: '/api/playback/resume/' + this.streamId
      }).then((res) => {
        // this.$refs.videoPlayer.play(this.videoUrl);
      })
    },
    gbPause() {
      console.log('前端控制：暂停')
      this.$axios({
        method: 'get',
        url: '/api/playback/pause/' + this.streamId
      }).then(function (res) {})
    },
    gbScale(command) {
      console.log('前端控制：倍速 ' + command)
      this.$axios({
        method: 'get',
        url: `/api/playback/speed/${this.streamId}/${command}`
        // url: `/api/playback/speed/41AF368A/${command}`
      }).then(function (res) {})
    },
    gbSeek(val) {
      console.log('前端控制：seek ')
      let showTime = new Date(
        new Date(this.recordStartTime).getTime() + (this.seekTime * val) / 100
      )
      let hour = showTime.getHours()
      let minutes = showTime.getMinutes()
      let seconds = showTime.getSeconds()
      this.showTimeText =
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes) +
        ':' +
        (seconds < 10 ? '0' + seconds : seconds)
      this.$axios({
        method: 'get',
        url:
          `/api/playback/seek/${this.streamId}/` +
          Math.floor((this.seekTime * val) / 100000)
      }).then(function (res) {})
    },
    getMediaServerList: function () {
      let that = this
      that.mediaServerObj.getOnlineMediaServerList((data) => {
        console.info(data, 'data')
        const mediaServerList = data.data
        if (mediaServerList.length > 0) {
          // mediaServerId = mediaServerList[0].id;
          let port = mediaServerList[0].httpPort
          //   if (
          //     location.protocol === "https:" &&
          //     that.mediaServerList[0].httpSSlPort
          //   ) {
          //     port = that.mediaServerList[0].httpSSlPort;
          //   }
          if (
            location.protocol === 'https:' &&
            mediaServerList[0].httpSSlPort
          ) {
            port = mediaServerList[0].httpSSlPort
          } else {
            port = mediaServerList[0].httpPlayPort
          }
          that.mediaServerPath =
            location.protocol +
            '//' +
            mediaServerList[0].streamIp +
            ':' +
            port +
            '/record/' +
            that.recordFile.app +
            '/' +
            that.recordFile.stream
          console.info('录像path', that.mediaServerPath)
          // that.getRecordList();
        }
      })
    },
    /**
     * 用年月获取存在数据的日子
     * @param val 数组[年,月]
     * @param callback 回调函数
     */
    getDateInMoth(val, callback) {
      this.$axios({
        method: 'get',
        url: '/api/record/info/device/month',
        params: {
          year: val[0],
          month: val[1],
          deviceChannelId: this.selData.id
        }
      })
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.length > 0) {
              this.setHaveVideoDate(res.data.data)
            }
          }
          if (callback) callback()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //设置当前有录像日期样式
    setHaveVideoDate(dates) {
      let yearAndMonth = []
      document
        .querySelectorAll(
          '.form-date-picker-popper .el-date-picker__header-label'
        )
        .forEach((item) => {
          let dateData = item.innerText.split(' ')[0]
          if (dateData < 10) {
            yearAndMonth.push('0' + dateData)
          } else {
            yearAndMonth.push(dateData)
          }
        })
      const yearAndMonthStr = yearAndMonth.join('-')
      document
        .querySelectorAll(
          '.form-date-picker-popper .el-picker-panel__content .el-date-table .available'
        )
        .forEach((item) => {
          if (
            dates.includes(
              yearAndMonthStr + '-' + item.innerText.padStart(2, '0')
            )
          ) {
            item.className = item.className + ' data-picker-true'
          }
        })
    },
    /**
     * 为日期选择添加监听事件，用于获取变化的月份
     * @returns {Promise<void>}
     */
    async addEvent() {
      await this.$nextTick()
      this.monthChange()
      if (this.setClick) return
      document
        .querySelector('.form-date-picker-popper .el-month-table')
        .addEventListener('click', () => {
          this.monthChange()
        })
      document
        .querySelectorAll(
          ".form-date-picker-popper [aria-label='下个月'],[aria-label='上个月'],[aria-label='后一年'],[aria-label='前一年']"
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
          '.form-date-picker-popper .el-picker-panel__content .el-date-table .data-picker-true'
        )
        .forEach((item) => {
          item.className = item.className.replace(
            'data-picker-true',
            'data-picker-false'
          )
        })

      if (!this.selData.isLeaf || this.formData.type !== 'cloud') return

      this.$nextTick(() => {
        let yearAndMonth = []
        document
          .querySelectorAll(
            '.form-date-picker-popper .el-date-picker__header-label'
          )
          .forEach((item) => {
            let dateData = item.innerText.split(' ')[0]
            if (dateData < 10) {
              yearAndMonth.push('0' + dateData)
            } else {
              yearAndMonth.push(dateData)
            }
          })

        this.getDateInMoth(yearAndMonth)
      })
    },
    /**
     * 获取播放时长
     * @param item
     * @returns {number}
     */
    getDataWidth(item) {
      let endTime = new Date(item.endTime)
      let startTime = new Date(item.startTime)
      let result =
        (endTime.getTime() - startTime.getTime()) /
        ((this.cloudSliderMax - this.cloudSliderMIn) * 1000)
      return result * 100
    }
  },
  watch: {
    playTime(newVal, oldVal) {
      this.datePickerPlayTime = newVal.toDate()
      let minDateRecord,
        maxDiff = -99999999999
      const endTime = this.currentList && this.currentList.split('_')[1]
      const date = newVal.format('YYYY-MM-DD')
      //如果当前播放时间超过但前菜单选中的时间久重新选择
      if (endTime && newVal.isAfter(endTime) && this.deviceVideoList[date]) {
        for (const item of this.deviceVideoList[date]) {
          const diff = newVal.diff(item.startTime)
          if (diff <= 0 && maxDiff < diff) {
            //记录开始时间在当前时间之后,并且比之前的值更接近
            maxDiff = diff
            minDateRecord = item
          }
        }
        if (minDateRecord) {
          this.currentList = `${minDateRecord.startTime}_${minDateRecord.endTime}`
        }
      }
      if (newVal.diff(oldVal, 'days')) {
        this.videoHistory.searchHistoryResult = this.deviceVideoList[date] || []
      }
    },
    cloudPlayTime(newVal, oldVal) {
      this.datePickerCloudPlayTime = newVal.toDate()
    }
  },
  beforeDestroy() {
    console.log('beforeDestroy')
    if (this.streamId) {
      this.stopPlayRecord()
    }
  }
}
</script>

<style lang="scss" scoped>
.monitoring-content-box {
  height: calc(100% - 0px);
  .left-tree {
    width: 20%;
    max-width: 480px;
    background-color: #fff;
    margin-right: 16px;
    height: 100%;
  }
  .real-time-monitoring {
    .el-tabs__nav-wrap {
      padding: 0px 24px 0;
    }
  }
  .equipment-group-wrapper-top {
    flex: 1;
    overflow: hidden;
    // max-height: 50%;

    .real-time-monitoring {
      height: 100%;
      display: flex;
      flex-direction: column;

      .el-tabs__content {
        flex: 1;
        overflow-y: auto;
      }
    }
  }
  .equipment-group-wrapper-bottom {
    // flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 50%;

    .wrapper-bottom-content {
      flex: 1;
      overflow-y: auto;
    }
  }
  .securityArea_container {
    height: 480px;
    width: 340px;
    margin-top: 5px;
    background: #ffffff;
    overflow-y: auto;
    overflow-x: hidden;
    margin-left: 10px;
    // box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
}
.player-container-full {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #fff;
  position: relative;
  height: 100%;
  z-index: 2999;
}
.record-ul {
  flex: 1;
  margin: 0;
  padding-left: 0;
  overflow-y: auto;
}
.record-ul .not-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.record-ul .not-data img {
  display: flex;
  width: 200px;
  height: 200px;
}
.record-ul .not-data span {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}
.recordView {
  height: calc(100vh - 120px);
  .record-list {
    display: flex;
    padding: 16px 24px 0 24px;
    list-style: none;
    cursor: pointer;
  }

  .el-main {
    flex: 1;
  }

  .wrapper-top-tree {
    height: calc(100vh - 500px);
    overflow: auto;
  }
  .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-tabs__content {
    flex: 1;
  }
  .el-tab-pane {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
.recordView .el-container {
  height: 100%;
  background-color: #f2f2f2;
  flex-direction: column;
}
.record-list:hover,
.record-list.active {
  background-color: rgba(24, 144, 255, 0.1);
}
.record-list:hover .title,
.record-list.active .title {
  color: #1890ff;
}
.record-list .img-left {
  position: relative;
  width: 96px;
  height: 54px;
  margin-right: 16px;
}
.record-list .img-left img {
  width: 100%;
}
.record-list .img-left .text {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 20px;
  line-height: 20px;
  padding: 0 8px 0 4px;
  background: rgba(0, 0, 0, 0.3);
  border-top-right-radius: 10px;
  font-size: 12px;
  color: #fff;
}
.record-list .content {
  // display: flex;
  // justify-content: center;
  // flex-direction: column;
  flex: 1;
  padding-bottom: 16px;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.record-list .content button {
  display: inline-block;
  padding: 5px 12px 5px 8px;
}
.record-list .title {
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
.date {
  width: 65% !important;
  // padding: 16px;
  margin: 16px;
}
.player-container {
  height: 100%;

  width: 80%;
  display: flex;
  flex-direction: column;
  background-color: #545556;
  position: relative;

  .trank {
    width: 80%;
    height: 180px;
    text-align: left;
    padding: 0 10%;
    overflow: auto;
    position: absolute;
    color: white;
    font-size: 12px;
    bottom: 112px;
  }
  .trankInfo {
    width: 80%;
    padding: 0 10%;
  }
}
.player-box {
  flex: 1;
  position: relative;
  /* display: flex;
    align-items: center; */
}
.player-box .player-header {
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 40px;
  display: flex;
  padding: 0 24px;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  color: #fff;
  box-sizing: border-box;
}
.player-box:hover .player-header {
  opacity: 1;
}

.player-container {
  .player-center {
    width: 100%;
    height: 100%;
    .video-wrapper {
      padding-bottom: 0 !important;
      height: 100%;
    }

    // position: absolute;
    // left: 50%;
    // top: 50%;
    // width: 100%;
    // -webkit-transform: translateX(-50%) translateY(-50%);
  }
}
.player-box .not-player {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 15%;
  max-width: 300px;
  /* max-height: 300px; */
  min-width: 150px;
  /* min-height: 150px; */
  -webkit-transform: translateX(-50%) translateY(-50%);
  text-align: center;
}
.not-player img {
  display: block;
  width: 100%;
  height: 100%;
}
.not-player span {
  margin-top: 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}
.jPlayer-box {
  /* position: absolute; */
  /* -webkit-transform: translateX(0) translateY(-50%); */
}
.playerBox {
  display: none;

  &.show {
    display: block;
  }

  .el-loading-mask {
    background-color: rgba(0, 0, 0, 0.9);
    z-index: auto;
  }

  &.zoom-in {
    cursor: zoom-in;
  }
  &.zoom-out {
    cursor: zoom-out;
  }
}
.player-time {
  height: 64px;
  /* display: flex;
    align-items: center;
    justify-content: center; */
  background-color: #303031;
}
.player-time .playtime-slider {
  margin: 0 48px;
}
.player-toolbar {
  user-select: none;
  height: 48px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 16px;

  i.active {
    color: #1890ff;
  }

  .toolbar-left {
    i {
      cursor: pointer;

      &:not(.hidden-menu-icon) {
        font-family: 'iconfont' !important;
        font-style: normal;
        margin-right: 16px;
      }
    }
    .parting-line {
      margin: 0 15px 0 10px;
      border-left: solid 1px rgba(255, 255, 255, 0.25);
    }
  }

  .tool-center {
    height: 100%;
    user-select: none;

    .toolbar-date-picker {
      height: 100%;
      width: 184px;

      input {
        padding: 0;
        text-align: center;
        width: 184px;
        height: 100%;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 0;
        border: none;
        font-size: 16px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }

    .play-btn {
      margin-left: 20px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      display: inline-block;

      &.play {
        background: url('../../../../assets/imgs/icon_player_play.png')
          no-repeat;
        background-size: cover;
      }

      &.pause {
        background: url('../../../../assets/imgs/icon_player_pause.png')
          no-repeat;
        background-size: cover;
      }
    }
    .speed-box {
      width: 112px;
      height: 32px;
      justify-content: space-between;
      padding: 4px;
      display: inline-flex;
      vertical-align: top;
      background: rgba(255, 255, 255, 0.2);
      overflow: hidden;
      box-sizing: border-box;
      margin-top: 8px;
      border-radius: 4px;
      margin-left: 16px;

      .speed-text {
        font-size: 16px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 24px;
      }

      .speed-icon {
        cursor: pointer;
        width: 24px;
        height: 24px;
        display: inline-block;

        &.speed-down {
          background: url('../../../../assets/imgs/icon_player_speed_down.png')
            center/cover no-repeat;
        }

        &.speed-up {
          background: url('../../../../assets/imgs/icon_player_speed_up.png')
            center/cover no-repeat;
        }

        &.disabled {
          cursor: not-allowed;
          opacity: 0.3;
        }
      }
    }

    .close-video {
      display: inline-block;
      width: 10px;
      height: 10px;
      cursor: pointer;
      background-color: #fff;
      margin-right: 24px;
    }
  }
  .disabled {
    opacity: 0.3;
    cursor: not-allowed !important;
  }
}
.player-toolbar i {
  font-size: 18px;
}
.tool-right {
  display: flex;
}
.tool-right > * {
  margin-left: 12px;
}
.tool-right > i {
  cursor: pointer;
}

/* slider */
.record-list-item {
  padding: 0;
  margin: 0;
  margin: 0.5rem 0;
  cursor: pointer;
}

/* 重置样式 */

.recordView .el-tabs__nav {
  margin: 0 24px;
}
.content-left {
  width: 20%;
  max-width: 480px;
}
.grid-content {
  height: 100%;
  .el-tabs__content {
    padding: 0 24px;
  }

  .date-select {
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    margin-top: 14px;
    padding-top: 14px;

    .el-select {
      width: 100%;
      margin-bottom: 14px;
    }

    .el-button {
      background-color: #1890ff;
      border-color: #1890ff;
      margin-top: 14px;
      width: 100%;

      &.is-disabled {
        opacity: 60%;
      }
    }
  }
}
.tree-layout {
  height: calc(100% - 200px);
}

.w100 {
  width: 100%;
}
.h100 {
  height: 100%;
}
.data-picker-true:after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: #606060;
  border-radius: 4px;
  left: 45%;
  top: 74%;
}
.player-option-box {
  // .playtime-slider {
  //     position: relative;
  //     z-index: 10;
  // }
  .el-slider__bar {
    background-color: #e4e7ed !important;
  }
}
::v-deep .el-input__prefix {
  // left: 21px;
}
</style>
