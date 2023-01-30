<template>
  <div id="devicePosition" style="height: 100%; width: 100%">
    <el-container style="height: 100%">
      <el-main
        style="display: flex; flex-direction: column"
        class="monitoring-content-box"
      >
        <div style="display: flex; flex-direction: row; padding: 16px 24px 0px">
          <div class="left-tree" v-show="isShowMenu">
            <div class="equipment-group-wrapper">
              <div class="equipment-group-wrapper-top">
                <el-tabs
                  v-model="activeTab"
                  @tab-click="switchTab"
                  class="real-time-monitoring"
                >
                  <el-tab-pane label="安防通道分组" name="equipmentGroup">
                    <monitor-equipment-group :sendDevicePush="sendDevicePush" />
                  </el-tab-pane>
                </el-tabs>
              </div>
              <!-- v-show="
                  playerData[playerIdx] &&
                  Object.keys(playerData[playerIdx]).length !== 0
                " -->
              <div class="equipment-group-wrapper-bottom">
                <!-- <div class="equipment-group-wrapper-bottom"> -->
                <div class="wrapper-bottom-header" @click="controlColla">
                  <div class="bottom-header-name">云台控制</div>
                  <transition name="el-zoom-in-center">
                    <i class="el-icon-arrow-down" v-if="showContent"></i>
                    <i class="el-icon-arrow-right" v-else></i>
                  </transition>
                </div>
                <transition name="el-fade-in-linear">
                  <div class="wrapper-bottom-content" v-show="showContent">
                    <cloud-control :deviceData="playerData[playerIdx]" />
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              flex: 1;
              background-color: #fff;
              position: relative;
            "
            id="playerMain"
          >
            <div
              ref="mainBox"
              :class="`main-box grid${spilt}`"
              :style="`height: calc(100vh - ${splitFullscreen ? 0 : 190}px)`"
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
                @click="playerIdx = i - 1"
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
                  <div v-else class="player-box">
                    <player
                      :ref="'player' + i"
                      :videoUrl="videoUrl[i - 1]"
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
                    ></player>
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
                  <el-dropdown @command="switchSplit">
                    <span class="split-text">
                      <i
                        class="iconfont white"
                        :class="splitArr[spiltIndex].class"
                      />
                      <i class="el-icon-arrow-down iconArrow" />
                      |
                    </span>
                    <el-dropdown-menu
                      slot="dropdown"
                      class="dropmenu"
                      :append-to-body="false"
                      ref="dropdownMenu"
                    >
                      <template v-for="(item, index) in splitArr">
                        <el-dropdown-item :command="item" :key="item.num">
                          <div
                            @click="clickSpilt(item, index)"
                            style="padding: 0 16px"
                          >
                            <i
                              class="iconfont btn"
                              :class="[
                                { active: item.num === spilt },
                                item.class
                              ]"
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
            <div ref="dropdownMenuPlace"></div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import player from './components/flvjs.vue'
