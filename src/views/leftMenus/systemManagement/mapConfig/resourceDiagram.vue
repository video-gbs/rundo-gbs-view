<template>
  <div class="resourceDiagram_main">
    <div style="height: 100%">
      <div class="panel-header-box">
        <div class="panel-header-box-border">资源上图</div>
      </div>
      <div class="resourceDiagram_main_content">
        <div class="resourceDiagram_container equipment-group-wrapper-bottom">
          <div class="wrapper-bottom-header">
            <div class="bottom-header-name">安防区域</div>
          </div>
          <transition name="el-fade-in-linear">
            <div class="wrapper-bottom-content" ref="wrapperBottomContent">
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

        <div id="mapContainer"></div>
      </div>
      <img
        v-show="isShowPic"
        class="pic_mid"
        src="../../../../../static/images/gis/shiyechuang.png"
        alt=""
      />
      <el-button type="primary" @click="save()" class="save-button"
        ><svg-icon class="svg-btn" icon-class="save" />保存</el-button
      >
    </div>
  </div>
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement/components/leftTree'
import LineFont from '@/components/LineFont'
import MapTest from './mapTest'
import { playVideoAreaList } from '@/api/method/live'
import * as Run3D from '@rjgf/run3d'
import {
  findOneStatusOnGis,
  findVideoAreaOneGis,
  gisVideoAreaSaveGis
} from '@/api/method/mapConfig'
export default {
  name: '',
  components: {
    leftTree,
    LineFont,
    MapTest
  },
  data() {
    return {
      mapDom: null,
      gdOnlineMap: null,
      isShowPic: false,
      treeList: [],
      treeList1: [],
      areaNames: 'resourceName',
      showContent: true, // 展示面板内容
      channelDetailsId: '',
      fatherId: '',
      common: null,
      latitude: 0,
      longitude: 0,
      height: 0,
      pitch: 0,
      roll: 0,
      heading: 0,
      url: '',
      mapId: 0,
      imgType: 'png',
      editId: '',
      filterText: '',
      detailsId: [],
      isVideo: false
    }
  },
  created() {
    this.isShowPic = false
    this.mapDom && this.mapDom.destroy()
    this.mapDom = null
  },
  activated() {
    this.mapDom && this.mapDom.destroy()
    this.gdOnlineMap = null
    this.mapDom = null

    this.$nextTick(() => {
      setTimeout(() => {
        this.findGis()
      }, 1000)
    })
  },
  mounted() {
    this.init()
  },

  computed: {},

  watch: {
    $route: {
      handler: function (newVal, oldVal) {
        console.log('routerouterouterouteroute', newVal, oldVal)
        // this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    async init() {
      // this.treeList = this.resTree1.data.data ? [this.resTree1.data.data] : []

      await playVideoAreaList()
        .then((res) => {
          if (res.data.code === 0) {
            this.treeList = [res.data.data]
            this.channelDetailsId = res.data.data ? res.data.data.id : ''
            this.$refs.deviceTree.chooseId(this.channelDetailsId)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    async findGis() {
      this.isShowPic = false
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
            this.mapId = resData.id
            this.imgType = resData.imgType
            console.log('this.channelDetailsId', this.channelDetailsId)
            this.mapDom && this.mapDom.destroy()
            this.gdOnlineMap = null
            this.mapDom = null

            this.findVideoAreaOneGis(this.channelDetailsId)

            // this.initMap()
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
              this.roll = resData.roll
              this.heading = resData.heading
              this.height = resData.height
              this.mapId = resData.gisConfigId
              this.editId = resData.id
              this.imgType = resData.imgType
            }

            this.mapDom && this.mapDom.destroy()
            this.gdOnlineMap = null
            this.mapDom = null
            this.initMap()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    //保存节点与配置的信息
    async gisVideoAreaSaveGis(res) {
      const params = {}
      params.latitude = res.latitude
      params.longitude = res.longitude
      params.pitch = res.pitch
      params.roll = res.roll
      params.heading = res.heading
      params.videoAreaId = this.channelDetailsId
      params.gisConfigId = this.mapId
      params.height = res.height
      params.id = this.editId
      await gisVideoAreaSaveGis(params)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '地图底图保存成功'
            })
            // if (res.data.data) {
            this.editId = res.data.data
            // }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // 控制面板展开收起
    // controlColla(val) {
    //   if (val === 1) {
    //     this.showContent = !this.showContent
    //   } else {
    //     this.showContent1 = !this.showContent1
    //   }
    // },
    childClickHandle(data) {
      this.isShowPic = false
      this.channelDetailsId = data.id
      // this.findVideoAreaOneGis(data.id)
      this.editId = ''
      this.findGis()
    },
    initMap() {
      this.mapDom = new Run3D.Map()
      this.mapDom.createMap('', 'mapContainer', {})
      // const url
      //创建高德在线地图图层
      console.log('this.url', this.url)
      this.gdOnlineMap = new Run3D.UrlTemplateImageLayer({
        // url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', //高德地图
        url: this.url,
        fileExtension: this.imgType,
        minimumLevel: 0,
        maximumLevel: 18
      })

      this.mapDom.layers.addRaster(this.gdOnlineMap)
      this.common = new Run3D.Common(this.mapDom.viewer)
      this.mapDom.scene.on(Run3D.EventTypeEnum.LEFT_CLICK, (res) => {
        //返回地图上的屏幕坐标
        // console.log(res)
        this.common.pickerHelper.on(res).then((result) => {
          //返回点击的笛卡尔坐标
          // console.log(result)
          // this.gisVideoAreaSaveGis(
          //   Run3D.Calculate.getWGS84FromCartesian3(result.coordinates)
          // )
          //返回WGS84坐标
          // console.log(
          //   '返回WGS84坐标',
          //   Run3D.Calculate.getWGS84FromCartesian3(result.coordinates)
          // )
        })
      })
      // //创建图层并加入到地图中
      // let graphicsLayer = new Run3D.GraphicLayer('test')
      // this.map.layers.addGraphicLayer(graphicsLayer)
      // //创建一个Graphic
      // let graphic = new Run3D.BillboadrdGraphic({
      //   position: [113.440906, 23.17047, , 18.208],
      //   imageUrl: 'static/layers/graphic/video.png',
      //   scale: 1,
      //   offset: [0, 0],
      //   scaleByDistance: [1, 0.6],
      //   distanceDisplayCondition: [0, 3000] //显示标签范围
      // })

      // graphicsLayer.add(graphic)
      this.mapDom.initView({
        longitude: this.longitude,
        latitude: this.latitude,
        height: this.height,
        heading: this.heading,
        pitch: this.pitch,
        roll: this.roll
      })
      setTimeout(() => {
        this.isShowPic = true
      }, 2000)
    },

    save() {
      this.gisVideoAreaSaveGis(this.mapDom.getCameraInfo())
    }
  },

  destroyed() {
    this.mapDom && this.mapDom.destroy()
    this.gdOnlineMap = null
    this.mapDom = null
    this.isShowPic = false
  }
}
</script>

<style lang="scss" scoped>
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
.resourceDiagram_main {
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
  .resourceDiagram_main_content {
    height: calc(100% - 60px);
    display: flex;
    .resourceDiagram_container {
      min-width: 310px;
      margin: 20px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
      .tree_test {
        overflow-y: auto;
        height: 100%;
      }
    }
    .right-container {
      width: 100%;
      height: calc(100% - 16px);
      margin: 6px 0 0 -10px;
      position: relative;
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
#mapContainer {
  height: 100%;
  width: 100%;
  padding: 20px 20px 20px 0;
}
.pic_mid {
  width: 208px;
  height: 208px;
  position: absolute;
  left: calc(50% + 175px);
  top: 50%;
  transform: translate(-50%, -50%);
}
.save-button {
  position: absolute;
  top: 10px;
  right: 20px;
  .svg-btn {
    position: relative;
    top: 1px;
    left: -4px;
  }
}
</style>
