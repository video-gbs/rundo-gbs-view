<template>
  <div class="main" v-if="isShow">
    <div class="panel-header-box">
      <div class="panel-header-box-border">客户端管理</div>
    </div>
    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="100px"
      >
        <el-form-item label="客户端账号:">
          <el-input
            v-model="searchParams.clientId"
            placeholder="请输入IP地址"
            class="mr10"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="客户端名称:">
          <el-input
            v-model="searchParams.clientName"
            placeholder="请输入IP地址"
            class="mr10"
            clearable
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
    <div class="main-content">
      <div class="p10 right-table">
        <div class="table-list">
          <div class="securityArea_container">
            <div class="btn-lists">
              <el-button
                v-permission="['/auth-client/add', 2]"
                type="primary"
                @click="addDialogShow"
                ><svg-icon class="svg-btn" icon-class="add" /><span
                  class="btn-span"
                  >新建</span
                ></el-button
              >
            </div>
          </div>
          <div class="table-content">
            <el-table
              ref="registrationListTable"
              class="table-content-bottom"
              :data="tableData"
              border
              :header-cell-style="{
                background: 'rgba(0, 75, 173, 0.06)',
                fontSize: '14px',
                fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
                fontWeight: 'bold',
                color: '#333333'
              }"
            >
              <el-table-column
                type="index"
                width="50"
                align="center"
                label="序号"
              >
              </el-table-column>
              <el-table-column
                prop="clientId"
                label="客户端账号"
                width="140"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="clientName"
                label="客户端名称"
                width="160"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="authorizationGrantTypes"
                label="授权方式"
                :show-overflow-tooltip="true"
                width="260"
              >
                <template slot-scope="scope">
                  <span
                    v-for="item in scope.row.authorizationGrantTypes"
                    :key="item"
                    style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
                    >{{ authorizationGrantTypes[item] + ',' }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="clientAuthenticationMethods"
                label="客户端授权方式"
                :show-overflow-tooltip="true"
                width="260"
              >
                <template slot-scope="scope">
                  <span
                    v-for="item in scope.row.clientAuthenticationMethods"
                    :key="item"
                    style="margin-left: 10px; color: rgba(53, 144, 0, 1)"
                    >{{ clientAuthenticationMethods[item] + ',' }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="redirectUris"
                label="回调url"
                width="120"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="scopes"
                label="授权范围"
                width="120"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="requireAuthorizationConsent"
                label="是否需要用户授权"
                width="180"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{
                    scope.row.requireAuthorizationConsent ? '是' : '否'
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="clientIdIssuedAt"
                label="客户端账号发布时间"
                width="200"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="clientSecretExpiresAt"
                label="客户端密码过期时间"
                width="200"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="accessTokenTimeToLiveSecond"
                label="授权token的过期时间 单位：秒"
                width="220"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="refreshTokenTimeToLiveSecond"
                label="刷新token的过期时间 单位：秒"
                width="220"
                :show-overflow-tooltip="true"
              />

              <el-table-column
                prop="authCodeTimeToLiveSecond"
                label="授权code的过期时间 单位：秒"
                width="220"
              />
              <el-table-column
                width="180"
                label="操作"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['/auth-client/update', 3]"
                    type="text"
                    @click="editData(scope.row)"
                    >编辑
                  </el-button>
                  <el-button
                    v-permission="['/auth-client/delete', 4]"
                    type="text"
                    @click="deleteRole(scope.row)"
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
        </div>
      </div>

      <el-dialog
        v-if="dialogShow"
        title="新建"
        :visible.sync="dialogShow"
        width="700px"
      >
        <div slot="title" class="dialog-title">
          <LineFont
            :line-title="{
              title: title1,
              notShowSmallTitle: false
            }"
            :text-style="textStyle"
            :line-blue-style="lineBlueStyle"
          />
        </div>
        <div>
          <el-form
            ref="roleForm"
            label-width="180px"
            :model="dialogForm"
            :rules="rules"
          >
            <el-form-item label="客户端账号：" prop="clientId">
              <el-input
                v-model="dialogForm.clientId"
                style="width: 436px"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="客户端密码：">
              <el-input
                v-model="dialogForm.clientSecret"
                style="width: 436px"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="客户端名称：" prop="clientName">
              <el-input
                v-model="dialogForm.clientName"
                style="width: 436px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="用户授权登录方式："
              prop="authorizationGrantTypes"
            >
              <el-select
                v-model="dialogForm.authorizationGrantTypes"
                placeholder="请选择"
                multiple
                style="width: 436px"
              >
                <el-option
                  v-for="o in authorizationGrantTypesOption"
                  :label="o.label"
                  :value="o.value"
                  :key="o.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="客户端授权方式："
              style="width: 436px"
              prop="clientAuthenticationMethods"
            >
              <el-select
                v-model="dialogForm.clientAuthenticationMethods"
                placeholder="请选择"
                multiple
                style="width: 436px"
              >
                <el-option
                  v-for="o in clientAuthenticationMethodsOption"
                  :label="o.label"
                  :value="o.value"
                  :key="o.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="授权范围：" prop="scopes">
              <el-input
                v-model="dialogForm.scopes"
                style="width: 436px"
                placeholder="可多填，用逗号分割"
              ></el-input>
            </el-form-item>

            <el-form-item label="回调url：">
              <el-input
                v-model="dialogForm.redirectUris"
                style="width: 436px"
                placeholder="可多填，用逗号分割"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户端密码过期时间：">
              <el-date-picker
                v-model="dialogForm.clientSecretExpiresAt"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 436px"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="授权token的过期时间：">
              <el-input
                v-model="dialogForm.accessTokenTimeToLiveSecond"
                style="width: 436px"
              ></el-input>
            </el-form-item>
            <el-form-item label="刷新token的过期时间：">
              <el-input
                v-model="dialogForm.refreshTokenTimeToLiveSecond"
                style="width: 436px"
              ></el-input>
            </el-form-item>
            <el-form-item label="授权code的过期时间：">
              <el-input
                v-model="dialogForm.authCodeTimeToLiveSecond"
                style="width: 436px"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="是否需要用户授权："
              prop="requireAuthorizationConsent"
            >
              <el-radio-group v-model="dialogForm.requireAuthorizationConsent">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-footer">
          <el-button @click="dialogShow = false">取消</el-button>
          <el-button type="primary" @click="save('roleForm', title1)"
            ><svg-icon class="svg-btn" icon-class="save" />确认</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import leftTree from '@/views/leftMenus/systemManagement//components/leftTree'
import pagination from '@/components/Pagination/index.vue'
import LineFont from '@/components/LineFont'
import { Local } from '@/utils/storage'
import { mapGetters } from 'vuex'
import {
  getClientLists,
  clientDelete,
  addClient,
  updateClient
} from '@/api/method/clientManagement'
export default {
  name: '',
  components: { leftTree, pagination, LineFont },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      isShow: false,
      searchParams: {
        clientId: '',
        clientName: ''
      },
      lineTitle: {
        title: '新建',
        notShowSmallTitle: false
      },
      lineTitle1: {
        title: '编辑',
        notShowSmallTitle: false
      },
      authorizationGrantTypesOption: [
        {
          label: '授权码模式',
          value: 1
        },
        {
          label: '刷新token',
          value: 2
        },
        {
          label: '客户端模式',
          value: 3
        },
        {
          label: '账号密码模式',
          value: 4
        },
        {
          label: 'JWT模式',
          value: 5
        }
      ],
      authorizationGrantTypes: {
        1: '授权码模式',
        2: '刷新token',
        3: '客户端模式',
        4: '账号密码模式',
        5: 'JWT模式'
      },
      clientAuthenticationMethods: {
        1: 'BASIC模式',
        2: 'POST模式',
        3: 'JWT模式',
        4: '私有密钥JWT模式',
        5: 'NONE模式'
      },
      clientAuthenticationMethodsOption: [
        {
          label: 'BASIC模式',
          value: 1
        },
        {
          label: 'POST模式',
          value: 2
        },
        {
          label: 'JWT模式',
          value: 3
        },
        {
          label: '私有密钥JWT模式',
          value: 4
        },
        {
          label: 'NONE模式',
          value: 5
        }
      ],
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
      dialogShow: false,
      rules: {
        clientAuthenticationMethods: [
          { required: true, message: '此为必填项。', trigger: 'change' }
        ],
        authorizationGrantTypes: [
          { required: true, message: '此为必填项。', trigger: 'change' }
        ],
        requireAuthorizationConsent: [
          { required: true, message: '此为必填项。', trigger: 'change' }
        ],
        clientSecret: [
          { required: true, message: '此为必填项。', trigger: 'blur' }
        ],
        accessTokenTimeToLiveSecond: {
          message: '此为数字。',
          pattern: /^[0-9]*$/,
          trigger: 'blur'
        },
        accessTokenTimeToLiveSecond: {
          message: '此为数字。',
          pattern: /^[0-9]*$/,
          trigger: 'blur'
        },
        authCodeTimeToLiveSecond: {
          message: '此为数字。',
          pattern: /^[0-9]*$/,
          trigger: 'blur'
        },
        clientId: [
          { required: true, message: '此为必填项。', trigger: 'blur' }
        ],
        clientName: [
          { required: true, message: '此为必填项。', trigger: 'blur' }
        ],
        scopes: [{ required: true, message: '此为必填项。', trigger: 'blur' }]
      },
      title1: '新建',
      dialogForm: {
        clientId: '',
        clientName: '',
        authorizationGrantTypes: [],
        clientAuthenticationMethods: [],
        scopes: null,
        redirectUris: null,
        requireAuthorizationConsent: true,
        accessTokenTimeToLiveSecond: '',
        refreshTokenTimeToLiveSecond: '',
        authCodeTimeToLiveSecond: '',
        clientSecretExpiresAt: ''
      },
      dialogShowDetails: false,
      tableData: [],
      editId: ''
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      await getClientLists({
        num: this.params.pageSize,
        page: this.params.pageNum,
        ...this.searchParams
      }).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.params.total = res.data.data.total
          this.params.pages = res.data.data.pages
          this.params.current = res.data.data.current
          setTimeout(() => {
            this.isShow = true
          }, 500)
        }
      })
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.init()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.init()
    },
    resetData(e) {
      this.searchParams = {
        clientId: '',
        iclientNamep: ''
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
      this.init()
    },
    cxData() {
      this.init()
    },
    addDialogShow() {
      this.dialogShow = true
      this.title1 = '新建'
      this.dialogForm = {
        clientId: '',
        clientName: '',
        authorizationGrantTypes: [],
        clientAuthenticationMethods: [],
        scopes: null,
        redirectUris: null,
        requireAuthorizationConsent: true,
        accessTokenTimeToLiveSecond: '',
        refreshTokenTimeToLiveSecond: '',
        authCodeTimeToLiveSecond: '',
        clientSecretExpiresAt: ''
      }
    },
    editData(row) {
      this.dialogShow = true
      this.title1 = '编辑'
      const {
        clientId,
        clientName,
        authorizationGrantTypes,
        clientAuthenticationMethods,
        scopes,
        redirectUris,
        requireAuthorizationConsent,
        accessTokenTimeToLiveSecond,
        refreshTokenTimeToLiveSecond,
        authCodeTimeToLiveSecond,
        clientSecretExpiresAt
      } = row
      console.log(1111, row)
      this.dialogForm.clientId = clientId
      this.dialogForm.clientName = clientName
      this.dialogForm.authorizationGrantTypes = authorizationGrantTypes
      this.dialogForm.clientAuthenticationMethods = clientAuthenticationMethods
      this.dialogForm.scopes = scopes
      this.dialogForm.redirectUris = redirectUris
      this.dialogForm.requireAuthorizationConsent = requireAuthorizationConsent
      this.dialogForm.accessTokenTimeToLiveSecond = accessTokenTimeToLiveSecond
      this.dialogForm.refreshTokenTimeToLiveSecond =
        refreshTokenTimeToLiveSecond
      this.dialogForm.authCodeTimeToLiveSecond = authCodeTimeToLiveSecond
      this.dialogForm.clientSecretExpiresAt = clientSecretExpiresAt
      this.editId = row.id
    },
    save(formName, val) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogForm.redirectUris = !Array.isArray(
            this.dialogForm.redirectUris
          )
            ? this.dialogForm.redirectUris.split(',')
            : this.dialogForm.redirectUris
          this.dialogForm.scopes = !Array.isArray(this.dialogForm.scopes)
            ? this.dialogForm.scopes.split(',')
            : this.dialogForm.scopes

          if (val === '新建') {
            console.log('this.dialogForm', this.dialogForm)

            addClient(this.dialogForm).then((res) => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.dialogShow = false
                this.init()
              }
            })
          } else {
            updateClient({
              id: this.editId,
              ...this.dialogForm
            }).then((res) => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                this.dialogShow = false
                this.init()
              }
            })
          }
        }
      })
    },
    deleteRole(row) {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clientDelete(row.id).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.init()
          }
        })
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
::v-deep .gatewayModuleManagementTree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
// 没有展开且有子节点
::v-deep .gatewayModuleManagementTree .el-icon-caret-right:before {
  background: url('~@/assets/imgs/treeOpen.png') no-repeat 0 0;
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  position: relative;
  top: 1px;
}
// 已经展开且有子节点
::v-deep
  .gatewayModuleManagementTree
  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  background: url('~@/assets/imgs/treeClose.png') no-repeat 0 0;
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  position: relative;
  top: 1px;
}
// 没有子节点
::v-deep
  .gatewayModuleManagementTree
  .el-tree-node__expand-icon.is-leaf::before {
  display: none;
}

