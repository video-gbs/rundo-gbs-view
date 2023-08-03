<template>
  <el-dialog
    title="移动位置"
    :visible.sync="moveTreeShow"
    width="748px"
    :before-close="handleClose"
  >
    <div slot="title" class="dialog-title">
      <LineFont
        :line-title="lineTitle"
        :text-style="textStyle"
        :line-blue-style="lineBlueStyle"
      />
    </div>
    <div>
      <span>选中分组位置，提交后分组会移动至该目标下级</span>
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
            ref="tree"
            class="tree"
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            highlight-current
            node-key="id"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <svg-icon
                  v-if="data.level === 1"
                  icon-class="tree1"
                  class="tree1"
                />
                <svg-icon
                  v-else-if="
                    data.level === '2' ||
                    data.level === '3' ||
                    data.level === '4'
                  "
                  icon-class="tree2"
                  class="tree2"
                />
                <svg-icon v-else icon-class="tree3" class="tree3" />
                {{ data.name || data.resourceName || data.sectionName }}
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="moveTreeShow = false">取 消</el-button>
      <el-button type="primary" @click="moveTree" :loading="isLoading"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import LineFont from '@/components/LineFont'
import { videoAreaMove } from '@/api/method/encoder'
export default {
  name: '',
  components: { LineFont },
  props: {
    fatherId: {
      type: String,
      default: () => ''
    },
    activeName: {
      type: String,
      default: () => ''
    },
    deleteObj: {
      type: Object,
      default: () => {}
    },
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      moveTreeShow: false,
      defaultProps: {
        // 用于修改节点指定标签的属性值
        children: 'childList',
        label: 'resourceName'
      },
      lineTitle: {
        title: '移动位置',
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
      filterText: '',
      tagResourceValue: '',
      isLoading: false
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {},
  methods: {
    handleClose(done) {
      done()
    },
    moveTree() {
      this.isLoading = true
      // console.log('this.$props.fatherId', this.$props.fatherId)
      videoAreaMove({
        presourceValue: this.tagResourceValue,
        resourceKey: this.$props.deleteObj.resourceKey,
        resourceValue: this.$props.deleteObj.resourceValue
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '移动成功'
            })

            this.$emit('init', this.$props.activeName)
            this.isLoading = false
            this.moveTreeShow = false
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    handleNodeClick(data, index) {
      this.tagResourceValue = data.resourceValue
    },
    changeMoveTreeShow() {
      this.moveTreeShow = true
    },

    allowDrag(draggingNode) {
      return true
    },
    allowDrop(draggingNode, dropNode, type) {
      return false
    },
    filterNode(value, data) {
      if (!value) return true
      return data.resourceName.indexOf(value) !== -1
    },

    // 拖拽事件 参数依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event
    handleDrop: async function (draggingNode, dropNode, dropType, ev) {
      var paramData = []
      // 当拖拽类型不为inner,说明只是同级或者跨级排序，只需要寻找目标节点的父ID，获取其对象以及所有的子节点，并为子节点设置当前对象的ID为父ID即可
      // 当拖拽类型为inner，说明拖拽节点成为了目标节点的子节点，只需要获取目标节点对象即可
      var data = dropType != 'inner' ? dropNode.parent.data : dropNode.data
      var nodeData =
        dropNode.level == 1 && dropType != 'inner' ? data : data.children
      // 设置父ID,当level为1说明在第一级，pid为空
      nodeData.forEach((element) => {
        element.pid = dropNode.level == 1 ? '' : data.id
      })
      nodeData.forEach((element, i) => {
        var dept = {
          deptId: element.id,
          parentDeptId: element.pid,
          order: i
        }
        paramData.push(dept)
      })

      this.loading = true
      // 得到这次操作需要变更的数据范围，请求后台批量处理即可...
      // console.log('paramData',paramData)
      // console.log('draggingNode',draggingNode)
      // console.log('dropNode',dropNode)
      let id = draggingNode.data.id
      let orgPid = dropNode.data.id
      moveDepart({ id, orgPid }).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '移动成功'
          })
        }
        this.$emit('init')
        //自行逻辑，可以加提示框message
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
// 去掉顶部线条
.operation_box {
  height: 500px;
  .tree {
    max-height: calc(100% - 0px);
    overflow-y: auto;
    & > .el-tree-node::after {
      border-top: none;
    }
    & > .el-tree-node::before {
      border-left: none;
    }
  }
}
</style>
