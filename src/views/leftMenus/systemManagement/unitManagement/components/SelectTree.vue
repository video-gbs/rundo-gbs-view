<template>
  <el-select
    ref="select"
    class="user-select-tree"
    v-model="value"
    :placeholder="placeholder"
    :filterable="true"
    :remote-method="remoteMethod"
    @visible-change="visibleChange"
    :popper-append-to-body="false"
    style="width: 100%"
  >
    <el-option
      :value="selectTree"
      disabled
      style="
        height: auto;
        overflow-y: auto;
        padding: 0;
        background-color: #ffffff;
      "
    >
      <el-tree
        ref="selectTree"
        :data="treeList"
        :props="treeProps"
        :filter-node-method="filterNode"
        highlight-current
        default-expand-all
        :node-key="nodeKey"
        check-on-click-node
        :check-strictly="true"
        :expand-on-click-node="false"
        @node-click="handleTreeClick"
      >
        <span
          slot-scope="{ data }"
          :title="data[treeProps.label]"
          class="ellipsis"
        >
          {{ data[treeProps.label] }}
        </span>
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'index',
  props: {
    treeList: {
      type: Array
    }, //树形原始数据
    treeProps: Object, //树形配置
    nodeKey: String, //树形唯一键值
    defaultSelect: {
      //默认选择
      type: Boolean,
      default: true
    },
    defaultData: {
      type: Object,
      default: null
    },
    clearable: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择' }
  },
  data() {
    return {
      value: '',
      selectTree: ''
    }
  },
  watch: {
    // filterText(val) {
    //   console.log(1111, val)
    //   this.$refs.selectTree.filter(val)
    // },
    // defaultData(val) {
    //   if (this.highlightNode === -1) {
    //     this.setEdit(val)
    //   }
    // },
    // treeList(val) {
    //   if (val.length > 0) {
    //     this.$nextTick(() => {
    //       if (this.defaultSelect) {
    //         this.value = val[0][this.treeProps.children][0][this.nodeKey]
    //         // this.textStr =
    //         //   val[0][this.treeProps.children][0][this.treeProps.label]
    //         this.highlightNode = this.value
    //         this.currentKey = this.value
    //         this.$refs.selectTree.setCurrentKey(this.highlightNode)
    //         this.$emit('handleNodeClick', this.value)
    //       }
    //     })
    //   }
    // }
  },

  methods: {
    handleTreeClick(data, self, child) {
      console.log(111, this.$refs.selectTree.getCheckedNodes())
      let datalist = this.$refs.selectTree.getCheckedNodes()
      console.log(222, datalist)
      this.selectTree = []
      this.value = []
      datalist.forEach((item) => {
        this.selectTree.push({ id: item.id, label: item.orgName })
        this.value.push(item.orgName)
      })
    },
    remoteMethod(query) {
      setTimeout(() => {
        this.value = query
      }, 100)
    },
    visibleChange() {
      this.value = ''
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.treeProps.label].indexOf(value) !== -1
    },
    clearall() {
      this.selectTree = []
      this.$nextTick(() => {
        this.$refs.selectTree.setCheckedNodes([])
      })
    }
  }
}
</script>

<style scoped lang="scss">
.user-select-tree {
  ::v-deep {
    .el-icon-::before {
      content: '\ea1b';
      font-family: 'icomoon' !important;
      display: inline-block;
      -webkit-transform: scale(0.83);
      font-size: 10px;
      //width: 100%;
      //height: 100%;
      color: #666666;
      pointer-events: none;
    }
    .el-input.is-focus {
      .el-icon- {
        transform: rotate(0deg);
      }
    }
    .el-input__inner {
      height: 36px;
      line-height: 36px;
    }
    .el-input__icon {
      line-height: 36px;
    }
    .el-tree-node__content {
      height: 32px;
    }
  }
}
</style>
