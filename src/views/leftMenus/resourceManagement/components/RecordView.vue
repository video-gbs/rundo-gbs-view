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
              <el-tabs
                v-model="activeTab"
                @tab-click="switchTab"
                class="real-time-monitoring"
              >
                <el-tab-pane
                  label="安防通道分组"
                  name="equipmentGroup"
                  class="recordView-pane"
                >
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
                                v-else
                                :icon-class="getIconType(data)"
                                class="tree2"
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
                <el-date-picker
                  ref="datetimerange1"
                  popper-class="form-date-picker-popper"
                  v-model="formData.date"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                  key="datetimerange1"
                  :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
                <el-button
                  @click="handleSearch"
                  type="primary"
                  size="small"
                  :loading="formData.loading"
                  style="
                    margin: 16px 16px 0 0 !important;
                    width: 151px;
                    height: 36px;
                  "
                  >查询</el-button
                >
              </div>
            </div>
          </div>
          <div
            :class="isShowMenu ? 'player-container' : 'player-container-else'"
            id="recordPlayerLayout"
          >
            <div
              ref="mainBox"
              :class="`main-box grid${spilt}`"
              style="height: 100%"
            >
              <div
                v-for="i in spilt"
                :key="i"
                class="play-box"
                :class="{
                  [`box${i}`]: true,
                  redborder: playerIdx == i - 1,
                  isFull: fullPlayerIdx !== -1
                }"
                @click.stop="videoClick(i)"
                v-loading="playerData[i - 1] && !cloudPlayerUrl[i - 1]"
                element-loading-text="拼命加载中"
                element-loading-background="transparent"
              >
                <div
                  @dblclick="toogleVideo(i)"
                  class="dbl-box"
                  :class="fullPlayerIdx === i ? 'full-play-box' : ''"
                >
                  <div
                    v-if="!videoUrl[i - 1]"
                    ref="emptyPlayer"
                    class="empty-player"
                  ></div>
                  <div v-else class="player-box" ref="videoBox">
                    <cloud-player
                      ref="cloudPlayer"
                      :stretch="isFill"
                      :tracks="tracks"
                      :isShowStream="isShowStream[i - 1]"
                      :onChangePlayTime="handleChangeCurrentTime"
                      :onPlayEnded="handleDevicesPlayEnded"
                      :onPlay="handleOnPlay"
                      :muted="isMuted"
                      :onPause="handleOnPause"
                      @dblclick.capture.stop
                      :videoUrl="videoUrl[i - 1]"
                      :playbackRate="speedArr[currentSpeed]"
                      :autoplay="play"
                      :playerIdx="playerIdx"
                      live
                    ></cloud-player>

                    <div class="player-header">
                      <span class="head-left">{{
                        recordLeftTopName[i - 1]
                      }}</span>
                      <div class="head-right">
                        <i
                          class="el-icon-close"
                          @click.stop="closeVideo(i - 1)"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 时间进度条 -->

            <div class="player-time">
              <template v-if="tabsActiveName === 'device'">
                <TimePlayer1
                  ref="TimePlayer"
                  :initTimeLists="initTimeLists"
                  :playerTimes="formData.date"
                  :timeLists="timeLists"
                  @handleChangeTime="handleChangeTime"
                  @handleChangePlayTime="handleChangePlayTime"
                  :playerIdx="playerIdx"
                  :clickedPbPause="clickedPbPause"
                  :timeSegments="timeSegments"
                  @handleCloseVideo="handleCloseVideo"
                  @gbPlay="gbPlay"
                />
              </template>
            </div>
            <div class="player-toolbar">
              <div class="toolbar-left">
                <el-tooltip
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
                  :content="isMuted ? '关闭声音' : '开启声音'"
                  placement="top"
                >
                  <i
                    :class="isMuted ? 'icon-wuyinliang' : 'icon-yinliang'"
                    @click="handleSetVolume()"
                  />
                </el-tooltip>
                <el-tooltip content="截屏" placement="top">
                  <i class="icon-jieping" />
                </el-tooltip>
                <el-tooltip content="下载" placement="top">
                  <i
                    :class="`icon-xiazai ${channelId ? '' : 'disabled'}`"
                    @click="handleDownload()"
                  />
                </el-tooltip>
                <el-tooltip
                  :content="
                    isShowStream[playerIdx] ? '显示码流信息' : '隐藏码流信息'
                  "
                  placement="top"
                >
                  <i
                    :class="`icon-xianshimaliuxinxi ${
                      isShowStream[playerIdx] ? 'active' : ''
                    }`"
                    @click="
                      videoUrl[playerIdx] &&
                      videoUrl[playerIdx] !== '' &&
                      videoUrl[playerIdx].length > 0
                        ? handleShowStream()
                        : ''
                    "
                  />
                </el-tooltip>
              </div>
              <div class="tool-center">
                <el-date-picker
                  v-model="selectTime"
                  class="toolbar-date-picker"
                  prefixIcon="data-picker-icon"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  :disabled="isClickCx"
                  key="datetime1"
                  placeholder="选择日期时间"
                  @change="handleChangeTimePicker"
                >
                </el-date-picker>

                <el-tooltip :content="play ? '暂停' : '播放'" placement="top">
                  <div
                    @click="
                      videoUrl[playerIdx] !== '' ? handlePauseOrPlay() : ''
                    "
                    :class="`play-btn ${play ? 'pause' : 'play'} ${
                      !cloudPlayerUrl && !videoUrl[playerIdx] !== ''
                        ? 'disabled'
                        : ''
                    }`"
                  />
                </el-tooltip>
                <div class="speed-box">
                  <el-tooltip content="减速" placement="top">
                    <span
                      @click="hasStreamId ? handleChangeSpeed('sub') : ''"
                      :class="`speed-icon speed-down ${
                        !hasStreamId ? 'disabled' : ''
                      }`"
                    />
                  </el-tooltip>
                  <span class="speed-text">{{ speedArr[currentSpeed] }}x</span>
                  <el-tooltip content="快进" placement="top">
                    <span
                      @click="hasStreamId ? handleChangeSpeed('plus') : ''"
                      :class="`speed-icon speed-up ${
                        !hasStreamId ? 'disabled' : ''
                      }`"
                    />
                  </el-tooltip>
                </div>
              </div>
              <div class="tool-right">
                <el-tooltip content="关闭全部" placement="top">
                  <i
                    @click="handleCloseVideo()"
                    class="iconfont icon-guanbiquanbu"
                  />
                </el-tooltip>

                <el-tooltip content="放大/缩小" placement="top">
                  <i
                    :class="`iconfont icon-fangda ${isZoom ? 'active' : ''}`"
                  />
                </el-tooltip>
                <el-tooltip
                  :content="isFill ? '拉伸' : '自适应'"
                  placement="top"
                >
                  <i
                    @click="handleChangeFill"
                    :class="`iconfont icon-zishiying ${isFill ? 'active' : ''}`"
                  ></i>
                </el-tooltip>
                <div class="split-box">
                  <el-dropdown placement="top">
                    <span class="split-text">
                      <svg-icon
                        class="iconfont white"
                        :icon-class="splitArr[spiltIndex].class"
                      />

                      <i class="el-icon-arrow-down iconArrow" />
                    </span>
                    <el-dropdown-menu
                      ref="dropdownMenu"
                      slot="dropdown"
                      class="dropmenu"
                      :append-to-body="false"
                    >
                      <template v-for="(item, index) in splitArr">
                        <el-dropdown-item :command="item" :key="item.num">
                          <div
                            @click="clickSpilt(item, index)"
                            style="padding: 0 16px"
                          >
                            <svg-icon
                              v-if="item.num === spilt"
                              class="iconfont btn fenping"
                              :icon-class="`${item.num}fenpinged`"
                            />
                            <svg-icon
                              v-else
                              class="iconfont btn fenping"
                              @mouseenter="changeHover(1, item.num)"
                              @mouseleave="changeHover(2, item.num)"
                              :icon-class="
                                !isMouseHover
                                  ? `${item.num}fenping`
                                  : index === isHoverNum
                                  ? splitArr[isHoverNum].fenpinged
                                  : `${item.num}fenping`
                              "
                            />
                          </div>
                        </el-dropdown-item>
                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <el-tooltip
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
import { Local } from '@/utils/storage'
import dayjs from 'dayjs'
import jPlayer from '../recordComponents/jessibuca.vue'
import cloudPlayer from '../recordComponents/cloudPlayer.vue'
import TimePlayer from '../recordComponents/TimePlayer.vue'
import TimePlayer1 from '../recordComponents/TimePlayer1.vue'
import MonitorEquipmentGroup from './monitorEquipmentGroup'
import DownloadVideoModal from '../recordComponents/DownloadVideoModal'
import { getVideoAraeTree } from '@/api/method/role'
import { getPlaybackList } from '@/api/method/moduleManagement'
import {
  getPlayBackUrlLists,
  getChannelPlayList,
  playStop,
  pauseRecordView,
  resumeRecordView,
  speedRecordView,
  getStreamInfo
} from '@/api/method/live'

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
    TimePlayer1,
    // flvJs,
    MonitorEquipmentGroup,
    DownloadVideoModal
  },
  data() {
    return {
      // isChildChange:false,
      isClickCx: true,
      spilt: 1, //分屏
      recordLeftTopName: [],
      spiltIndex: 0,
      playerIdx: 0, //激活播放器
      playerData: [], //播放器数据
      fullPlayerIdx: -1, //当前全屏的下标
      isMouseHover: false,
      hasStreamId: false,
      splitArr: [
        {
          num: 1,
          class: '1fenpingw',
          fenpinged: '1fenpinged',
          fenping: '1fenping'
        },
        {
          num: 4,
          class: '4fenpingw',
          fenpinged: '4fenpinged',
          fenping: '4fenping'
        },
        // {
        //   num: 6,
        //   class: '6fenpingw',
        //   fenpinged: '6fenpinged',
        //   fenping: '6fenping'
        // },
        // {
        //   num: 8,
        //   class: '8fenpingw',
        //   fenpinged: '8fenpinged',
        //   fenping: '8fenping'
        // },
        {
          num: 9,
          class: '9fenpingw',
          fenpinged: '9fenpinged',
          fenping: '9fenping'
        },
        {
          num: 16,
          class: '16fenpingw',
          fenpinged: '16fenpinged',
          fenping: '16fenping'
        }
      ],
      filterText: '',
      treeList: [],
      initTimeLists: [],
      initDatas: [],
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
      isFill: true, //是否拉伸视频
      isShowStream: [], //是否显示码流
      tracks: [],
      cloudPlay: false,
      isZoom: false, //放大缩小类型
      id: null,
      zoomStyle: {
        scale: 1,
        translateX: 0,
        translateY: 0
      },
      selectTime: new Date(new Date().setHours(0, 0, 0, 0)),
      isDragging: false, //拖拽中
      ZOOM_TYPE: ZOOM_TYPE,
      recordStartTime: null,
      cloudRecordStartTime: null,
      tabsActiveName: this.$route.params.type || 'device',
      formData: {
        type: '',
        date: [],
        loading: false
      },
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          // 把选择的第一个日期赋值给一个变量。
          this.choiceDate = minDate.getTime()
          // 如何你选择了两个日期了，就把那个变量置空
          if (maxDate) this.choiceDate = ''
        },
        disabledDate: (time) => {
          return (
            time.getTime() >
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            )
          )
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const temp = new Date()
              picker.$emit('pick', [
                new Date(temp.setHours(0, 0, 0, 0)),
                new Date(temp.setHours(23, 59, 59, 0))
              ])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const temp = new Date()
              temp.setTime(temp.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [
                new Date(temp.setHours(0, 0, 0, 0)),
                new Date(temp.setHours(23, 59, 59, 0))
              ])
            }
          },
          {
            text: '近3天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },

      deviceId: this.$route.params.deviceId,
      channelId: '',
      timeLists: [],
      videoUrl: [''],
      videoHistory: {
        date: '',
        searchHistoryResult: [] //媒体流历史记录搜索结果
      },
      speedArr: [0.25, 0.5, 1.0, 2.0, 4.0],
      currentSpeed: 2,
      isFullScreen: false,
      cloudPlayerUrl: [''],
      resOnlineState: '',
      recordStreamId: [''],
      recordCloudId: [''],
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
      ScurrentPage: this.$route.params.ScurrentPage,
      isNext: true,
      timeSegments: [],
      clickedPbPause: false,
      // 时间聚合
      resTimeLists: []
    }
  },
  created() {},

  mounted() {
    this.$refs.datetimerange1.placement = 'top'
    this.init()

    document.addEventListener('fullscreenchange', (e) => {
      // 监听到屏幕变化，更改全屏状态，该页面不能存在多个全屏元素
      this.isFullScreen = !this.isFullScreen
    })
    // this.isFill = []
    this.isShowStream = []
    this.videoUrl = []
    for (let i = 0; i < this.spilt; i++) {
      this.videoUrl[i] = ''
      // this.isFill[i] = true
      this.isShowStream[i] = false
      this.timeSegments[i] = [
        {
          name: '',
          beginTime: 0,
          endTime: 0,
          color: '#4797FF',
          startRatio: 0.65,
          endRatio: 0.9
        }
      ]
    }

    Local.set('playbackRate', 1)
  },
  computed: {
    liveStyle() {
      if (this.spilt == 1) {
        return { width: '100%', height: '100%' }
      } else if (this.spilt == 4) {
        return { width: '50%', height: '50%' }
      } else if (this.spilt == 9) {
        return { width: (1 / 3) * 100 + '%', height: (1 / 3) * 100 + '%' }
      } else if (this.spilt == 16) {
        return { width: '25%', height: '25%' }
      }
    }
  },
  methods: {
    mergeDatetimeRanges(datetimeRanges) {
      if (!Array.isArray(datetimeRanges)) return []

      // 转化为 Unix 时间戳并按照开始时间排序
      const sortedRanges = datetimeRanges
        .map((range) => ({
          startTime: Date.parse(range.startTime),
          endTime: Date.parse(range.endTime)
        }))
        .sort((a, b) => a.startTime - b.startTime)

      const merged = [sortedRanges[0]]

      for (let i = 1; i < sortedRanges.length; i++) {
        const prev = merged[merged.length - 1]
        const curr = sortedRanges[i]

        if (curr.startTime <= prev.endTime) {
          // 发生重叠
          prev.endTime =
            curr.endTime > prev.endTime ? curr.endTime : prev.endTime
        } else {
          // 无重叠，添加到结果中
          merged.push(curr)
        }
      }

      // 转化为日期时间格式
      const dateFormat = 'YYYY-MM-DD HH:mm:ss'
      console.log(
        '最终时间',
        merged.map((range) => ({
          startTime: dayjs(range.startTime).format(dateFormat),
          endTime: dayjs(range.endTime).format(dateFormat)
        }))
      )
      return merged.map((range) => ({
        startTime: dayjs(range.startTime).format(dateFormat),
        endTime: dayjs(range.endTime).format(dateFormat)
      }))
    },
    async init() {
      await getVideoAraeTree()
        .then((res) => {
          if (res.code === 0) {
            this.treeList = res.data
            this.initDatas = res.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 放大缩小视频容器
    toogleVideo(i) {
      if (this.fullPlayerIdx === -1) {
        this.fullPlayerIdx = i
      } else {
        this.fullPlayerIdx = -1
      }
    },
    // 点击分屏
    clickSpilt(item, i) {
      this.fullPlayerIdx = -1
      this.spilt = item.num
      this.spiltIndex = i
    },
    changeHover(num, value) {
      if (num === 1) {
        this.isMouseHover = true
        switch (value) {
          case 16:
            this.isHoverNum = 5
            break
          case 9:
            this.isHoverNum = 4
            break
          // case 8:
          //   this.isHoverNum = 3
          //   break
          // case 6:
          //   this.isHoverNum = 2
          //   break
          case 4:
            this.isHoverNum = 1
            break
          case 1:
            this.isHoverNum = 0
            break
          default:
            break
        }
      } else {
        this.isMouseHover = false
        switch (value) {
          case 16:
            this.isHoverNum = 5
            break
          case 9:
            this.isHoverNum = 4
            break
          // case 8:
          //   this.isHoverNum = 3
          //   break
          // case 6:
          //   this.isHoverNum = 2
          //   break
          case 4:
            this.isHoverNum = 1
            break
          case 1:
            this.isHoverNum = 0
            break
          default:
            break
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.areaNames && data.areaNames.indexOf(value) !== -1
      // }
    },

    async getPlaybackList(date, playStartTime = this.playTime) {
      // this.videoUrl = ['']
      this.videoHistory.searchHistoryResult = []
      let listData = this.deviceVideoList[date] || []
      // if (!listData.length) {

      await getPlaybackList({
        channelId: this.channelId,
        startTime: date[0],
        endTime: date[1]
      })
        .then((res) => {
          if (res.code === 0) {
            if (res.data && res.data.recordList.length > 0) {
              listData = res.data.recordList.map((item) => {
                const { startTime, endTime } = item
                item.duration =
                  (new Date(endTime).getTime() -
                    new Date(startTime).getTime()) /
                  1000
                return item
              })

              // 处理时间聚合
              // const testTime = [
              //   {
              //     startTime: '2023-06-06 00:00:00',
              //     endTime: '2023-06-06 00:30:00'
              //   },
              //   {
              //     startTime: '2023-06-06 01:00:00',
              //     endTime: '2023-06-06 01:30:00'
              //   },
              //   {
              //     startTime: '2023-06-06 01:00:00',
              //     endTime: '2023-06-06 02:30:00'
              //   },
              //   {
              //     startTime: '2023-06-06 04:00:00',
              //     endTime: '2023-06-06 05:30:00'
              //   }
              // ]
              // this.resTimeLists = []
              this.resTimeLists[this.playerIdx] =
                this.mergeDatetimeRanges(listData)

              console.log(
                'this.resTimeListsthis.resTimeLists',
                this.resTimeLists
              )
              // 查询初始化时间
              Local.set(
                `showTime${this.playerIdx}`,
                dayjs(
                  new Date(
                    this.resTimeLists[this.playerIdx][0].startTime
                  ).getTime()
                ).format('YYYY-MM-DD HH:mm:ss')
              )

              this.deviceVideoList = {
                [date]: listData
              }

              let array1 = []

              let params = {}

              this.resTimeLists[this.playerIdx].forEach((item, index) => {
                params = {
                  name: '',
                  beginTime: new Date(item.startTime).getTime(),
                  endTime: new Date(item.endTime).getTime(),
                  color: '#4797FF',
                  startRatio: 0.65,
                  endRatio: 0.9
                }
                array1.push(params)
              })

              this.timeSegments[this.playerIdx] = array1

              console.log(
                ' this.timeSegments~~~~~~~~~~~~~~~~~~~',
                this.timeSegments
              )
              this.hasStreamId = true

              this.playRecord(1, date, [
                this.resTimeLists[this.playerIdx][0].startTime,
                this.resTimeLists[this.playerIdx][
                  this.resTimeLists[this.playerIdx].length - 1
                ].endTime
              ])
            } else {
              this.$message({
                message: '设备没有录像数据',
                type: 'warning'
              })
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })

      this.formData.loading = false
    },
    switchTab(tab, event) {
      console.log(tab, event)
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
    async getDeviceList(id) {
      await getPlayLists({ channelId: id })
        .then((res) => {
          if (res.code === 0) {
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    async handleNodeClick(data, node, self) {
      this.resOnlineState = data.onlineState ? data.onlineState : ''
      if (!data.onlineState) {
        this.resArray = []
        if (this.detailsId.indexOf(data.id) !== -1) {
          return
        } else {
          if (data.onlineState === 0) {
            this.$message({
              message: '设备已经离线',
              type: 'warning'
            })
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
                        id: item.id,
                        ptzType: item.ptzType,
                        children: []
                      })
                    })

                    this.detailsId.push(data.id)
                    let arr = []
                    if (data.id === '1') {
                      arr = this.resArray.concat(this.initDatas[0].children)
                    } else {
                      arr = data.children
                        ? this.resArray.concat(data.children)
                        : this.resArray

                      const obj = {}
                      arr = arr.reduce((item, next) => {
                        obj[next.id]
                          ? ''
                          : (obj[next.id] = true && item.push(next))
                        return item
                      }, [])
                    }

                    this.$refs.recordViewTree.updateKeyChildren(data.id, arr)
                    this.defaultExpandedKeys = [data.id]
                  }
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
        }
      } else {
        // console.log('data~~~~~~~',data)
        this.channelId = data.areaPid || data.id
        this.setLeftTopName(data.areaNames, this.playerIdx)
      }
    },

    handleChangeTime(index) {
      if (
        Local.get(`showTime${index}`) === 'Invalid Date' ||
        !Local.get(`showTime${index}`)
      ) {
        this.selectTime = this.resTimeLists[this.playerIdx][0]
          ? this.resTimeLists[this.playerIdx][0].startTime
          : new Date(new Date().setHours(0, 0, 0, 0))
      } else {
        this.selectTime = Local.get(`showTime${index}`)
        // this.isChildChange=true
      }
    },
    handleChangeTimePicker(val) {
      console.log('handleChangeTimePicker', val)
      // Local.set('showTime', val)
      const isPlay = this.play

      if (
        new Date(this.formData.date[0]).getTime() < new Date(val).getTime() &&
        new Date(val).getTime() < new Date(this.formData.date[1]).getTime()
      ) {
        this.playRecord({}, [val, this.formData.date[1]])
      } else {
        this.$message({
          message: '该时间段暂无录像',
          type: 'warning'
        })
        this.$refs.TimePlayer.stopTimeAutoPlay(this.playerIdx)
        // this.handleCloseVideo(this.playerIdx)
        this.cloudPlay = this.play = false
        this.hasStreamId = false
        this.stopPlayRecord()
        this.videoUrl = ['']
        // this.$nextTick(() => {
        //   let emptyPlayerDom = this.$refs.emptyPlayer
        //   for (let i = 0; i < emptyPlayerDom.length; i++) {
        //     this.$refs.TimePlayer.stopTimeAutoPlay(i)
        //     this.timeSegments[i] = {
        //       name: '',
        //       beginTime: 0,
        //       endTime: 0,
        //       color: '#4797FF',
        //       startRatio: 0.65,
        //       endRatio: 0.9
        //     }
        //     // Local.set(
        //     //   `showTime${i}`,
        //     //   dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
        //     // )
        //     this.$refs.TimePlayer.changeChildTimeSegments(i)
        //   }
        // })
      }
      if (this.play) this.handlePauseOrPlay()

      // this.handleDevicesPlayEnded()
      if (isPlay) this.handlePauseOrPlay()
    },
    closeVideo(i) {
      this.videoUrl.splice(i, 1, '')
      this.timeLists.splice(i, 1, [])

      console.log('this.videoUrl~~~~~~~~~~~~~~', this.videoUrl)
      this.cloudPlay = this.play = false
      this.$nextTick(() => {
        this.timeSegments[i] = [
          {
            name: '',
            beginTime: 0,
            endTime: 0,
            color: '#4797FF',
            startRatio: 0.65,
            endRatio: 0.9
          }
        ]

        this.$refs.TimePlayer.changeChildTimeSegments(i)

        this.$refs.TimePlayer.stopTimeAutoPlay(i)
        Local.set(
          `showTime${i}`,
          dayjs(new Date(new Date().setHours(0, 0, 0, 0)).getTime()).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        )

        this.stopPlayRecord(i)
      })
    },
    // 关闭视频
    handleCloseVideo() {
      this.cloudPlay = this.play = false
      this.hasStreamId = false
      if (this.tabsActiveName === 'device') {
        this.stopPlayRecord()
        this.videoUrl = ['']
        this.videoUrl = [...this.videoUrl]
        this.timeLists = ['']
        this.timeLists = [...this.timeLists]
        this.currentList = ''
        this.currentSpeed = 2
      } else {
        this.cloudPlayerUrl = ['']
      }
      this.$nextTick(() => {
        let emptyPlayerDom = this.$refs.emptyPlayer
        for (let i = 0; i < emptyPlayerDom.length; i++) {
          this.$refs.TimePlayer.stopTimeAutoPlay(i)
          this.timeSegments[i] = [
            {
              name: '',
              beginTime: 0,
              endTime: 0,
              color: '#4797FF',
              startRatio: 0.65,
              endRatio: 0.9
            }
          ]
          Local.set(
            `showTime${i}`,
            dayjs(new Date(new Date().setHours(0, 0, 0, 0)).getTime()).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          )
          this.$refs.TimePlayer.changeChildTimeSegments(i)
        }
      })
    },
    // 查询视频
    handleSearch() {
      if (this.channelId && this.channelId.length > 0) {
        if (this.resOnlineState === 0) {
          this.$message({
            message: '设备离线',
            type: 'warning'
          })
          return
        }
        if (
          this.formData.date === '' ||
          this.formData.date.length === 0 ||
          this.formData.date === null ||
          this.formData.date === undefined
        ) {
          this.$message({
            message: '请选择时间',
            type: 'warning'
          })
          return
        }

        this.formData.loading = true

        this.dateChange(this.formData.date)
      } else {
        this.$message({
          message: '请选择设备节点',
          type: 'warning'
        })
        return
      }
    },

    setTimeLists(date, idx) {
      this.$set(this.timeLists, idx, date)

      console.log('this.timeLists------------------', this.timeLists)

      this.$refs.TimePlayer.changePlayerTimes(this.timeLists[idx], idx)

      this.$set(this.initTimeLists, idx, date[0])

      setTimeout(() => {
        window.localStorage.setItem('timeLists', JSON.stringify(this.timeLists))
      }, 100)
    },
    setLeftTopName(name, idx) {
      this.$set(this.recordLeftTopName, idx, name)

      setTimeout(() => {
        window.localStorage.setItem(
          'recordLeftTopName',
          JSON.stringify(this.recordLeftTopName)
        )
      }, 100)
    },
    setRecordStreamId(id, idx) {
      this.$set(this.recordStreamId, idx, id)

      setTimeout(() => {
        window.localStorage.setItem(
          'recordStreamId',
          JSON.stringify(this.recordStreamId)
        )
      }, 100)
    },
    setRecordCloudId(id, idx) {
      this.$set(this.recordCloudId, idx, id)

      setTimeout(() => {
        window.localStorage.setItem(
          'recordCloudId',
          JSON.stringify(this.recordCloudId)
        )
      }, 100)
    },

    //获取码流信息
    async getStreamInfo() {
      this.tracks = []
      await getStreamInfo({
        channelExpansionId: Local.get('recordCloudId')[this.playerIdx],
        streamId: Local.get('recordStreamId')[this.playerIdx]
      }).then((res) => {
        if (res.code === 0) {
          this.tracks = res.data.tracks
        } else {
          this.$message({
            showClose: true,
            message: '获取编码信息失败,',
            type: 'warning'
          })
        }
      })
    },
    //控制显示码流
    handleShowStream() {
      this.getStreamInfo()
      this.isShowStream[this.playerIdx] = !this.isShowStream[this.playerIdx]
    },
    //缩放拉伸屏幕
    handleChangeFill() {
      this.isFill = !this.isFill

      const dom = document.getElementsByClassName('player-box')

      this.$forceUpdate()
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
      this.play = false
      console.log('暂停播放设备视频')
      if (this.tabsActiveName === 'device') {
        this.gbPause()
      }
    },
    //监听播放视频事件
    handleOnPlay() {
      if (this.tabsActiveName === 'device') {
        this.gbPlay()
      }
      this.play = true
    },

    // 滚动时间轴事件
    handleChangePlayTime(curTime) {
      // console.log('拖拽时间轴事件==========', curTime)
      // console.log('拖拽时间轴事件==========', this.resTimeLists)
      const resStartTime = new Date(
        this.resTimeLists[this.playerIdx][0].startTime
      ).getTime()
      const resEndTime = new Date(
        this.resTimeLists[this.playerIdx][
          this.resTimeLists[this.playerIdx].length - 1
        ].endTime
      ).getTime()
      this.isNext = false
      if (this.resTimeLists[this.playerIdx].length > 1) {
        for (let i = 0; i < this.resTimeLists[this.playerIdx].length; i++) {
          const range = this.resTimeLists[this.playerIdx][i]
          const start = new Date(range.startTime).getTime() // 转换时间段开始时间
          const end = new Date(range.endTime).getTime() // 转换时间段结束时间
          if (curTime > start && curTime < end) {
            // 当前时间属于某个时间段，返回当前时间
            this.playRecord(
              {},
              [
                dayjs(curTime).format('YYYY-MM-DD HH:mm:ss'),
                this.resTimeLists[this.playerIdx][
                  this.resTimeLists[this.playerIdx].length - 1
                ].endTime
              ],
              [
                dayjs(curTime).format('YYYY-MM-DD HH:mm:ss'),
                this.resTimeLists[this.playerIdx][
                  this.resTimeLists[this.playerIdx].length - 1
                ].endTime
              ]
            )
            // console.log('时间有多段,拖拽的时间属于多段的第一段', i)
            return
          } else {
            if (
              curTime >= new Date(range.endTime).getTime() &&
              curTime <= new Date(this.resTimeLists[i + 1].startTime).getTime()
            ) {
              // 当前时间处于两个时间段之间，返回下一个时间段的开始时间
              this.playRecord(
                {},
                [
                  this.resTimeLists[this.playerIdx][i + 1].startTime,
                  this.resTimeLists[this.playerIdx][
                    this.resTimeLists[this.playerIdx].length - 1
                  ].endTime
                ],
                [
                  this.resTimeLists[this.playerIdx][i + 1].startTime,
                  this.resTimeLists[this.playerIdx][
                    this.resTimeLists[this.playerIdx].length - 1
                  ].endTime
                ]
              )
              // console.log(
              //   '时间有多段,拖拽的时间属于多段的第i段',
              //   i,
              //   this.resTimeLists[i + 1].startTime
              // )
              return
            }
          }
        }
      } else {
        if (curTime >= resStartTime && curTime <= resEndTime) {
          // 当前时间属于某个时间段，返回当前时间
          this.playRecord({}, this.formData.date, [
            dayjs(curTime).format('YYYY-MM-DD HH:mm:ss'),
            this.resTimeLists[this.playerIdx][
              this.resTimeLists[this.playerIdx].length - 1
            ].endTime
          ])
          return
          // console.log('时间只有一段,拖拽的时间在中间')
        } else {
          console.log('时间只有一段,拖拽的时间不在中间')
          this.$message({
            message: '该时间段暂无录像',
            type: 'warning'
          })

          this.$refs.TimePlayer.stopTimeAutoPlay(this.playerIdx)
          Local.set(
            `showTime${this.playerIdx}`,
            dayjs(curTime).format('YYYY-MM-DD HH:mm:ss')
          )
          this.selectTime = dayjs(curTime).format('YYYY-MM-DD HH:mm:ss')
          // this.handleCloseVideo(this.playerIdx)
          this.cloudPlay = this.play = false
          this.hasStreamId = false
          this.stopPlayRecord()
          this.videoUrl = ['']
          return
        }
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
      console.log('监听设备播放完毕,自动播放下一个视频', this.playTime)
      let minDateRecord,
        maxDiff = -99999999999
      if (this.tabsActiveName === 'device') {
        const date = this.playTime.format('YYYY-MM-DD')
        console.log(
          '播放结束或者报错停止设备播放' +
            this.playTime.format('YYYY-MM-DD HH:mm:ss')
        )
        // this.closeVideo(this.playerIdx)
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
          }
        }
      }
    },
    //点击暂停播放按钮
    handlePauseOrPlay() {
      console.log('点击了播放', this.play, this.playerIdx)
      if (this.play) {
        //暂停
        this.cloudPlay = this.play = false
        this.$refs.devicesPlayer && this.$refs.devicesPlayer.pause()
        this.$refs.cloudPlayer[this.playerIdx] &&
          this.$refs.cloudPlayer[this.playerIdx].pause()
        this.hasStreamId = false

        this.$refs.TimePlayer.stopTimeAutoPlay(this.playerIdx)
        this.isClickCx = false
      } else if (
        this.tabsActiveName === 'device' ? this.videoUrl : this.cloudPlayerUrl
      ) {
        //播放
        this.play = true
        this.hasStreamId = true
        this.$refs.devicesPlayer && this.$refs.devicesPlayer.play()
        this.$refs.cloudPlayer[this.playerIdx] &&
          this.$refs.cloudPlayer[this.playerIdx].play()
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

      if (this.cloudPlayerUrl !== row.recordUrl)
        //播放不同时间段视频
        this.cloudPlayerUrl = row.recordUrl

      if (skipTime) {
        //快进的时间段
        this.$nextTick(() => {
          this.$refs.cloudPlayer[this.playerIdx - 1] &&
            this.$refs.cloudPlayer[this.playerIdx - 1].setCurrentTime(
              parseInt(skipTime / 1000)
            )
        })
      }
    },
    // 日期更改
    dateChange(val) {
      const date = moment(val).format('YYYY-MM-DD')
      if (this.tabsActiveName === 'device') {
        this.videoHistory.date = date
        this.playTime = val

        this.getPlaybackList(val)
      } else {
        this.cloudPlayTime = val
        this.getCloudRecordVideo(date)
      }
    },
    stopPlayRecord: function (i) {
      if (!this.streamId) return
      this.$refs.devicesPlayer && this.$refs.devicesPlayer.pause()
      // this.videoUrl = ['']
    },

    playRecord: (function () {
      return async function (row, playTime, videoTime) {
        await playStop({
          streamId: this.channelId
        }).then((res) => {
          if (res.code === 0) {
            getPlayBackUrlLists({
              channelId: this.channelId,
              startTime: row.startTime ? row.startTime : videoTime[0],
              endTime: row.endTime ? row.endTime : videoTime[1]
            })
              .then((res) => {
                if (res.code === 0) {
                  // console.log(res.data.wsFlv.slice(5))
                  if (!this.isNext) {
                    this.setTimeLists(videoTime, this.playerIdx)
                    this.setPlayUrl(res.data.wsFlv, this.playerIdx)
                    this.setRecordStreamId(res.data.streamId, this.playerIdx)

                    this.setRecordCloudId(this.channelId, this.playerIdx)
                  } else {
                    this.setTimeLists(videoTime, this.playerIdx)
                    this.setPlayUrl(res.data.wsFlv, this.playerIdx)
                    this.setRecordStreamId(res.data.streamId, this.playerIdx)

                    this.setRecordCloudId(this.channelId, this.playerIdx)
                  }

                  this.streamId = res.data.streamId

                  this.play = true
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
        })
      }
    })(),
    setPlayUrl(url, idx) {
      this.$set(this.videoUrl, idx, url)

      setTimeout(() => {
        window.localStorage.setItem(
          'RecordViewVideoUrl',
          JSON.stringify(this.videoUrl)
        )
      }, 100)
      this.isNext = true
    },
    async gbPlay() {
      console.log('前端控制：播放')

      await resumeRecordView({
        channelId: this.channelId,
        speed: this.speedArr[this.currentSpeed],
        streamId: this.streamId
      }).then((res) => {
        if (res.code === 0) {
          this.clickedPbPause = false
          this.$refs.TimePlayer.timeAutoPlay(this.playerIdx)
          this.isClickCx = true
        }
      })
    },

    async gbPause() {
      console.log('前端控制：暂停', this.$refs.TimePlayer)

      await pauseRecordView({
        channelId: this.channelId,
        speed: this.speedArr[this.currentSpeed],
        streamId: this.streamId
      }).then((res) => {
        if (res.code === 0) {
          this.clickedPbPause = true
          this.$refs.TimePlayer.stopTimeAutoPlay(this.playerIdx)
          this.isClickCx = false
        }
      })
    },

    async gbScale(command) {
      console.log('前端控制：倍速 ' + command)
      this.$refs.TimePlayer.stopTimeAutoPlay(this.playerIdx)
      await speedRecordView({
        channelId: this.channelId,
        speed: command,
        streamId: this.streamId
      }).then((res) => {
        if (res.code === 0) {
          Local.set('playbackRate', command)

          this.$refs.TimePlayer.timeAutoPlay(this.playerIdx)
        }
      })
    },

    videoClick(i) {
      this.playerIdx = i - 1
      if (!this.clickedPbPause) {
        this.$refs.TimePlayer.timeAutoPlay(this.playerIdx)
        // this.play = true
      } else {
        // this.play = false
      }
    }
  },
  watch: {
    selectTime(newVal, oldVal) {
      if (!this.videoUrl[this.playerIdx]) {
        return
      }
      let selectNowTime = this.resTimeLists[this.playerIdx]
        ? new Date(this.resTimeLists[this.playerIdx].startTime).getTime()
        : new Date(new Date().setHours(0, 0, 0, 0))
      selectNowTime = new Date(newVal).getTime()
      const selectOldTime = new Date(oldVal).getTime()
      const selectStartTime = new Date(
        this.resTimeLists[this.playerIdx][0].startTime
      ).getTime()
      const selectEndTime = new Date(
        this.resTimeLists[this.playerIdx][
          this.resTimeLists[this.playerIdx].length - 1
        ].endTime
      ).getTime()

      if (this.resTimeLists[this.playerIdx].length > 1) {
        for (let i = 0; i < this.resTimeLists[this.playerIdx].length; i++) {
          const range1 = this.resTimeLists[this.playerIdx][i]
          const start1 = new Date(range1.startTime).getTime() // 转换时间段开始时间
          const end1 = new Date(range1.endTime).getTime() // 转换时间段结束时间
          if (selectNowTime > start1 && selectNowTime < end1) {
          } else {
            if (selectNowTime === new Date(range1.endTime).getTime()) {
              // 当前时间处于两个时间段之间，返回下一个时间段的开始时间
              this.playRecord(
                {},
                [
                  this.resTimeLists[this.playerIdx][i + 1].startTime,
                  this.resTimeLists[this.playerIdx][
                    this.resTimeLists[this.playerIdx].length - 1
                  ].endTime
                ],
                [
                  this.resTimeLists[this.playerIdx][i + 1].startTime,
                  this.resTimeLists[this.playerIdx][
                    this.resTimeLists[this.playerIdx].length - 1
                  ].endTime
                ]
              )
              return
            }
          }
        }
      } else {
        if (
          selectNowTime >= selectStartTime &&
          selectNowTime <= selectEndTime
        ) {
          console.log('有录像')
        } else {
          this.$nextTick(() => {
            console.log('1111111111', newVal, this.resTimeLists, this.playerIdx)
            this.$message({
              message: '该时间段暂无录像',
              type: 'warning'
            })
            this.$refs.TimePlayer.stopTimeAutoPlay(this.playerIdx)
            this.cloudPlay = this.play = false
            this.hasStreamId = false
            this.stopPlayRecord()
            this.videoUrl = ['']
            return
          })
        }
      }
    },
    cloudPlayTime(newVal, oldVal) {
      this.datePickerCloudPlayTime = newVal
    },
    filterText(val) {
      this.$refs.recordViewTree.filter(val)
    },
    treeList(n) {
      this.treeList = n
    },
    playerIdx(val) {},
    spilt(newValue) {
      let resTimeSegments = []
      let resVideoUrl = []

      if (newValue < this.videoUrl.length) {
        this.videoUrl = this.videoUrl.slice(0, newValue)
        this.timeSegments = this.timeSegments.slice(0, newValue)
      } else if (newValue > this.videoUrl.length) {
        for (let i = 0; i < newValue; i++) {
          if (i >= this.videoUrl.length) {
            resVideoUrl.push('')
            resTimeSegments.push([
              {
                name: '',
                beginTime: 0,
                endTime: 0,
                color: '#4797FF',
                startRatio: 0.65,
                endRatio: 0.9
              }
            ])
          }
        }
        this.videoUrl = this.videoUrl.concat(resVideoUrl)

        this.timeSegments = this.timeSegments.concat(resTimeSegments)
        console.log('this.$refs', this.$refs)
        // this.$refs.TimePlayer.spiltChangePlayerTimes(
        //   [this.timeSegments[this.playerIdx]],
        //   this.playerIdx
        // )
      } else {
      }
    }
  },
  beforeDestroy() {
    if (this.streamId) {
      this.stopPlayRecord()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  height: 36px;
  width: 97%;
  margin: 0 5px;
}
::v-deep .el-range-separator {
  line-height: 28px;
}
::v-deep .el-picker-panel__sidebar {
  width: 136px !important;
}
::v-deep .el-picker-panel__body {
  margin-left: 136px !important;
}

::v-deep .el-picker-panel__shortcut {
  width: 104px !important;
  height: 31px !important;
  background: #ffffff;
  border-radius: 4px !important;
  border: 1px solid #ecf0f3 !important;
  margin-left: 10% !important;
  padding-left: 27% !important;
}

::v-deep .tree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
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
::v-deep .el-tabs__nav-scroll {
  &::after {
    display: none;
  }
}
::v-deep .el-tabs__active-bar {
  margin-left: 16px;
}

::v-deep .el-tabs__item {
  background-color: #fff !important;
  margin-left: 16px;
  font-size: 16px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #0270ff;
  &::after {
    display: none;
  }
}
#recordPlayerLayout {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #fff;
  position: relative;
  height: 100%;
  .grid1 {
    grid-template-columns: 100%;
    grid-template-rows: 100%;
  }
  .grid4 {
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(2, 50%);
  }
  .grid6 {
    grid-template-areas:
      'one one .'
      'one one .'
      '. . .';
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(3, 33.33%);
    .box1 {
      grid-area: one;
    }
  }
  .grid8 {
    grid-template-areas:
      'one one one .'
      'one one one .'
      'one one one .'
      '. . . .';
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(4, 25%);
    .box1 {
      grid-area: one;
    }
  }
  .grid9 {
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(3, 33.33%);
  }

  .grid16 {
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(4, 25%);
  }

  .empty-player {
    width: 200px;
    height: 100px !important;
    background: url('../../../../assets/imgs/player_logo.png') center/cover
      no-repeat;
  }
}
.dbl-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.full-play-box {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: #595959;
}
.monitoring-content-box {
  height: calc(100% - 0px);
  .left-tree {
    width: 20%;
    max-width: 480px;
    background-color: #fff;
    margin-right: 16px;
    height: 100%;
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
      .el-tabs__nav-wrap {
        padding: 0px 24px 0;
      }
    }
  }
  .equipment-group-wrapper-bottom {
    // flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 50%;
    text-align: center;

    .wrapper-bottom-content {
      flex: 1;
      overflow-y: auto;
    }
  }
  .securityArea_container {
    background: #ffffff;
    margin-left: 10px;
    height: 660px;
    width: 360px;
    margin-top: -15px;
    background: #ffffff;
    .tree {
      max-height: calc(100% - 110px);
      overflow-y: auto;
    }
  }
}
.main-box {
  width: 100%;
  height: calc(100vh - 258px);
  display: grid;
  flex-wrap: wrap;
  background-color: #000000;
  position: relative;
}
.redborder {
  border: 2px solid #1890ff !important;
}
.play-box {
  position: relative;
  border: 2px solid #505050;
  box-sizing: border-box;
  user-select: none;
}
.play-box.isFull {
  position: static;
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
.player-container-else {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #545556;
  position: relative;
  .trank {
    width: 380px;
    height: 180px;
    text-align: left;
    overflow: auto;
    position: absolute;
    color: red;
    font-size: 0.75rem;
    bottom: 20px;
    left: 20px;
    box-sizing: border-box;
  }
  .trankInfo {
    width: 100%;
    padding: 0 10%;
    text-shadow: 1px 1px black;
  }
}
.player-container {
  height: 100%;

  width: 80%;
  display: grid;
  background-color: #545556;
  position: relative;

  .trank {
    width: 380px;
    height: 180px;
    text-align: left;
    // padding: 0 10%;
    overflow: auto;
    position: absolute;
    color: red;
    font-size: 0.75rem;
    bottom: 20px;
    left: 20px;
    box-sizing: border-box;
  }
  .trankInfo {
    width: 100%;
    padding: 0 10%;
    text-shadow: 1px 1px black;
  }
}
.player-box {
  flex: 1;
  position: relative;
  // height: 100%;
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
  .head-right {
    cursor: pointer;
  }
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
      width: 210px;
      margin-top: 8px;

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
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: inline-block;
      position: relative;
      top: 7px;
      left: -1px;

      &.play {
        background: url('../../../../assets/imgs/player_pause.png') no-repeat;
        background-size: cover;
      }

      &.pause {
        background: url('../../../../assets/imgs/player_play.png') no-repeat;
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
      width: 24px;
      height: 24px;
      cursor: pointer;
      position: relative;
      top: 5px;
      left: -20px;
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

.operation_box {
  height: 100%;
}
::v-deep .tree {
  margin-left: 0px;
}
/* 树形结构节点添加连线 */
::v-deep .el-tree-node {
  position: relative;
  padding-left: 8px;
}
::v-deep .el-tree-node__content {
  height: 32px;
  padding-left: 0px !important;
}

::v-deep .el-tree-node__children {
  padding-left: 14px;
}

::v-deep .el-tree-node :last-child:before {
  height: 38px;
}

::v-deep .el-tree > .el-tree-node:before {
  border-left: none;
}
::v-deep .tree-container .el-tree > .el-tree-node:after {
  border-top: none;
}

::v-deep .el-tree-node__children .el-tree-node:before {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

::v-deep .el-tree-node:after {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
::v-deep .el-tree-node__expand-icon.is-leaf {
  // display: none;
  padding-left: 4px;
}

::v-deep .el-tree-node:before {
  content: '';
  height: 100%;
  width: 1px;
  position: absolute;
  left: -3px;
  top: -22px;
  border-width: 1px;
  border-left: 1px solid #dddddd;
}

::v-deep .el-tree-node:after {
  content: '';
  width: 24px;
  height: 20px;
  position: absolute;
  left: -4px;
  top: 16px;
  border-width: 1px;
  border-top: 1px solid #dddddd;
}
.tree .custom-tree-node {
  // padding-left: 10px;
}
// 去掉顶部线条
::v-deep .tree {
  max-height: calc(100% - 70px);
  overflow-y: auto;
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }
}

// 滚动条大小设置
.tree::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
.tree::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
.tree::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
.tree::-webkit-scrollbar-corner {
  background-color: #111;
}

.tree1,
.tree2,
.tree3 {
  width: 20px;
  height: 20px;
}
.tree-content {
  width: 310px;
  height: calc(100% - 20px);
  text-align: center;

  .search-input {
    width: 286px;
    height: 36px;
    background: #ffffff;
    border-radius: 2px;
    margin: 20px 0 10px 0;
  }
  input::-webkit-input-placeholder {
    font-size: 16px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
