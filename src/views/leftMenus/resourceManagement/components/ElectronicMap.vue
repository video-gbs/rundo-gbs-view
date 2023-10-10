<template>
  <div class="electronicMap_main">
    <div id="mapContainer"></div>
    <div class="resourceDiagram_container equipment-group-wrapper-bottom">
      <div class="wrapper-bottom-header" @click="controlColla(1)">
        <div class="bottom-header-name">安防区域</div>
        <transition name="el-zoom-in-center">
          <i class="el-icon-arrow-up" v-if="showContent"></i>
          <i class="el-icon-arrow-down" v-else></i>
        </transition>
      </div>
      <transition name="el-fade-in-linear">
        <div
          class="wrapper-bottom-content"
          v-show="showContent"
          ref="wrapperBottomContent"
        >
          <leftTree
            ref="deviceTree"
            class="electronicMaTree tree_test"
            :treeData="treeList"
            @childClickHandle="childClickHandle"
            :defaultPropsName="areaNames"
          />
        </div>
      </transition>
    </div>

    <el-dialog
      class="el-dialog-electronicMap"
      title="视频播放"
      top="0"
      width="700"
      :close-on-click-modal="false"
      :visible.sync="showVideoDialog"
      @close="close()"
    >
      <!-- <JPlayer
        ref="videoPlayer"
        :videoUrl="videoUrl"
        :hasAudio="hasAudio"
        fluent
        autoplay
        live
      /> -->
      <!-- <EasyPlayer
        ref="videoPlayer"
        :videoUrl="videoUrl"
        :hasAudio="hasAudio"
        fluent
        autoplay
        live
      /> -->
      <LivePlayer
        ref="videoPlayer"
        :videoUrl="videoUrl"
        :hasAudio="hasAudio"
        fluent
        autoplay
        live
      />
    </el-dialog>
  </div>
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement/components/leftTree'
import LineFont from '@/components/LineFont'
import { channelVideoAreaList } from '@/api/method/channel'
import { getChannelPlayList, getPlayLists } from '@/api/method/live'
import { Local } from '@/utils/storage'
import { mapGetters } from 'vuex'
import * as Run3D from '@rjgf/run3d'
import { findOneStatusOnGis, findVideoAreaOneGis } from '@/api/method/mapConfig'
import testImgUrl from '../../../../assets/imgs/videotest.png'
import JPlayer from './jessibuca.vue'
import EasyPlayer from './easyPlay.vue'
import LivePlayer from './livePlay'

