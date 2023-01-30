<template>
  <div style="font-size: 14px">
    <el-input
      v-model="searchValue"
      placeholder="请输入搜索关键字"
      class="group-wrapper-top-search"
      size="small"
    >
      <template slot="suffix">
        <div class="el-icon-wrapper">
          <i class="el-icon-search"></i>
        </div>
      </template>
    </el-input>
    <div class="wrapper-top-tree">
      <el-tree
        highlight-current
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
        @node-expand="nodeExpand"
        node-key="treeId"
        :default-expanded-keys="defaultExpandedKeys"
        :load="loadTreeNode"
        :filter-node-method="filterTreeNode"
        lazy
        :current-node-key="currentNodeKey"
        ref="tree"
      >
        <span
          slot-scope="{ node, data }"
          class="custom-tree-node"
          :class="{
            outline:
              data.online === 0
                ? data.online === 0
                : data.isLeaf
                ? data.status === 0
                : data.online === 0
          }"
          @mousedown="handleMouseDown($event, data)"
        >
          <span>
            <!-- <i v-if="data.children !== undefined" class="tree-icon-folder" />
            <i v-else class="tree-icon-camera" /> -->
            <i :class="`iconfont ${getClass(data)}`" />
            {{ data.sourceType ? data.selfChannelName : data.name }}
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
const DVR_REG = /.{10}111/
const NVR_REG = /.{10}118/
const PTZTYPES = {
  qiuji: { value: 1, class: 'icon-qiuji' },
  banqiu: { value: 2, class: 'icon-banqiu' },
  qiangji: { value: 3, class: 'icon-qiangji' },
  yaokongqiangji: { value: 4, class: 'icon-yuntaiqiangji' }
}