::v-deep .el-dialog__header {
  border-bottom: 1px solid rgba(234, 234, 234, 1);
  padding: 0 20px;
}
::v-deep .el-dialog__body {
  padding: 30px 0 0 0;
}
::v-deep .el-tabs__content {
  flex: 1;
}
::v-deep .el-tabs--border-card {
  box-shadow: none;
  border: 0;
}
.recycle-btn {
  position: absolute;
  top: 7px;
  right: 7px;
  z-index: 10;
}
::v-deep .el-tabs__item.is-active {
  border: 0 none;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 20px 24px;
}
::v-deep .el-tabs--border-card {
  background: #f9f9f9;
  border-top: 0 none;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border: 0 none;
  background: #ececec;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: 0 none;
  height: 36px;
  margin: 0 4px 0px 0;
  border-radius: 2px;
  background: #f6f6f6 !important;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  position: relative;
  top: 4px;
}
::v-deep .el-tabs__nav > .is-active {
  background: #f9f9f9 !important;
}
::v-deep .el-tabs__item {
  box-shadow: none !important;
}

::v-deep .table-content-bottom .el-table__fixed-right {
  height: 100% !important;
}
::v-deep .el-table--enable-row-transition {
  // height: 100% !important;
}
// 滚动条大小设置
::v-deep .table-content-bottom::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}
// 滚动条滑块样式设置
::v-deep .table-content-bottom::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .table-content-bottom::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .table-content-bottom::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
.main {
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
  .main-content {
    height: calc(100% - 50px);
    display: flex;
    margin-right: 18px;
    justify-content: space-between;
    .gatewayModuleManagement_container {
      height: calc(100% - 50px);
      width: 310px;
      margin: 20px;
      background: #ffffff;
      box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    }
    .right-table {
      width: 100%;
      margin: 10px;
      position: relative;
      .table-list {
        width: calc(100% - 0px);
        height: calc(100% - 22px);
        background: #ffffff;
        box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
        border-radius: 2px;
        padding: 18px;
        // margin: 20px;
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
        .table-content-bottom {
          height: calc(100% - 100px);
          overflow-y: auto;
        }
        .yuan {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #359000;
        }
        .yuan1 {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #b1b1b1;
        }
      }
    }
    .right-table-else {
      width: calc(100% - 340px);
      margin: 6px 0 0 -10px;
      position: relative;
    }
  }
}
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
.svg-btn {
  position: relative;
  top: 1px;
  left: -4px;
}
.search {
  margin: 12px 20px 10px 20px;
  width: 98%;
  // min-height: 80px;
  background: #ffffff;
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  .search-form {
    padding-top: 25px;
  }
}
</style>
