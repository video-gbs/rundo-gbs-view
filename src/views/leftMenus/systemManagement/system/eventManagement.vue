<template>
  <div class="dataDictionary_container" v-if="isShow">
    <div class="panel-header-box">
      <div class="panel-header-box-border">事件管理</div>
    </div>

    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="120px"
      >
        <el-form-item label="事件名称:">
          <el-input
            v-model="searchParams.eventName"
            placeholder="请输入"
            clearable
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="事件编码:">
          <el-input
            v-model="searchParams.eventCode"
            placeholder="请输入"
            clearable
            style="width: 240px"
          ></el-input>
        </el-form-item>

        <el-form-item
          style="float: right; margin-right: 20px"
          class="form-btn-list"
        >
          <el-button @click="resetData($event)"
            ><svg-icon class="svg-btn" icon-class="cz" />
            <span class="btn-span">重置</span></el-button
          >
          <el-button type="primary" @click="cxData"
            ><svg-icon class="svg-btn" icon-class="cx" />
            <span class="btn-span">搜索</span></el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <div class="securityArea_container">
        <div class="btn-lists">
          <el-button type="primary" @click="dialogShow(1)"
            ><svg-icon class="svg-btn" icon-class="add" /><span class="btn-span"
              >新建</span
            ></el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="dataDictionary-table"
        border
        :header-cell-style="{
          background: 'rgba(0, 75, 173, 0.06)',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
          fontWeight: 'bold',
          color: '#333333'
        }"
      >
        <el-table-column type="index" width="50" align="center" label="序号">
        </el-table-column>
        <el-table-column prop="eventName" label="事件名称" />
        <el-table-column prop="eventCode" label="事件编码" />
        <el-table-column prop="eventSort" label="排序" />
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="dialogShow(0, scope.row)"
              >编辑</el-button
            >
            <el-button type="text" @click="deleteRole(scope.row)"
              ><span class="delete-button">删除</span></el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pages-data="params"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <el-dialog
      v-if="dialog.show"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="600px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="roleForm"
          class="params-form"
          size="mini"
          :rules="rules"
          label-position="left"
          label-width="100px"
          :model="dialog.params"
          @keyup.enter="submit('roleForm')"
        >
          <el-form-item label="事件名称" prop="eventName">
            <el-input
              v-model="dialog.params.eventName"
              clearable
              :maxlength="20"
            />
          </el-form-item>
          <el-form-item label="事件编码" prop="eventCode">
            <el-input
              v-model="dialog.params.eventCode"
              clearable
              :maxlength="20"
            />
          </el-form-item>
          <el-form-item label="排序" prop="eventSort">
            <el-input
              v-model="dialog.params.eventSort"
              clearable
              :maxlength="20"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit('roleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  initAlarmEventLists,
  addAlarmEvent,
  editAlarmEvent,
  deleteAlarmEvent
} from '@/api/method/alarm'
import pagination from '@/components/Pagination/index.vue'
import { Local } from '@/utils/storage'
export default {
  name: '',
  components: { pagination },
  data() {
    return {
      isShow: true,
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      dialog: {
        show: false,
        title: '新建',
        params: {
          eventName: '',
          eventCode: '',
          eventSort: ''
        }
      },
      searchParams: {
        eventName: '',
        eventCode: ''
      },
      rules: {
        eventName: [
          { required: true, message: '请输入字典名称', trigger: 'change' },
          {
            min: 0,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'change'
          }
        ],
        eventCode: [
          { required: true, message: '请输入字典项Value', trigger: 'change' },
          {
            min: 0,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'change'
          }
        ],
        eventSort: {
          required: true,
          message: '此为数字。',
          pattern: /^[0-9]*$/,
          trigger: 'blur'
        }
      },
      roleId: '',
      checkList: [],
      buttonLoading: false,
      treeData: []
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.getList()
    },
    cxData() {
      this.getList()
    },
    resetData(e) {
      this.searchParams = {
        eventName: '',
        eventCode: ''
      }
      let target = e.target
      if (target.nodeName === 'SPAN' || target.nodeName === 'svg') {
        target = e.target.parentNode.parentNode
      } else if (target.nodeName === 'user') {
        target = e.target.parentNode.parentNode.parentNode
      } else {
        target = e.target
      }
      target.blur()
      this.params.pageNum = 1
      this.getList()
    },
    goPage(path, query) {
      this.$router.replace(path)
    },
    isShowChildren(data) {
      return data.find((res) => {
        return res.childs.length !== 0
      })
    },
    dialogShow(act, data) {
      this.dialog.params = {
        eventName: '',
        eventCode: '',
        eventSort: ''
      }
      if (act === 0) {
        const { eventName, eventCode, eventSort } = data
        this.dialog.params.eventName = eventName
        this.dialog.params.eventCode = eventCode
        this.dialog.params.eventSort = eventSort
        this.editId = data.id
      }
      this.dialog.title = act ? '新建' : '编辑'
      this.dialog.show = !this.dialog.show
    },
    handleClose(done) {
      done()
    },
    permissionHandleClose(done) {
      done()
    },
    buildTree(v) {
      // v==get ,set
      this.checkList = []
      this.permissionTableData.forEach((i) => {
        if (i.childs && i.childs.length) {
          v === 'get' && i.hasAuthorize && this.checkList.push(i.id)
          i.childs.forEach((l) => {
            v === 'get' && l.hasAuthorize && this.checkList.push(l.id)
            if (l.childs && l.childs.length) {
              l.childs.forEach((m) => {
                v === 'get' && m.hasAuthorize && this.checkList.push(m.id)
              })
            }
          })
        }
      })
    },
    getPermissionTableData(id) {
      this.permissionDialog.show = !this.permissionDialog.show
      this.roleId = id
      permissionTree(id).then((res) => {
        if (res.data.code === 0) {
          this.permissionTableData = res.data
        }
      })
    },
    checkMenu(list) {
      list.forEach((item) => {
        if (item.permissionType === 1) {
          item.ifPublic = this.checkList.indexOf(String(item.id)) !== -1
        } else {
          item.children && this.checkMenu(item.children)
        }
      })
    },
    getCkeckList() {},
    savePermission() {
      this.buttonLoading = true
      // this.checkList = []
      this.buildTree('get')
      updateDict({
        roleId: this.roleId,
        permissionIds: this.checkList
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              message: '保存成功！',
              type: 'success'
            })

            this.buttonLoading = false
            this.permissionDialog.show = !this.permissionDialog.show
          } else {
            this.buttonLoading = false
          }
        })
        .catch(() => {
          this.buttonLoading = false
        })
    },
    async getList() {
      await initAlarmEventLists({
        num: this.params.pageSize,
        page: this.params.pageNum,
        ...this.searchParams
      })
        .then((res) => {
          if (res && res.data.code === 0) {
            this.tableData = res.data.data.list
            this.params.total = res.data.data.total
            this.params.pages = res.data.data.pages
            this.params.current = res.data.data.pageSize
            setTimeout(() => {
              this.isShow = true
            }, 500)
          }
        })
        .catch((error) => console.log(error))
    },
    deleteRole(row) {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAlarmEvent(row.id).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.getList()
          }
        })
      })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog.title) {
            case '新建':
              addAlarmEvent(this.dialog.params).then((res) => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新建成功'
                  })
                  this.dialog.show = false
                  this.getList()
                }
              })
              break
            case '编辑':
              editAlarmEvent({ id: this.editId, ...this.dialog.params }).then(
                (res) => {
                  if (res.data.code === 0) {
                    this.$message.success('编辑成功')
                    this.dialog.show = false
                    this.getList()
                  }
                }
              )
              break

            default:
              break
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table::before {
  height: 0 !important;
}
::v-deep .el-table--border {
  border-bottom: 1px solid #eaeaea;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #eaeaea;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #eaeaea;
}