export default {
  name: 'monitorEquipmentGroup',
  data() {
    return {
      currentExpandNode: '',
      searchValue: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      defaultExpandedKeys: ['1_device']
    }
  },
  props: {
    loadLeaf: {
      type: Boolean,
      default: true
    },
    currentNodeKey: {
      type: [String, Number]
    },
    sendDevicePush: {
      type: Function,
      default: Function.prototype
    },
    click: {
      type: Function,
      default: Function.prototype
    },
    onLoadChannel: {
      type: Function,
      default: Function.prototype
    },
    onDrag: {
      type: Function,
      default: Function.prototype
    },
    treeHeight: {
      type: String,
      default: '100%'
    }
  },
  watch: {
    searchValue(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    // this.getTreeData()
  },
  methods: {
    getClass(data) {
      const ptztype = data.sourceType ? data.selfPtzType : data.ptztype
      switch (true) {
        case data.deviceId && ptztype == PTZTYPES.qiuji.value:
          return `channel ${PTZTYPES.qiuji.class}`
        case data.deviceId && ptztype == PTZTYPES.banqiu.value:
          return `channel ${PTZTYPES.banqiu.class}`
        case data.deviceId && ptztype == PTZTYPES.qiangji.value:
          return `channel ${PTZTYPES.qiangji.class}`
        case data.deviceId && ptztype == PTZTYPES.yaokongqiangji.value:
          return `channel ${PTZTYPES.yaokongqiangji.class}`
        case data.deviceId:
          return 'icon-tongdao2'
        case data.id == 1:
          return 'icon-diqiu'
        case DVR_REG.test(data.deviceId):
          return 'icon-NVR'
        case NVR_REG.test(data.deviceId):
          return 'icon-DVR'
        case !!data.deviceId:
          return 'icon-shexiangtou'
        default:
          return 'icon-dakaiwenjianjia tree-icon-folder'
      }
    },
    handleMouseDown(event, data) {
      //拖拽节点事件
      if (data.isLeaf) this.onDrag(event, data)
    },
    getTreeData() {
      this.$axios({
        method: 'get',
        url: '/api/platformManagement/queryAllNode',
        params: {
          nodeId: 1
        }
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.treeData = this.formattingTreeData(res.data.data)
            Array.isArray(res.data.data) &&
              res.data.data.forEach((node) => {
                this.getChannelData(node)
              })
          }
        })
        .catch(() => {
          this.$message({
            message: '调用失败！',
            type: 'error'
          })
        })
    },
    // 懒加载树子节点-通道
    async loadTreeNode(node, resolve) {
      // console.info("加载子节点", node);

      if (node.level === 0) {
        return resolve(this.treeData)
      }

      if (node.level === 1) {
        return resolve(this.treeData[0].children)
      }

      // const data = await
      const deviceId = node.data.deviceId
      if (!deviceId) {
        console.error('该设备Id不存在')
      }

      const data = await this.getChannelData(node.data)
      resolve(data)
    },
    // 树搜索过滤
    filterTreeNode(value, data) {
      if (!value) return true
      const name = data.sourceType ? data.selfChannelName : data.name
      if (!name) return false
      return name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    formattingTreeData(data) {
      if (!Array.isArray(data)) return null
      data.forEach((item) => {
        item.treeId = `${item.id}_device`
        item.children = this.formattingTreeData(item.children)
      })

      return data
    },
    formattingTreeData2(data) {
      // data[0].childNodes.forEach((item1) => {
      //     item1.childNodes.forEach((item3) => {
      //       item3.children = [];
      //       item3.isDevice = false;
      //       item3.label = item3.name;
      //       item1.children.push(item3);
      //     });

      // });
      return data[0].childNodes
      // 获取每个设备下的通道
      // this.getChannel(data);
    },
    // getChannel(data) {
    //   console.info(7799, data);
    //   data[0].children.forEach((item1) => {
    //     // console.info(8899, item1);
    //     if (item1.deviceId) {
    //       this.getChannelData(item1);
    //     }
    //   });
    // },
    // 获取指定设备下的通道
    getChannelData(data) {
      if (!this.loadLeaf) return null
      console.info('data', data)
      const { id, deviceList } = data
      console.info('deviceList', deviceList)

      if (id) {
        // 设备
        return new Promise((resolve, reject) => {
          this.$axios({
            method: 'get',
            url: '/api/platformManagement/queryNodeChannels',
            params: {
              nodeId: id,
              page: 1,
              count: 999
            }
          })
            .then((res) => {
              let { list } = res.data.data
              list = list.map((item) => {
                return {
                  ...item,
                  isLeaf: true,
                  name: item.channelName,
                  treeId: `${item.id}_channel`
                }
              })
              data.children = data.children ? data.children.concat(list) : list
              this.onLoadChannel(list)
              resolve(data.children)
            })
            .catch((error) => {
              console.info('获取通道错误')
              reject(error)
            })
        })
      }
    },
    // 点击节点
    handleNodeClick(data, index) {
      this.click(data)
      if (!data.isLeaf) {
        return
      }
      console.info('data', data)
      console.info('index', index)
      this.sendDevicePush(data, index)
      // return;
      // const deviceId = "";
      // const channelId = "";

      // this.$axios({
      //   method: "get",
      //   url: `/api/ptz/preset/query/${deviceId}/${channelId}`,
      // })
      //   .then((res) => {
      //     console.info("=====#####预位置查询", res);
      //   })
      //   .catch(() => {
      //     this.$message({
      //       message: "预位置查询失败！",
      //       type: "error",
      //     });
      //   });
    },
    nodeExpand(data, node, comp) {
      // console.info("data====", data);
      // console.info("node=====", node);
      // console.info("comp=====", comp);

      this.currentExpandNode = data.label
    }
  }
}
</script>

<style lang="scss">
::v-deep .tree-layout {
  overflow: auto;
}
.wrapper-top-tree {
  user-select: none;
  overflow: auto;

  .custom-tree-node {
    .tree-icon-folder {
      display: inline-block;
      width: 14px;
      height: 10.25px;
      // background-image: url("../assets/tree_folder.png");
      background-repeat: no-repeat;
      background-size: contain;
    }

    i {
      color: #1890ff;
    }

    .tree-icon-camera {
      display: inline-block;
      width: 14px;
      height: 11px;
      // background-image: url("../assets/tree_camera.png");
      // background-repeat: no-repeat;
      background-size: contain;
    }

    &.outline i {
      color: rgba(0, 0, 0, 0.45);
    }
  }

  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
.el-icon-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;

  .el-icon-search {
    width: 16px;
    height: 16px;
  }
}
.group-wrapper-top-search {
  height: 32px;
  margin-bottom: 14px;

  .el-input__inner {
    height: 32px;
  }

  .el-input__suffix {
  }
}
.equipment-group-wrapper {
  .equipment-group-wrapper-top {
    box-sizing: border-box;
    padding: 0 24px;
  }

  // .division-line-wrapper {
  //   display: flex;
  //   align-items: center;
  //   height: 6px;
  //   cursor: row-resize;

  //   .division-line {
  //     width: 100%;
  //     height: 1px;
  //     background-color: rgba(0, 0, 0, 0.15);
  //   }
  // }

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
