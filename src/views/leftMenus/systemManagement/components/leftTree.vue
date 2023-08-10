<template>
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
        :data="treeData"
        class="tree"
        :props="{ children: 'childList', label: resDefaultPropsName }"
        default-expand-all
        :default-expanded-keys="['根节点']"
        :current-node-key="resCurrentKey"
        :expand-on-click-node="false"
        :highlight-current="true"
        node-key="id"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span @dblclick.stop="hasEdit ? nodeDbClick(data) : ''">
            <svg-icon
              v-if="data.resourceType === 1 || data.menuType === 1"
              icon-class="mulu"
              class="tree1"
            />

            <svg-icon
              v-else-if="data.menuType === 0"
              icon-class="xunimulu"
              class="tree2"
            />
            <svg-icon v-else icon-class="ziyuan" class="tree2" />
            {{
              data.name ||
              data.sectionName ||
              data.resourceName ||
              data.areaNames
            }}

            <div v-if="!isClickTreeSort && data.id !== '0'" class="sort_btns">
              <svg-icon
                icon-class="sortDown"
                class="sort_down sort_btn"
                @click="invokeSort(0, data)"
              />
              <svg-icon
                icon-class="sortUp"
                class="sort_up sort_btn"
                @click="invokeSort(1, data)"
              />
            </div>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      filterText: '',
      resCurrentKey: '0',
      resDefaultPropsName: 'name'
    }
  },
  props: {
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    },
    isClickTreeSort: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    hasEdit: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    defaultPropsName: {
      type: String,
      default: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    resCurrentKey(val) {
      this.resCurrentKey = val
    },
    defaultPropsName(newVal, oldValue) {
      console.log(1111111111, newVal)
      this.resDefaultPropsName = newVal
    },
    deep: true
  },
  mounted() {
    // this.init()
  },
  methods: {
    handleNodeClick(data) {
      // data.icon = 'tree1'
      this.$emit('childClickHandle', data)
    },
    invokeSort(val, data) {
      this.$emit('changeSort', val, data)
    },
    nodeDbClick(data) {
      this.$emit('editTree', data)
    },
    handleNodeClose(data) {
      // data.icon = 'tree2'
    },
    chooseId(id) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(id)
          this.resCurrentKey = id
          this.$forceUpdate()
        })
      }, 500)
    },
    filterNode(value, data) {
      console.log('filterNode~~~~', value, data, this.$props.defaultPropsName)
      if (!value) return true
      if (this.$props.defaultPropsName === 'name') {
        return data.name && data.name.indexOf(value) !== -1
      } else if (this.$props.defaultPropsName === 'resourceName') {
        return data.resourceName && data.resourceName.indexOf(value) !== -1
      } else {
        return data.sectionName && data.sectionName.indexOf(value) !== -1
      }
    }
  }
}
</script>

<style lang="scss" scope>
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
.operation_box {
  height: 100%;
}
::v-deep .tree {
  margin-left: 0px;
}
/* 树形结构节点添加连线 */
.el-tree-node {
  position: relative;
  padding-left: 8px;
}
.el-tree-node__content {
  height: 32px;
  padding-left: 0px !important;
}

.el-tree-node__children {
  padding-left: 14px;
}

.el-tree-node :last-child:before {
  height: 38px;
}

.el-tree > .el-tree-node:before {
  border-left: none;
}
.tree-container .el-tree > .el-tree-node:after {
  border-top: none;
}

.el-tree-node__children .el-tree-node:before {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.el-tree-node:after {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
.el-tree-node__expand-icon.is-leaf {
  // display: none;
  padding-left: 4px;
}

.el-tree-node:before {
  content: '';
  height: 100%;
  width: 1px;
  position: absolute;
  left: -3px;
  top: -22px;
  border-width: 1px;
  border-left: 1px solid #dddddd;
}

.el-tree-node:after {
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
.sort_btns {
  position: absolute;
  right: 20px;
  top: 10px;
  .sort_btn {
    width: 20px;
    height: 20px;
  }
  .sort_down {
    margin-right: 10px;
  }
}
// 去掉顶部线条
.tree {
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
