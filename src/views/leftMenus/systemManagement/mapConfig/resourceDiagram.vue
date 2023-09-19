<template>
  <div class="resourceDiagram_main">
    <div style="height: 100%">
      <div class="panel-header-box">
        <div class="panel-header-box-border">资源上图</div>
      </div>
      <div class="resourceDiagram_main_content">
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
                class="equipmentTree tree_test"
                :treeData="treeList"
                :defaultPropsName="areaNames"
              />
            </div>
          </transition>
        </div>
      </div>
    </div>
    <MapTest/>
  </div>
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import LineFont from '@/components/LineFont'
import MapTest from './mapTest'
import { channelVideoAreaList } from '@/api/method/channel'
import { playVideoAreaList } from '@/api/method/live'
import { Local } from '@/utils/storage'
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: {
    leftTree,
    LineFont,
    MapTest
  },
  data() {
    return {
      treeList: [],
      treeList1: [],
      areaNames: 'resourceName',
      showContent: false, // 展示面板内容
      showContent1: false // 展示面板内容
    }
  },
  created() {},
  mounted() {
    this.init()
    this.init1()
    // this.initMap()
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.resTree1 = await channelVideoAreaList()
      this.treeList = this.resTree1.data.data ? [this.resTree1.data.data] : []
    },
    async init1() {
      await playVideoAreaList()
        .then((res) => {
          if (res.data.code === 0) {
            this.treeList1 = [res.data.data]
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
    initMap() {
      console.log('Run3DRun3DRun3DRun3DRun3D', Run3D)
      let map = new Run3D.Map()
      map.createMap('', 'mapContainerTest', {})
      //创建高德在线地图图层
      let gdOnlineMap = new Run3D.UrlTemplateImageLayer({
        url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', //高德地图
        minimumLevel: 0,
        maximumLevel: 23
      })
      map.layers.addRaster(gdOnlineMap)
    }
  }
}
</script>

<style lang="scss" scoped>
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
    flex-direction: column;
    justify-content: space-between;
    .resourceDiagram_container {
      width: 310px;
      margin: 20px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
      .tree_test {
        overflow-y: auto;

        height: 40%;
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
</style>
