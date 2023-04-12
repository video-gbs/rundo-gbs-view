<template>
  <div id="devicePosition" style="height: 100%; width: 100%">
    <el-container style="height: 100%">
      <el-main
        style="display: flex; flex-direction: column"
        class="monitoring-content-box"
      >
        <div style="display: flex; flex-direction: row; height: 100%">
          <div class="left-tree" v-show="isShowMenu">
            <div class="equipment-group-wrapper">
              <div class="equipment-group-wrapper-top">
                <el-tabs
                  v-model="activeTab"
                  @tab-click="switchTab"
                  class="real-time-monitoring"
                >
                  <el-tab-pane label="安防" name="security" class="live-pane">
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
                            ref="liveTree"
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
                <div class="wrapper-bottom-header" @click="controlColla">
                  <div class="bottom-header-name">云台控制</div>
                  <transition name="el-zoom-in-center">
                    <i class="el-icon-arrow-up" v-if="showContent"></i>
                    <i class="el-icon-arrow-down" v-else></i>
                  </transition>
                </div>
                <transition name="el-fade-in-linear">
                  <div class="wrapper-bottom-content" v-show="showContent">
                    <cloud-control
                      ref="cloudControl"
                      :deviceData="playerData[playerIdx]"
                      :childOptionLists="childOptionLists"
                      :channelExpansionId="channelExpansionId"
                      :cloudId="cloudId"
                      :showContentList="videoUrl"
                      :playerIdx="playerIdx"
                      :showContent1="videoUrl"
                      :playerIdx1="playerIdx"
                      @changeOptionLists="changeOptionLists"
                      @changeChildOptionLists="changeChildOptionLists"
                      @rectZoomInit="rectZoomInit"
                    />
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <div id="playerMain">
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
                v-loading="playerData[i - 1] && !videoUrl[i - 1]"
                element-loading-text="拼命加载中"
                element-loading-background="transparent"
              >
                <div
                  @dblclick="toogleVideo(i)"
                  class="dbl-box"
                  :class="fullPlayerIdx === i ? 'full-play-box' : ''"
                >
                  <div v-if="!videoUrl[i - 1]" class="empty-player"></div>
                  <div v-else class="player-box" ref="videoBox">
                    <player
                      :ref="'player' + i"
                      :videoUrl="videoUrl[i - 1]"
                      :flvStreamId="flvStreamId[i - 1]"
                      :flvCloudId="flvCloudId[i - 1]"
                      :deviceData="playerData[i - 1] || {}"
                      fluent
                      autoplay
                      :height="true"
                      :idx="'player' + i"
                      :index="i - 1"
                      @screenshot="shot"
                      @destroy="destroy"
                      @close="closeVideo"
                      :stretch="isFill"
                      :hasAudio="hasAudio"
                      :boxSelectionNum="i - 1"
                      :channelExpansionId="channelExpansionId"
                      :playerIdx="playerIdx"
                      @showPlayerBoxMini="showPlayerBoxMini"
                    ></player>
                    <div ref="rectArea" class="rect"></div>

                    <div
                      ref="videoZoom"
                      class="video-zoom"
                      v-show="isClicked[i]"
                    >
                      <div class="player-box-mini">
                        <playerMini
                          :ref="'player1' + i"
                          :videoUrl="videoUrl[i - 1]"
                          :deviceData="playerData[i - 1] || {}"
                          fluent
                          autoplay
                          :height="true"
                          :idx="'player1' + i"
                          :index="i - 1"
                          @screenshot="shot"
                          @destroy="destroy"
                          @close="closeVideo"
                          :stretch="isFill"
                          :hasAudio="hasAudio"
                        ></playerMini>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div :class="`player-toolbar ${splitFullscreen ? 'full' : ''}`">
              <div class="tool-left">
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
                <el-tooltip
                  effect="dark"
                  :content="hasAudio ? '开启全部声音' : '关闭全部声音'"
                  placement="top"
                >
                  <i
                    :class="`iconfont ${
                      hasAudio ? 'icon-yinliang' : 'icon-wuyinliang'
                    }`"
                    @click="handleSetVoice"
                  ></i>
                </el-tooltip>
                <el-tooltip effect="dark" content="截屏" placement="top">
                  <i
                    class="iconfont icon-jieping"
                    @click="handleScreenShot"
                  ></i>
                </el-tooltip>
              </div>

              <div class="tool-center"></div>
              <div class="tool-right">
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

                <el-tooltip effect="dark" content="关闭全部" placement="top">
                  <i
                    @click="handleCloseAll()"
                    class="iconfont icon-guanbiquanbu"
                  />
                </el-tooltip>
                <div class="split-box">
                  <el-dropdown @command="switchSplit" placement="top">
                    <span class="split-text">
                      <svg-icon
                        class="iconfont white"
                        :icon-class="splitArr[spiltIndex].class"
                      />

                      <i class="el-icon-arrow-down iconArrow" />
                      |
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
                  effect="dark"
                  :content="splitFullscreen ? '退出全屏' : '全屏'"
                  placement="top"
                >
                  <i
                    @click="fullscreenSwich"
                    :class="
                      'iconfont ' +
                      (splitFullscreen
                        ? 'icon-tuichuquanping'
                        : 'icon-quanping')
                    "
                  ></i>
                </el-tooltip>
              </div>
            </div>
            <div ref="dropdownMenuPlace" class="dropdownMenuPlace"></div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import player from './components/flvjs.vue'
import playerMini from './components/flvjsMini.vue'

import PlayerTool from './components/playerTool.vue'
import monitorEquipmentGroup from './components/monitorEquipmentGroup.vue'
import cloudControl from './components/cloudControl.vue'
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'

import { getPlayLists, getChannelPlayList } from '@/api/method/live'
import { getVideoAraeTree } from '@/api/method/role'
import { Local } from '@/utils/storage'
import { ptzPresetLists } from '@/api/method/live'

export default {
  name: 'live',
  components: {
    player,
    playerMini,
    PlayerTool,
    monitorEquipmentGroup,
    cloudControl,
    leftTree
  },
  data() {
    return {
      is3d: false,
      channelExpansionId: [],
      videoZoomShow: false,
      videoShow: true,
      videoZoomFlag: false,
      player: {},
      // 视频播放窗口起始点位置
      top: 0,
      left: 0,
      // 记录鼠标按下时的坐标
      downX: 0,
      downY: 0,
      // 记录鼠标抬起时候的坐标
      mouseX: 0,
      mouseY: 0,
      //拖拽选择框DOM元素
      rect: null,
      rectAreaNum: 0,
      // 是否需要(允许)处理鼠标的移动事件,默认识不处理
      select: false,
      // 监控局部放大请求数据
      rectInfo: {
        videoWidth: 0,
        videoHeight: 0,
        rectWidth: 0,
        rectHeight: 0,
        rectCenterOffsetX: 0,
        rectCenterOffsetY: 0
      },
      rectInfo1: {
        rectWidth: 0,
        rectHeight: 0,
        rectCenterOffsetX: 0,
        rectCenterOffsetY: 0
      },
      hasVideoUrl: [],
      isClicked: [],
      isBoxSelection: false,
      activeTab: 'security',
      showVideoDialog: true,
      hasAudio: false, //设置默认是否静音
      videoUrl: [''],
      flvStreamId: [''],
      flvCloudId: [''],
      showContent: false, // 展示面板内容
      spilt: 4, //分屏
      spilt1: 4, //分屏
      spiltIndex: 1,
      isFill: true, //是否拉伸视频
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
        {
          num: 6,
          class: '6fenpingw',
          fenpinged: '6fenpinged',
          fenping: '6fenping'
        },
        {
          num: 8,
          class: '8fenpingw',
          fenpinged: '8fenpinged',
          fenping: '8fenping'
        },
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
      playerIdx: 0, //激活播放器
      playerData: [], //播放器数据
      fullPlayerIdx: -1, //当前全屏的下标

      deviceList: [], //设备列表
      deviceList_: [],
      currentDevice: {}, //当前操作设备对象
      splitFullscreen: false, //分屏播放器全屏

      videoComponentList: [],
      updateLooper: 0, //数据刷新轮训标志
      currentDeviceChannelsLenth: 0,
      winHeight: window.innerHeight - 200,
      currentPage: 1,
      count: 15,
      total: 0,
      getDeviceListLoading: false,

      //channel
      searchSrt: '',
      channelType: '',
      online: '',
      channelTotal: 0,
      deviceChannelList: [],
      loading: false,
      videoActiveArr: [],
      isShowMenu: true, //是否展示菜单
      hasAudio: true,
      treeList: [],
      initData: [],
      areaNames: 'areaNames',
      detailsId: [],
      data: [],
      filterText: '',
      hasChannel: false,
      resArray: [],
      isMouseHover: false,
      isHoverNum: 0,
      cloudId: null,
      childOptionLists: []
    }
  },
  mounted() {
    this.init()

    document.addEventListener('fullscreenchange', (e) => {
      // 监听到屏幕变化，更改全屏状态，该页面不能存在多个全屏元素
      this.splitFullscreen = !this.splitFullscreen
    })
    this.$refs.dropdownMenuPlace.appendChild(this.$refs.dropdownMenu.popperElm)
    this.videoUrl = []
    for (let i = 0; i < this.spilt; i++) {
      this.isClicked[i] = false
      this.videoUrl[i] = ''
      this.childOptionLists[i] = []
      this.channelExpansionId[i] = []
    }
  },
  created() {
    window.localStorage.setItem('videoUrl', JSON.stringify(this.videoUrl))
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
  watch: {
    filterText(val) {
      this.$refs.liveTree.filter(val)
    },
    videoActiveArr(n) {
      // console.log('nnnnn', n)
    },
    childOptionLists(n) {
      // console.log('nnnnn', n)
    },
    treeList(n) {
      // console.log('nnnnn', n)
      this.treeList = n
    },
    spilt(newValue) {
      console.log('切换画幅;' + newValue)
      let resVideoUrl = []
      let resChildOptionLists = []
      let resChannelExpansionId = []
      // let that = this
      if (newValue < this.videoUrl.length) {
        this.videoUrl = this.videoUrl.slice(0, newValue)
        this.childOptionLists = this.childOptionLists.slice(0, newValue)
        this.channelExpansionId = this.channelExpansionId.slice(0, newValue)
        console.log('切换画幅小于之前', this.videoUrl, this.childOptionLists)
      } else if (newValue > this.videoUrl.length) {
        for (let i = 0; i < newValue; i++) {
          if (i >= this.videoUrl.length) {
            resVideoUrl.push('')
            resChildOptionLists.push([])
          }
        }
        this.videoUrl = this.videoUrl.concat(resVideoUrl)
        this.childOptionLists =
          this.childOptionLists.concat(resChildOptionLists)
        this.channelExpansionId = this.channelExpansionId.concat(
          resChannelExpansionId
        )
        console.log('切换画幅大于之前', this.videoUrl, this.childOptionLists)
      } else {
        console.log('切换画幅等于之前', this.videoUrl)
      }
      this.isClicked = []
      for (let i = 0; i < newValue; i++) {
        this.isClicked[i] = false
      }
      for (let i = 1; i <= newValue; i++) {
        if (!this.$refs['player' + i]) {
          continue
        }
        this.$nextTick(() => {
          if (this.$refs['player' + i] instanceof Array) {
          } else {
            this.$refs['player' + i].resize()
          }
        })
      }
      window.localStorage.setItem('split1', newValue)
    },
    '$route.fullPath': 'checkPlayByParam'
  },
  destroyed() {
    clearTimeout(this.updateLooper)
    document.removeEventListener('fullscreenchange', () => {})
  },
  methods: {
    async init() {
      await getVideoAraeTree()
        .then((res) => {
          if (res.code === 0) {
            this.treeList = res.data

            this.initData = res.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    changeOptionLists(index, id) {
      this.childOptionLists[index] = this.childOptionLists[index].filter(
        (item) => {
          return item.presetId !== this.id
        }
      )
    },
    async changeChildOptionLists(id, index) {
      await ptzPresetLists({ channelExpansionId: id }).then((res) => {
        if (res.code === 0) {
          this.$nextTick(() => {
            this.childOptionLists[index] = res.data
            this.$forceUpdate()
            console.log(this.$refs)
            this.$refs.cloudControl.getOptionLists(index)
          })
        }
      })
    },
    async getPtzPresetLists(id, index) {
      await ptzPresetLists({ channelExpansionId: id }).then((res) => {
        if (res.code === 0) {
          this.childOptionLists[index] = res.data

          this.channelExpansionId[index] = id
        }
      })
    },

    //  为视频播放窗口初始化拉框放大功能
    rectZoomInit(index, val, name) {
      console.log('进入框选', index, val, name)

      this.$nextTick(() => {
        if (val) {
          if (name === '3d') {
            this.is3d = true
          } else {
            this.is3d = false
          }
          this.rect = false
          // this.rectInfo.rectWidth = 0
          // this.rectInfo.rectHeight = 0
          // this.rectInfo.rectCenterOffsetX = 0
          // this.rectInfo.rectCenterOffsetY = 0
          this.$refs.videoBox[index].addEventListener('mousedown', this.down)
          this.$refs.videoBox[index].addEventListener('mousemove', this.move)
        } else {
          this.rect = true

          if (this.rectInfo1.rectWidth > 0 && this.rectInfo1.rectHeight > 0) {
            this.$refs.cloudControl.$refs.directionControl.ptzEnlarge(
              2,
              this.rectInfo1.rectWidth,
              this.rectInfo1.rectHeight,
              this.rectInfo1.rectCenterOffsetX,
              this.rectInfo1.rectCenterOffsetY
            )
          }
        }
      })
    },
    // 鼠标按下
    down($event) {
      if (!this.rect) {
        // 获取鼠标按下时的坐标位置
        this.downX = $event.clientX
        this.downY = $event.clientY

        // 鼠标按下时才允许处理鼠标的移动事件
        this.select = true
        this.rect = this.$refs.rectArea[this.rectAreaNum]
        // 播放器窗口离浏览器窗口顶部距离
        this.top =
          this.$refs.videoBox[this.rectAreaNum].getBoundingClientRect().top
        // 播放器窗口离浏览器窗口左侧距离

        this.left =
          this.$refs.videoBox[this.rectAreaNum].getBoundingClientRect().left

        // 获取播放器窗口大小
        this.rectInfo.videoHeight =
          this.$refs.videoBox[this.rectAreaNum].offsetHeight
        this.rectInfo.videoWidth =
          this.$refs.videoBox[this.rectAreaNum].offsetWidth
        this.$refs.videoBox[this.rectAreaNum].style.height =
          this.rectInfo.videoHeight + 'px'

        // 添加鼠标抬起事件
        document.addEventListener('mouseup', this.up)
      }
    },
    //  鼠标移动
    move($event) {
      if (this.select && this.rect) {
        // 获取鼠标移动时的坐标位置
        this.mouseX = $event.clientX
        this.mouseY = $event.clientY

        // console.log('获取鼠标按下时的坐标位置~~~~~',this.downX, this.downY)
        // console.log('获取鼠标移动时的坐标位置！！！！！',this.mouseX, this.mouseY)

        // A(左上) part
        if (this.mouseX < this.downX && this.mouseY < this.downY) {
          this.rect.style.left = this.mouseX - this.left + 'px'
          this.rect.style.top = this.mouseY - this.top + 'px'
          this.videoZoomFlag = false
        }
        // B(右上) part
        if (this.mouseX > this.downX && this.mouseY < this.downY) {
          this.rect.style.left = this.downX - this.left + 'px'
          this.rect.style.top = this.mouseY - this.top + 'px'
          this.videoZoomFlag = false
        }
        // C(左下) part
        if (this.mouseX < this.downX && this.mouseY > this.downY) {
          this.rect.style.left = this.mouseX - this.left + 'px'
          this.rect.style.top = this.downY - this.top + 'px'
          this.videoZoomFlag = false
        }
        // D(右下) part
        if (this.mouseX > this.downX && this.mouseY > this.downY) {
          this.rect.style.left = this.downX - this.left + 'px'
          this.rect.style.top = this.downY - this.top + 'px'
          this.videoZoomFlag = true
        }
        // 选择框大小
        this.rect.style.width = Math.abs(this.mouseX - this.downX) + 'px'
        this.rect.style.height = Math.abs(this.mouseY - this.downY) + 'px'
        // 选择框显示
        this.rect.style.visibility = 'visible'
      }
    },
    //  鼠标抬起
    up() {
      //鼠标抬起后不允许处理鼠标移动事件
      this.select = false
      if (this.rect.style.visibility !== 'hidden') {
        // 获取选择框大小
        this.rectInfo.rectWidth = Math.abs(this.mouseX - this.downX)
        this.rectInfo.rectHeight = Math.abs(this.mouseY - this.downY)

        console.log(
          '获取选择框大小',
          this.rectInfo.rectWidth,
          this.rectInfo.rectHeight
        )

        // 获取选择框中心坐标
        this.rectInfo.rectCenterOffsetX =
          parseInt(this.rect.style.left) + this.rectInfo.rectWidth / 2

        this.rectInfo.rectCenterOffsetY =
          parseInt(this.rect.style.top) + this.rectInfo.rectHeight / 2

        console.log(
          '获取选择框中心坐标',
          this.rectInfo.rectCenterOffsetX,
          this.rectInfo.rectCenterOffsetY
        )

        //框选区域大小按视频播放窗口宽高比转换使框选部分放大后显示不失真
        let rectRate = this.rectInfo.rectWidth / this.rectInfo.rectHeight

        let videoRate = this.rectInfo.videoWidth / this.rectInfo.videoHeight

        // console.log('获取播放窗口宽高比~~~~~~~~~~~~~', rectRate)

        // console.log('获取初始化播放窗口宽高比~~~~~~~~~~~~~', videoRate)
        // if (rectRate < videoRate) {
        //   // 处理框选部分宽高比小于播放窗口宽高比的情况
        //   this.rectInfo.rectWidth = this.rectInfo.rectHeight * videoRate
        //   if (this.rectInfo.rectCenterOffsetX < this.rectInfo.rectWidth / 2) {
        //     // 框选部分在播放窗口左侧边缘
        //     this.rectInfo.rectCenterOffsetX = this.rectInfo.rectWidth / 2
        //   }
        //   if (
        //     this.rectInfo.rectCenterOffsetX + this.rectInfo.rectWidth / 2 >
        //     this.rectInfo.videoWidth
        //   ) {
        //     this.rectInfo.rectCenterOffsetX =
        //       this.rectInfo.videoWidth - this.rectInfo.rectWidth / 2
        //   }
        // } else if (rectRate > videoRate) {
        //   // 处理框选部分宽高比大于播放窗口宽高比的情况
        //   this.rectInfo.rectHeight = this.rectInfo.rectWidth / videoRate
        //   if (this.rectInfo.rectCenterOffsetY < this.rectInfo.rectHeight / 2) {
        //     // 处理框选部分在播放窗口顶部边
        //     this.rectInfo.rectCenterOffsetY = this.rectInfo.rectHeight / 2
        //   }
        //   if (
        //     this.rectInfo.rectCenterOffsetY + this.rectInfo.rectHeight / 2 >
        //     this.rectInfo.videoHeight
        //   ) {
        //     //
        //     this.rectInfo.rectCenterOffsetY =
        //       this.rectInfo.videoHeight - this.rectInfo.rectHeight / 2
        //   }
        // }
        // if (this.is3d) {
        console.log(
          'this.rectInfo.rectCenterOffsetX',
          this.rectInfo.rectCenterOffsetX
        )
        console.log(
          'this.rectInfo.rectCenterOffsetY',
          this.rectInfo.rectCenterOffsetY
        )
        if (this.rectInfo.rectWidth > 0 && this.rectInfo.rectHeight > 0) {
          this.$refs.cloudControl.$refs.directionControl.ptzEnlarge(
            1,
            this.rectInfo.rectWidth,
            this.rectInfo.rectHeight,
            this.rectInfo.rectCenterOffsetX,
            this.rectInfo.rectCenterOffsetY
          )
        }
        this.rectInfo1.rectWidth = this.rectInfo.rectWidth
        this.rectInfo1.rectHeight = this.rectInfo.rectHeight

        this.rectInfo1.rectCenterOffsetX = this.rectInfo.rectCenterOffsetX
        this.rectInfo1.rectCenterOffsetY = this.rectInfo.rectCenterOffsetY
        // } else {
        //   this.handleVideo()
        // }
      }
      //重置选择框
      this.resetRect()
    },
    //  视频处理
    handleVideo() {
      if (!this.videoZoomFlag) {
        return
      }
      // 视频放大显示
      // 放大倍数
      let resMultiple = this.rectInfo.rectHeight / this.rectInfo.rectWidth
      let initMultiple = this.rectInfo.videoHeight / this.rectInfo.videoWidth

      if (this.isClicked[this.rectAreaNum]) {
        // 当前视频为放大后视频
        // 视频放大后大小
        this.$refs.videoBox[this.rectAreaNum].style.width =
          (this.rectInfo.videoWidth * resMultiple) / initMultiple + 'px'
        this.$refs.videoBox[this.rectAreaNum].style.height =
          (this.rectInfo.videoHeight * resMultiple) / initMultiple + 'px'
        // 移动放大后视频使框选区域显示在原播放窗口
        // this.$refs.videoBox[this.rectAreaNum].style.top =
        //   parseInt(this.$refs.videoBox[this.rectAreaNum].style.top) -
        //   this.rectInfo.rectHeight
        // this.$refs.videoBox[this.rectAreaNum].style.left =
        //   parseInt(this.$refs.videoBox[this.rectAreaNum].style.left) -
        //   this.rectInfo.rectWidth
      } else {
        // 视频放大后大小
        this.$refs.videoBox[this.rectAreaNum].style.width =
          this.rectInfo.videoWidth * resMultiple + 'px'
        // 移动放大后视频使框选区域显示在原播放窗口
        // this.$refs.videoBox[this.rectAreaNum].style.top = -(
        //   this.rectInfo.rectCenterOffsetY -
        //   this.rectInfo.rectHeight / 2
        // )
        // this.$refs.videoBox[this.rectAreaNum].style.left = -(
        //   this.rectInfo.rectCenterOffsetX -
        //   this.rectInfo.rectWidth / 2
        // )
      }
    },
    //重置选择框
    resetRect() {
      document.removeEventListener('mouseup', this.up)
      this.rect.style.visibility = 'hidden'
      this.rect.style.width = '0px'
      this.rect.style.height = '0px'
      this.top = 0
      this.left = 0
      this.downX = 0
      this.downY = 0
      this.mouseX = 0
      this.mouseY = 0
      this.rect = null
      this.rectInfo = {
        videoWidth: 0,
        videoHeight: 0,
        rectWidth: 0,
        rectHeight: 0,
        rectCenterOffsetX: 0,
        rectCenterOffsetY: 0
      }
    },

    showPlayerBoxMini(val, showValue) {
      this.isClicked[val] = showValue
      const videoZoomDom = document.getElementsByClassName('video-zoom')
      if (showValue) {
        videoZoomDom[val].style.display = 'block'
      } else {
        videoZoomDom[val].style.display = 'none'
        this.$refs.videoBox[this.rectAreaNum].style.width = '100%'
        this.$refs.videoBox[this.rectAreaNum].style.height = '100%'
      }
      this.is3d = showValue
      this.select = showValue
      this.rectZoomInit(val, showValue, '小视频')
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
          case 8:
            this.isHoverNum = 3
            break
          case 6:
            this.isHoverNum = 2
            break
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
          case 8:
            this.isHoverNum = 3
            break
          case 6:
            this.isHoverNum = 2
            break
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
    getIconType(data) {
      if (data.level) {
        // if (data.level === 2) {
        //   return 'tree2'
        // } else {
        return 'tree2'
        // }
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
    filterNode(value, data) {
      if (!value) return true
      // if (this.defaultPropsName === 'orgName') {
      //   return data.orgName && data.orgName.indexOf(value) !== -1
      // } else {
      return data.areaNames && data.areaNames.indexOf(value) !== -1
      // }
    },
    recursionTree(arr, id, resArray) {
      arr.forEach((item) => {
        if (item.id === id) {
          item.children
            ? item.children.push(resArray)
            : (item.children = resArray)
        } else {
          if ((item.children && item.children, length > 0)) {
            this.recursionTree(item.children, id, resArray)
          }
        }
      })
      return arr
    },
    async handleNodeClick(data, node, self) {
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
                      arr = this.resArray.concat(this.initData[0].children)
                    } else {
                      // console.log('else~~~~~~~~~~~~~~~~', data.children)

                      // console.log('1~~~~~~~~~~~~~~~~', this.resArray)
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
                    this.$refs.liveTree.updateKeyChildren(data.id, arr)
                    this.defaultExpandedKeys = [data.id]
                  }
                }
              })
              .catch((error) => {
                // console.log(1111111,error)
              })
          }
        }
      } else {
        this.getDeviceList(data.areaPid)
        this.getPtzPresetLists(data.areaPid, this.playerIdx)
      }
    },
    //设置声音
    handleSetVoice() {
      this.hasAudio = !this.hasAudio
    },
    //截屏
    handleScreenShot() {
      //触发快照
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = this.$refs.mainBox.clientWidth
      canvas.height = this.$refs.mainBox.clientHeight
      ctx.fillStyle = '#505050'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      Array.from(this.$refs.mainBox.children).forEach((dom) => {
        const player = dom.querySelector('video')
        ctx.fillStyle = '#000000'
        ctx.fillRect(
          dom.offsetLeft,
          dom.offsetTop,
          dom.clientWidth,
          dom.clientHeight
        )

        if (player) {
          player.setAttribute('crossOrigin', 'anonymous') //添加srossOrigin属性，解决跨域问题
          ctx.drawImage(
            player,
            dom.offsetLeft,
            dom.offsetTop,
            dom.clientWidth,
            dom.clientHeight
          ) //截
        } else {
          const img = document.createElement('img')
          img.src = '../../../assets/imgs/zlm-logo.png'
          img.style.width = '200px'
          img.style.height = '100px'
          const dx = dom.offsetLeft + (dom.clientWidth / 2 - 100)
          const dy = dom.offsetTop + (dom.clientHeight / 2 - 50)
          ctx.drawImage(img, dx, dy, 200, 100)
        }
      })

      // document.getElementById("cutImage").appendChild(img);   //显示在页面中
      this.downFile(canvas.toDataURL('image/png'), '截图.jpg') //下载截图
      // this.$refs.videoPlayer.snap()
    },
    //下载截图
    downFile(data, fileName) {
      var save_link = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        'a'
      ) //有效的内部空间URI
      save_link.href = data
      save_link.download = fileName
      var event = document.createEvent('MouseEvents')
      event.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      save_link.dispatchEvent(event)
    },
    //收起展开菜单
    handleHiddenMenu() {
      this.isShowMenu = !this.isShowMenu
    },
    //缩放拉伸屏幕
    handleChangeFill() {
      this.isFill = !this.isFill
    },
    //关闭全部
    handleCloseAll() {
      this.$on('closeAll')
      this.videoUrl = ['']
      this.playerData = []
      this.childOptionLists = []
    },
    destroy(idx) {
      this.clear(idx.substring(idx.length - 1))
    },
    search(val) {
      const data = this.deviceList_.filter((item) => {
        if (item.name) return item.name.indexOf(val) != -1
      })
      this.deviceList = data
      if (!val) {
        this.deviceList_.forEach((closeItem, index) => {
          this.$refs.menuRef.close(String(index))
        })
      }
    },
    closeVideo(i) {
      this.videoUrl.splice(i, 1, '')
      this.videoUrl = [...this.videoUrl]
      this.playerData = []
      this.childOptionLists = []
    },
    async getDeviceList(id) {
      Local.set('cloudId', id)
      await getPlayLists({ channelId: id })
        .then((res) => {
          if (res.code === 0) {
            // console.log(111111, res)

            let idxTmp = this.playerIdx

            this.rectAreaNum = idxTmp
            if (this.spilt - 1 > this.playerIdx) {
              this.playerIdx++
            }
            this.setPlayUrl(res.data.wsFlv, idxTmp)
            this.setStreamId(res.data.streamId, idxTmp)
            this.setFlvCloudId(id, idxTmp)

            this.hasVideoUrl = true
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 切换播放器全屏
    fullscreenSwich() {
      const playerMain = document.getElementById('playerMain')

      if (this.splitFullscreen) {
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

    setPlayUrl(url, idx) {
      this.$set(this.videoUrl, idx, url)

      setTimeout(() => {
        window.localStorage.setItem('videoUrl', JSON.stringify(this.videoUrl))
      }, 100)
      this.showContent = true
    },
    setStreamId(id, idx) {
      this.$set(this.flvStreamId, idx, id)

      setTimeout(() => {
        window.localStorage.setItem(
          'flvStreamId',
          JSON.stringify(this.flvStreamId)
        )
      }, 100)
    },
    setFlvCloudId(id, idx) {
      this.$set(this.flvCloudId, idx, id)

      setTimeout(() => {
        window.localStorage.setItem(
          'flvCloudId',
          JSON.stringify(this.flvCloudId)
        )
      }, 100)
    },
    checkPlayByParam() {
      let { deviceId, channelId } = this.$route.query
      if (deviceId && channelId) {
      }
    },
    shot(e) {
      // console.log(e)
      // send({code:'image',data:e})
      var base64ToBlob = function (code) {
        let parts = code.split(';base64,')
        let contentType = parts[0].split(':')[1]
        let raw = window.atob(parts[1])
        let rawLength = raw.length
        let uInt8Array = new Uint8Array(rawLength)
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i)
        }
        return new Blob([uInt8Array], {
          type: contentType
        })
      }
      let aLink = document.createElement('a')
      let blob = base64ToBlob(e) //new Blob([content]);
      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true) //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = '截图'
      aLink.href = URL.createObjectURL(blob)
      aLink.click()
    },
    clear(idx) {
      let dataStr = window.localStorage.getItem('playData') || '[]'
      let data = JSON.parse(dataStr)
      data[idx - 1] = null
      window.localStorage.setItem('playData', JSON.stringify(data))
    },
    videoClick(i) {
      this.$refs.cloudControl.$refs.directionControl.changeType(
        i - 1,
        this.isClicked.length
      )
      this.playerIdx = i - 1
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
    switchSplit() {},
    switchTab(tab, event) {
      console.log(tab, event)
    },
    controlTop() {
      console.info('controlTop====')
    },
    controlRight() {
      console.info('controlRight====')
    },
    controlBottom() {
      console.info('controlBottom====')
    },
    controlLeft() {
      console.info('controlLeft===')
    },
    changeSpeed() {
      console.info('changeSpeed===')
    },
    // 控制面板展开收起
    controlColla() {
      this.showContent = !this.showContent
    }
  }
}
</script>
<style lang="scss" scoped>
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
// 滚动条大小设置
::v-deep .real-time-monitoring > .el-tabs__content::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .real-time-monitoring > .el-tabs__content::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .real-time-monitoring > .el-tabs__content::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .real-time-monitoring > .el-tabs__content::-webkit-scrollbar-corner {
  background-color: #111;
}

// 滚动条大小设置
::v-deep .wrapper-bottom-content::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .wrapper-bottom-content::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .wrapper-bottom-content::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .wrapper-bottom-content::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}

::v-deep .el-tabs__content {
  overflow-y: auto;
}
.video-zoom {
  position: relative;
}
.video {
  position: relative;
  top: 50px;
  left: 250px;
  width: 70%;
  overflow: hidden;
}
.rect {
  position: absolute;
  border: 1px solid #ffd502;
  left: 0px;
  top: 0px;
  width: 0px;
  height: 0px;
  background-color: transparent;
  visibility: hidden;
  z-index: 100;
}

.video-zoom {
  position: absolute;
  width: 40%;
  right: 1px;
  bottom: 60px;
}
#playerMain {
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
    height: 100px;
    background: url('../../../assets/imgs/player_logo.png') center/cover
      no-repeat;
  }
}

.monitoring-content-box {
  height: calc(100% - 0px);
}

.btn {
  margin: 0 10px;
}
.btn:hover {
  color: #409eff;
}
.btn.active {
  color: #409eff;
}
.btn.white {
  color: #fff;
  margin: 0 5px;
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
.dbl-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: #000000;
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
.main-box {
  width: 100%;
  /* height: calc(100vh - 110px); */
  height: calc(100vh - 258px);
  display: grid;
  flex-wrap: wrap;
  background-color: #000000;
  position: relative;
}
.isFull.el-loading-parent--relative {
  position: static !important;
}
.main-box .isFull.el-loading-parent--relative .el-loading-mask {
  position: absolute;
  width: 100%;
  height: 100%;
}
.player-box {
  position: relative;
  background-color: transparent !important;
  height: 100%;
  width: 100%;
}
.player-box:hover .player-tool {
  display: block;
}
.equipment-group-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
    .securityArea_container {
      width: 360px;
      margin-top: -15px;
      padding-bottom: 20px;
      background: #ffffff;
      .tree {
        max-height: calc(100% - 90px);
        overflow-y: auto;
      }
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
// 底部工具栏
.player-toolbar {
  height: 48px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 16px;
  transition: all 0.3s;
  box-sizing: border-box;
  user-select: none;

  .tool-left {
    i {
      cursor: pointer;
      margin-right: 16px;
    }
  }

  .btn {
    border: none;
  }

  i {
    font-size: 24px;
    color: white;

    &.active {
      color: #1890ff;
    }
  }

  .tool-right {
    display: flex;
    align-items: center;
  }
  .tool-right > * {
    margin-left: 12px;
  }
  .tool-right > i {
    cursor: pointer;
    font-size: 18px;
  }

  &.full {
    position: absolute;
    bottom: -35px;
    opacity: 0;
    width: 100%;

    &:hover {
      bottom: 0;
      opacity: 1;
    }
  }
}
.videoList {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.video-item {
  position: relative;
  width: 15rem;
  height: 10rem;
  margin-right: 1rem;
  background-color: #000000;
}

.video-item-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: 100%;
}

.video-item-img:after {
  content: '';
  display: inline-block;
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 3rem;
  height: 3rem;
  background-image: url('../../../assets/imgs/loading.png');
  background-size: cover;
  background-color: #000000;
}

.video-item-title {
  position: absolute;
  bottom: 0;
  color: #000000;
  background-color: #ffffff;
  line-height: 1.5rem;
  padding: 0.3rem;
  width: 14.4rem;
}

.baidumap {
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

/* 去除百度地图版权那行字 和 百度logo */
.baidumap > .BMap_cpyCtrl {
  display: none !important;
}
.baidumap > .anchorBL {
  display: none !important;
}
.left-tree {
  width: 20%;
  max-width: 480px;
  background-color: #fff;
  margin-right: 16px;
  // height: calc(100vh - 142px);
}
// .dropmenu{
//   width: 70px;
//   height: 100px;
// }
.dropmenu .el-dropdown-menu__item {
  padding: 0;
}
.split-text {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.iconArrow {
  color: #999;
  font-size: 14px;
  margin-right: 10px;
}
#devicePosition .equipment-group-wrapper-top {
  padding: 0;
}
.el-tab-pane {
  padding: 0 24px;
}
.fenping {
  width: 16px;
  height: 16px;
}
</style>
