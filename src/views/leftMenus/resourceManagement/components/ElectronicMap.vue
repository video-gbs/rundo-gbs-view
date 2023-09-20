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
  </div>
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement/components/leftTree'
import LineFont from '@/components/LineFont'
import { channelVideoAreaList } from '@/api/method/channel'
import { playVideoAreaList } from '@/api/method/live'
import { Local } from '@/utils/storage'
import { mapGetters } from 'vuex'
import * as Run3D from '@rjgf/run3d'
import {
  findOneStatusOnGis,
  findVideoAreaOneGis
} from '@/api/method/mapConfig'
export default {
  name: '',
  components: {
    leftTree,
    LineFont
  },
  data() {
    return {
      mapDom: null,
      gdOnlineMap: null,
      treeList: [],
      treeList1: [],
      areaNames: 'resourceName',
      showContent: false, // 展示面板内容
      channelDetailsId: '',
      fatherId: '',
      common: null,
      latitude: 0,
      longitude: 0,
      url: '',
      mapId: 0,
      imgType: 'png',
      editId: ''
    }
  },
  created() {},
  activated() {
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
      // this.findVideoAreaOneGis(this.channelDetailsId)
    },
    async findGis() {
      await findOneStatusOnGis()
        .then((res) => {
          if (res.data.code === 0) {
            const resData = res.data.data
            this.latitude = resData.latitude
            this.longitude = resData.longitude
            this.url = resData.url
            this.mapId = resData.id
            this.imgType = resData.imgType
            this.initMap()
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
            const resData = res.data.data
            this.latitude = resData.latitude
            this.longitude = resData.longitude
            this.url = resData.url
            this.mapId = resData.gisConfigId
            this.editId = resData.id
            this.imgType = resData.imgType
            this.initMap()
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
      this.channelDetailsId = data.id
      this.findVideoAreaOneGis(data.id)
      this.findGis()
    },
    initMap() {
      this.mapDom = new Run3D.Map()
      this.mapDom.createMap('', 'mapContainer', {})
      // const url
      //创建高德在线地图图层
      this.gdOnlineMap = new Run3D.UrlTemplateImageLayer({
        // url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', //高德地图
        url: this.url,
        fileExtension: this.imgType,
        minimumLevel: 0,
        maximumLevel: 20
      })
      this.mapDom.initView({
        longitude: this.longitude,
        latitude: this.latitude,
        height: this.height
      })
      this.mapDom.layers.addRaster(this.gdOnlineMap)
      this.common = new Run3D.Common(this.mapDom.viewer)
      this.mapDom.scene.on(Run3D.EventTypeEnum.LEFT_CLICK, (res) => {
        //返回地图上的屏幕坐标
        console.log(res)
        this.common.pickerHelper.on(res).then((result) => {
          //返回点击的笛卡尔坐标
          console.log(result)
          //返回WGS84坐标
          console.log(
            Run3D.Calculate.getWGS84FromCartesian3(result.coordinates)
          )
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