export default {
  name: '',
  components: {
    leftTree,
    LineFont,
    JPlayer,
    EasyPlayer,
    LivePlayer
  },
  data() {
    return {
      mapDom: null,
      gdOnlineMap: null,
      treeList: [],
      showVideoDialog: false,
      areaNames: 'resourceName',
      showContent: false, // 展示面板内容
      channelDetailsId: '',
      common: null,
      videoUrl: '',
      hasAudio: false,
      latitude: 0,
      longitude: 0,
      pitch: 0,
      height:0,
      roll: 0,
      heading: 0,
      url: '',
      imgType: 'png',
      // 设备集合
      videoList: [],
      graphic: {},
      graphicsLayer: null,
      points: [
        {
          longitude: 113.43382617519103,
          latitude: 23.17137637150239,
          height: -0.0031337435708891142
        },
        {
          longitude: 113.43480618227244,
          latitude: 23.171403702573247,
          height: -0.0045297945171596165
        },
        {
          longitude: 113.43609844598411,
          latitude: 23.171550631938253,
          height: -0.00403549375133705
        },
        {
          longitude: 113.43711685915169,
          latitude: 23.170817865830944,
          height: -0.003598416409380728
        },
        {
          longitude: 113.43669462962943,
          latitude: 23.169535950790152,
          height: -0.00283775641862629
        },
        {
          longitude: 113.43517820097665,
          latitude: 23.169377184527953,
          height: -0.004351280965329057
        },
        {
          longitude: 113.43510709813498,
          latitude: 23.170295603338648,
          height: -0.0031785083901879493
        },
        {
          longitude: 113.43417921526454,
          latitude: 23.169988065929655,
          height: -0.0024265558534264714
        },
        {
          longitude: 113.43443281136263,
          latitude: 23.17074042550585,
          height: -0.0035678127606356795
        },
        {
          longitude: 113.43432875843396,
          latitude: 23.16913274428291,
          height: -0.003930897180341542
        }
      ]
    }
  },
  created() {},
  activated() {
    console.log(999)
    this.mapDom && this.mapDom.destroy()
    this.gdOnlineMap = null
    this.mapDom = null

    // this.findGis()
    this.$nextTick(() => {
      setTimeout(() => {
        this.findGis()
      }, 1000)
    })
    // this.initMap()
  },
  mounted() {
    this.init()
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.resTree1 = await channelVideoAreaList()
      this.treeList = this.resTree1.data.data ? [this.resTree1.data.data] : []
      this.channelDetailsId = this.resTree1.data.data
        ? this.resTree1.data.data.id
        : ''
      this.$refs.deviceTree.chooseId(this.channelDetailsId)
      this.getChannelPlayList(this.channelDetailsId)
    },
    async getPlayLists(id) {
      await getPlayLists({ channelId: id })
        .then((res) => {
          if (res.data.code === 0) {
            this.videoUrl = res.data.data.wsFlv
            if (res.data.data.playProtocalType == 1) {
              this.videoUrl = res.data.data.httpFlv
            } else if (res.data.data.playProtocalType == 2) {
              this.videoUrl = res.data.data.wssFlv
            }
            this.showVideoDialog = true
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    close() {
      console.log('关闭视频')
      if (!!this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause()
      }
      this.videoUrl = ''
    },
    async getChannelPlayList(id) {
      await getChannelPlayList(id)
        .then((res) => {
          if (res.data.code === 0) {
            const resData = res.data.data

            let obj = {}
            this.videoList = []
            resData.map((item) => {
              obj = {
                height: item.height,
                latitude: Number(item.latitude),
                longitude: Number(item.longitude),
                id: item.id
              }
              this.videoList.push(obj)
            })
            console.log('this.videoList', this.videoList)
            // this.findVideoAreaOneGis(id)
            this.findGis()
            // this.initMap()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async findGis() {
      await findOneStatusOnGis()
        .then((res) => {
          if (res.data.code === 0) {
            const resData = res.data.data
            this.latitude = resData.latitude
            this.longitude = resData.longitude
            this.height = resData.height
            this.pitch = resData.pitch
            this.roll = resData.roll
            this.heading = resData.heading
            this.url = resData.url
            this.imgType = resData.imgType
            // this.mapDom && this.mapDom.destroy()
            console.log('this.gdOnlineMap', this.gdOnlineMap)

            this.findVideoAreaOneGis(this.channelDetailsId)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    //查询节点得地图信息
    async findVideoAreaOneGis(id) {
      await findVideoAreaOneGis({ videoAreaId: id })
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data && res.data.data !== null) {
              const resData = res.data.data
              this.latitude = resData.latitude
              this.longitude = resData.longitude
              this.pitch = resData.pitch
              this.height = resData.height
              this.roll = resData.roll
              this.heading = resData.heading
              this.imgType = resData.imgType
              // this.initMap()
            }
            if (this.gdOnlineMap && this.gdOnlineMap !== null) {
              this.mapDom.layers.removeLayer(this.gdOnlineMap)

              this.graphicsLayer.removeAll()
              this.gdOnlineMap = null
              this.initMap(1)
            } else {
              this.initMap()
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // 控制面板展开收起
    controlColla(val) {
      if (val === 1) {
        this.showContent = !this.showContent
      } else {
        this.showContent1 = !this.showContent1
      }
    },
    childClickHandle(data) {
      this.getChannelPlayList(data.id)
      this.channelDetailsId = data.id
    },
    initMap(val) {
      if (val !== 1) {
        this.mapDom = new Run3D.Map()
        this.mapDom.createMap('', 'mapContainer', {})
      }
      // const url
      //创建高德在线地图图层
      this.gdOnlineMap = new Run3D.UrlTemplateImageLayer({
        // url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', //高德地图
        url: this.url,
        fileExtension: this.imgType,
        minimumLevel: 0,
        maximumLevel: 20
      })
      console.log('this.longitude', this.longitude)
      console.log('this.latitude', this.latitude)
      console.log('this.heading', this.heading)
      console.log('this.roll', this.roll)
      console.log('this.pitch', this.pitch)
      console.log('this.height', this.height)
      this.mapDom.initView({
        longitude: this.longitude,
        latitude: this.latitude,
        height: this.height,
        heading: this.heading,
        pitch: this.pitch,
        roll: this.roll
      })
      this.mapDom.layers.addRaster(this.gdOnlineMap)
      this.common = new Run3D.Common(this.mapDom.viewer)
      //创建图层并加入到地图中
      this.graphicsLayer = new Run3D.GraphicLayer('test')
      this.mapDom.layers.addGraphicLayer(this.graphicsLayer)
      this.graphic = {}
      this.videoList.map((item) => {
        this.graphic = new Run3D.BillboadrdGraphic({
          position: [item.longitude, item.latitude, item.height],
          imageUrl: testImgUrl,
          scale: 1,
          offset: [0, 0],
          scaleByDistance: [1, 0.6],
          distanceDisplayCondition: [0, 30000], //显示标签范围
          properties: {
            id: item.id
          }
        })
        this.graphicsLayer.add(this.graphic)
      })

      this.mapDom.scene.on(Run3D.EventTypeEnum.LEFT_CLICK, (res) => {
        this.common.pickerHelper.pick(res).then((result) => {
          if (
            result &&
            result.results.id &&
            result.results.id._properties._id._value
          ) {
            let resId = result.results
              ? result.results.id._properties._id._value
              : ''
            this.getPlayLists(resId)
          }
        })
      })
    }
  },
  destroyed() {
    this.mapDom && this.mapDom.destroy()
    this.gdOnlineMap = null
    this.mapDom = null
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 700px;
  height: 500px;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  position: relative;
  z-index: 9999999999;
}
::v-deep .cesium-viewer,
.cesium-viewer-cesiumWidgetContainer,
.cesium-widget {
  height: 100%;
}
::v-deep .cesium-viewer-cesiumWidgetContainer {
  height: 100%;
}
::v-deep .cesium-widget {
  height: 100%;
}

::v-deep canvas {
  width: 100%;
  height: 100%;
}
.el-dialog-electronicMap {
  position: absolute;
  top: 50%;
  left: 50%;
  overflow: hidden;

  transform: translate(-50%, -50%);
  > .el-dialog {
    width: 700px !important;
  }
}
#mapContainer {
  height: 100%;
  width: 100%;
  // padding: 20px 20px 20px 0;
}
.electronicMap_main {
  position: relative;
  .resourceDiagram_container {
    position: absolute;
    top: 10px;
    right: 20px;
    width: 310px;
    margin: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    .tree_test {
      overflow-y: auto;
      height: 100%;
    }
  }
  .equipment-group-wrapper-bottom {
    // height: 50%;
    .wrapper-bottom-header {
      padding: 7px 24px 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(0, 0, 0, 0.15);
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
      cursor: pointer;

      .bottom-header-name {
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        font-weight: 500;
        font-size: 14px;
      }
    }

    .wrapper-bottom-content {
      .control-circle-box {
        padding: 24px;
        box-sizing: border-box;

        .control-circle-box-circle {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;

          .circle-big {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 200px;
            height: 200px;
            border-radius: 100px;
            background-color: #e8f4ff;

            .circle-small {
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 178px;
              height: 178px;
              border-radius: 100px;
              background-color: #1055bd;

              .circle-center {
                width: 96px;
                height: 96px;
                background: url('../../../../assets/imgs/control_center.png')
                  center no-repeat;
                background-size: contain;
              }

              .circle-direction {
                position: absolute;
                width: 32px;
                height: 32px;
                background-size: contain;
                background-repeat: no-repeat;
                cursor: pointer;
              }

              .circle-top {
                background-image: url('../../../../assets/imgs/control_top.png');
                top: 0;
              }
              .circle-right {
                background-image: url('../../../../assets/imgs/control_right.png');
                right: 0;
              }
              .circle-bottom {
                background-image: url('../../../../assets/imgs/control_bottom.png');
                bottom: 0;
              }
              .circle-left {
                background-image: url('../../../../assets/imgs/control_left.png');
                left: 0;
              }
            }
          }
        }

        .control-circle-box-progress {
          /*padding-left: 55px;*/
          justify-content: center;
          height: 20px;
          display: flex;
          align-items: center;

          .progress-description {
            margin-right: 17px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
          }

          .slider-component {
            width: 82px;
            height: 6px;

            .el-slider__runway {
              margin: 0;
            }

            .el-slider__button {
              width: 6px;
              height: 6px;
            }
          }

          .slider-value {
            margin-left: 7px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
          }
        }
      }

      .control-operate-box {
        box-sizing: border-box;
        padding: 0 24px;
        .preliminary-position {
          .position-title {
            margin-bottom: 16px;
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            text-align: left;
          }
          .position-control-panel {
            display: flex;
            margin-bottom: 16px;

            .input-number {
              margin-right: 24px;
            }

            .el-button--primary.is-plain {
              color: #ffffff;
              background: #ecf5ff;
            }
          }
          .position-record {
            .position-record-item {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.65);
              line-height: 40px;
              border-bottom: 1px solid #f0f0f0;
            }
          }
        }
      }
    }
  }
}
</style>