::v-deep .dataDictionary-table .el-table__fixed-right {
  height: 100% !important;
}
// ::v-deep .el-table--enable-row-transition {
//   height: 100% !important;
// }
// ::v-deep .el-table::before {
//   height: 0;
// }
// 滚动条大小设置
::v-deep .dataDictionary-table::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .dataDictionary-table::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .dataDictionary-table::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .dataDictionary-table::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
.dataDictionary_container {
  width: 100%;
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

  .search {
    width: calc(100% - 40px);
    height: 80px;
    margin: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .search-form {
      position: relative;
      top: 60%;
      transform: translate(0%, -50%);
    }
  }
  .table-list {
    margin: 20px;
    padding: 20px;
    background: #ffffff;
    height: calc(100% - 200px);
    -webkit-box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
    box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
    border-radius: 2px;
    .dataDictionary-table {
      max-height: calc(100% - 100px);
      overflow-y: auto;
    }
    .securityArea_container {
      margin-bottom: 20px;
      .btn-lists {
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
          width: 80px;
          height: 32px;
        }
      }
    }
  }
}

.el-input {
  width: 100%;
}

.params-form {
  .el-input,
  .el-select {
    width: 100%;
    margin-right: 30px;
  }
}
.password-level-box {
  height: 28px !important;
  width: 100px;
  .password-level {
    height: 10px;
    width: 100px;

    > div {
      height: inherit;
      width: 33%;
      border: 1px solid #eee;
      margin-right: 5px;

      &:last-child {
        margin-right: 0px;
      }
    }
  }
}

.form-btn-list {
  .btn-span {
    position: relative;
    top: -1px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
  }
  .svg-btn {
    position: relative;
    top: -1px;
    left: -6px;
  }
}
.delete-button {
  color: red !important;
}

.page-main {
  background: $mainBg;
  .main-operation {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $mainBg;
    .title {
      padding-left: 20px;
      position: relative;
    }
  }

  .main-content {
    background: #fff;
    .perms-tree {
      .tree-title {
        height: 56px;
        line-height: 56px;
        background: rgba(245, 245, 245, 0.39);
        display: flex;
        .title {
          width: 120px;
          font-size: 14px;
          text-align: center;
          &:last-child {
            flex: 1;
          }
        }
      }
      .tree-item {
        display: flex;
        .item-title {
          width: 120px;
          // height: 56px;
          line-height: 24px;
          font-size: 14px;
          text-align: center;
          padding: 12px;
          white-space: nowrap;
        }
        .item-children {
          flex: 1;
        }
      }
      .item-border {
        // border-bottom: 1px solid #CCCCCC;
        border-bottom: 1px solid #ebeef5;
      }
      .tree-operation {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        padding: 12px;
        display: flex;
        margin-left: 140px;
      }
      .tree-empty {
        line-height: 24px;
        padding: 12px;
        text-align: center;
        color: #909399;
      }
    }
  }
}
.perms-operation {
  margin-right: 20px;
}
.button-back {
  margin-right: 20px;
}
::v-deep .el-table::before {
  height: 0;
}
</style>
