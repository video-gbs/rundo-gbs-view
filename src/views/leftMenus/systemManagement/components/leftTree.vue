<template>
  <div class="tree-content">
    <el-input
      placeholder="请输入搜索关键字"
      suffix-icon="el-icon-search"
      class="search-input"
    ></el-input>
    <div class="operation_box">
      <el-tree
        ref="tree"
        :data="treeData"
        node-key="orgName"
        class="tree"
        :props="defaultProps"
        :default-expanded-keys="['根节点']"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>
            <svg-icon
              v-if="data.level === '1'"
              icon-class="tree1"
              class="tree1"
            />
            <svg-icon
              v-else-if="
                data.level === '2' || data.level === '3' || data.level === '4'
              "
              icon-class="tree2"
              class="tree2"
            />
            <svg-icon v-else icon-class="tree3" class="tree3" />
            {{ data.orgName || data.areaName }}
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
      data: [
        {
          id: '1',
          label: '根节点',
          level: 1,
          children: [
            {
              id: '1-1',
              label: '广东省',
              level: 2,
              children: [
                {
                  id: '1-1-1',
                  label: '天河区',
                  level: 3,
                  children: [
                    {
                      id: '1-1-1-1',
                      label: '某某街道1',
                      level: 4,
                      children: [
                        {
                          id: '1-1-1-1-1',
                          label: '网络1',
                          level: 5
                        },
                        {
                          id: '1-1-1-1-2',
                          label: '网络2',
                          level: 5
                        }
                      ]
                    },
                    {
                      id: '1-1-1-2',
                      label: '某某街道2',
                      level: 4
                    },
                    {
                      id: '1-1-1-3',
                      label: '某某街道3',
                      level: 4
                    },
                    {
                      id: '1-1-1-4',
                      label: '某某街道4',
                      level: 4
                    }
                  ]
                },
                {
                  id: '1-1-2',
                  label: '越秀区',
                  level: 3
                },
                {
                  id: '1-1-3',
                  label: '黄浦区',
                  level: 3
                },
                {
                  id: '1-1-4',
                  label: '番禺区',
                  level: 3
                }
              ]
            },
            {
              id: '1-2',
              label: '湖南省',
              level: 2,
              children: [
                {
                  id: '1-2-1',
                  label: '长沙市',
                  level: 3,
                  children: [
                    {
                      id: '1-2-1-1',
                      label: '岳阳市',
                      level: 4
                    }
                  ]
                },
                {
                  id: '1-2-2',
                  label: '岳阳市',
                  level: 3
                },
                {
                  id: '1-2-3',
                  label: '某某市',
                  level: 3
                },
                {
                  id: '1-2-4',
                  label: '某某市',
                  level: 3
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        // 用于修改节点指定标签的属性值
        children: 'children',
        label: 'orgName'
      }
    }
  },
  props: {
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    handleNodeClick(data) {
      // data.icon = 'tree1'
    },
    handleNodeClose(data) {
      // data.icon = 'tree2'
    }
    // init() {
    //   getSysOrgTree({ id: 1 }).then((res) => {
    //     if (res.code === 200) {
    //       this.data = res.data
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scope>
// .operation_box {
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
  display: none;
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
  width: 10px;
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
// 去掉顶部线条
.tree {
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }
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