import PlayerTool from './components/playerTool.vue'
import monitorEquipmentGroup from './components/monitorEquipmentGroup.vue'
import cloudControl from './components/cloudControl.vue'
export default {
  name: 'live',
  components: {
    player,
    PlayerTool,
    monitorEquipmentGroup,
    cloudControl
  },
  data() {
    return {
      activeTab: 'equipmentGroup',
      showVideoDialog: true,
      hasAudio: false, //设置默认是否静音
      videoUrl: [''],
      showContent: true, // 展示面板内容
      spilt: 1, //分屏
      spiltIndex: 0,
      isFill: false, //是否拉伸视频
      splitArr: [
        {
          num: 1,
          class: 'icon-yigongge'
        },
        {
          num: 4,
          class: 'icon-sigongge'
        },
        {
          num: 6,
          class: 'icon-a-15gongge'
        },
        {
          num: 8,
          class: 'icon-a-17gongge'
        },
        {
          num: 9,
          class: 'icon-jiugongge'
        },
        {
          num: 16,
          class: 'icon-a-16gongge'
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
      hasAudio: true
    }
  },
  mounted() {
    this.initData()

    document.addEventListener('fullscreenchange', (e) => {
      // 监听到屏幕变化，更改全屏状态，该页面不能存在多个全屏元素
      this.splitFullscreen = !this.splitFullscreen
    })
    this.$refs.dropdownMenuPlace.appendChild(this.$refs.dropdownMenu.popperElm)
  },
  created() {
    this.checkPlayByParam()
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
    videoActiveArr(n) {
      console.log('nnnnn', n)
    },
    spilt(newValue) {
      console.log('切换画幅;' + newValue)
      let that = this
      for (let i = 1; i <= newValue; i++) {
        if (!that.$refs['player' + i]) {
          continue
        }
        this.$nextTick(() => {
          if (that.$refs['player' + i] instanceof Array) {
            that.$refs['player' + i][0].resize()
          } else {
            that.$refs['player' + i].resize()
          }
        })
      }
      window.localStorage.setItem('split', newValue)
    },
    '$route.fullPath': 'checkPlayByParam'
  },
  destroyed() {
    clearTimeout(this.updateLooper)
    document.removeEventListener('fullscreenchange', () => {})
  },
  methods: {
    initData: function () {
      // 初始化播放器数据
      // const playerData = [];
      // for (let index = 0; index < 16; index++) {
      //   playerData.push({});
      // }
      // this.playerData = playerData;
      // console.info("初始化播放器数据", this.playerData);
      // this.getDeviceList();
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
      // this.playerData.forEach(item => this.stopPlaying(item));
    },
    destroy(idx) {
      console.log(idx)
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
    reset() {
      this.deviceList = this.deviceList_
      this.searchSrt = ''
      this.deviceList_.forEach((closeItem, index) => {
        this.$refs.menuRef.close(String(index))
      })
    },
    close(a, b) {
      console.log(a, b)
    },
    closeVideo(i) {
      this.videoUrl.splice(i, 1, '')
      this.videoUrl = [...this.videoUrl]
      this.playerData = []
      // this.playerData[i] = null;
      // this.stopPlaying(this.playerData[i])
    },
    getDeviceList: function () {
      let that = this
      this.$axios({
        method: 'get',
        url: `/api/device/query/devices`,
        params: {
          page: that.currentPage,
          count: that.count
        }
      })
        .then(function (res) {
          console.log(res.data.list)
          that.total = res.data.total

          that.deviceList = res.data.list.map((item) => {
            return { deviceChannelList: [], ...item }
          })
          that.deviceList_ = that.deviceList
          that.getDeviceListLoading = false
        })
        .catch(function (error) {
          console.log(error)
          that.getDeviceListLoading = false
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
    //通知设备上传媒体流
    sendDevicePush: function (itemData, index) {
      const { name } = itemData
      this.closeVideo(this.playerIdx)
      // this.stopPlaying(this.playerData[this.playerIdx])
      if (index && this.videoActiveArr.includes(index)) {
        return
      }
      if (itemData.status === 0) {
        this.$message.error('设备离线!')
        return
      }
      this.playerData[this.playerIdx] = {}
      this.save(itemData)
      let deviceId = itemData.deviceId
      // this.isLoging = true;
      let channelId = itemData.channelId || '34020000001320000024'
      console.log('通知设备推流1：' + deviceId + ' : ' + channelId)
      let idxTmp = this.playerIdx
      if (this.spilt - 1 > this.playerIdx) {
        this.playerIdx++
      }
      let that = this
      this.loading = true
      if (index !== undefined) {
        this.videoActiveArr = [...this.videoActiveArr, index]
      }
      this.$axios({
        method: 'get',
        url: '/api/play/start/' + deviceId + '/' + channelId
      })
        .then(function (res) {
          console.log(res, 'res')
          if (res.data.code == 0 && res.data.data) {
            // console.log(res.data.data,"播放后的流媒体地址")
            itemData.playUrl = res.data.data.httpsFlv
            // console.log(res.data.data.httpsFlv,"选择的流媒体")
            const newData = {
              ...itemData,
              ...res.data.data,
              channelName: name
            }
            that.playerData[idxTmp] = newData

            //根据当前流媒体节点，是否启用https，来选择播放路径
            if (that.GLOBAL.mediaList.enableHttps == 1) {
              console.log(that.GLOBAL.mediaList, '当前流媒体节点信息！')
              console.log(that.GLOBAL.mediaList.enableHttps, '有启用https！')
              that.setPlayUrl(res.data.data.wss_flv, idxTmp)
            } else {
              console.log(that.GLOBAL.mediaList, '当前流媒体节点信息！')
              console.log(that.GLOBAL.mediaList.enableHttps, '没有启用https！')
              that.setPlayUrl(res.data.data.ws_flv, idxTmp)
            }
          } else {
            that.$message.error(res.data.msg)
            that.playerData[idxTmp] = null
          }
        })
        .catch(function (e) {})
        .finally(() => {
          that.loading = false
          if (index !== undefined) {
            this.videoActiveArr = this.videoActiveArr.filter((item) => {
              return item !== index
            })
          }
        })
    },
    setPlayUrl(url, idx) {
      this.$set(this.videoUrl, idx, url)
      let _this = this
      setTimeout(() => {
        window.localStorage.setItem('videoUrl', JSON.stringify(_this.videoUrl))
      }, 100)
      console.log(window.localStorage, '存储的播放链接videoUrl')
    },
    checkPlayByParam() {
      let { deviceId, channelId } = this.$route.query
      if (deviceId && channelId) {
        this.sendDevicePush({ deviceId, channelId })
      }
    },
    //停止播放
    stopPlaying: function (data) {
      const { deviceId, channelId } = data || {}
      if (!deviceId || !channelId) return
      return this.$axios({
        method: 'get',
        url: '/api/play/stop/' + deviceId + '/' + channelId
      })
    },
    convertImageToCanvas(image) {
      var canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      canvas.getContext('2d').drawImage(image, 0, 0)
      return canvas
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
    save(item) {
      let dataStr = window.localStorage.getItem('playData') || '[]'
      let data = JSON.parse(dataStr)
      data[this.playerIdx] = item
      window.localStorage.setItem('playData', JSON.stringify(data))
    },
    clear(idx) {
      let dataStr = window.localStorage.getItem('playData') || '[]'
      let data = JSON.parse(dataStr)
      data[idx - 1] = null
      console.log(data)
      window.localStorage.setItem('playData', JSON.stringify(data))
    },
    loadAndPlay() {
      let dataStr = window.localStorage.getItem('playData') || '[]'
      let data = JSON.parse(dataStr)

      data.forEach((item, i) => {
        if (item) {
          this.playerIdx = i
          this.sendDevicePush(item)
        }
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
#playerMain {
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

.real-time-monitoring {
  .el-tabs__nav-wrap {
    padding: 0px 24px 0;
  }
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
</style>
<style>
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
</style>
<style lang="scss" scoped>
.left-tree {
  width: 20%;
  max-width: 480px;
  background-color: #fff;
  margin-right: 16px;
  height: calc(100vh - 142px);
}
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
</style>
