<template>
  <div class="step1-content">
    <div class="main-content">
      <div class="securityArea_container">
        <leftTree
          ref="deviceTree"
          class="equipmentTree"
          :treeData="treeList"
          :defaultPropsName="areaNames"
        />
      </div>
      <div class="right-table"></div>
    </div>
    <div class="btn-lists">
      <el-button @click="goback"
        ><svg-icon class="svg-btn" icon-class="back-svg" />返回</el-button
      >
      <el-button type="primary" @click="clickLast" class="step-btn"
        >上一步</el-button
      >
      <el-button type="primary" @click="clickNext" class="step-btn"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  getAlarmVideoAreaList,
  getAlarmSchemeChannel
} from '@/api/method/alarm'
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
export default {
  name: '',
  components: { leftTree },
  data() {
    return {
      templateName: '',
      areaNames: 'resourceName',
      treeList: []
    }
  },
  mounted() {
    this.initTree()
  },
  methods: {
    async initTree() {
      await getAlarmVideoAreaList()
        .then((res) => {
          if (res.data.code === 0) {
            this.treeList = res.data.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getAllGatewayLists() {
      await getAllGatewayLists().then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.name
            obj.value = item.id
            obj.protocol = item.protocol
            this.allNorthTypeOptions.push(obj)
          })
        }
      })
    },
    clickLast() {
      this.$emit('last')
    },
    clickNext() {
      this.$emit('next')
    },
    goback() {
      this.$emit('goback')
    }
  }
}
</script>

<style lang="scss" scoped>
.step1-content {
  .main-content {
    height: calc(100% - 60px);
    display: flex;
    justify-content: space-between;
    .securityArea_container {
      height: calc(100% - 40px);
      width: 310px;
      margin: 20px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
      .btn-lists {
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 0 10px;
        .btn-span {
          position: relative;
          top: -2px;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
        }
        .svg-btn {
          position: relative;
          top: -1px;
          left: -6px;
        }
        .el-button {
          width: 70px;
          height: 32px;
        }
        .sort_div {
          display: inline-block;
          line-height: 32px;
          white-space: nowrap;
          text-align: center;
          cursor: pointer;
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          width: 70px;
          height: 32px;
          .btn-span {
            position: relative;
            top: -2px;
            font-size: 14px;
            color: #606266;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
          }
          .svg-btn {
            position: relative;
            top: 1px;
            left: -6px;
          }
        }
        .clicked-button {
          border: 1px solid #0270ff !important;
          .btn-span {
            color: #0270ff !important;
          }
        }
      }
    }
    .right-table {
      width: 100%;
      height: calc(100% - 16px);
      margin: 6px 0 0 -10px;
      position: relative;
      .table-content {
        width: 100%;
        height: 100%;
        .pane-content {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .btn-lists {
    text-align: right;
    padding-right: 24px;
    height: 64px;
    line-height: 64px;
    background: #ffffff;
    box-shadow: 0px -2px 4px 1px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 0px 0px;
    .svg-btn {
      position: relative;
      top: 1px;
      left: -4px;
    }
    .step-btn {
      height: 36px;
      position: relative;
      top: -1px;
    }
  }
}
</style>
