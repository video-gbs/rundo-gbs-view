<template>
  <div class="main" v-if="isShow">
    <div class="panel-header-box">
      <div class="panel-header-box-border">地图管理</div>
    </div>
    <!-- <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        :model="searchParams"
        label-width="100px"
      >
        <el-form-item label="客户端账号:">
          <el-input
            v-model="searchParams.dictId"
            placeholder="请输入IP地址"
            class="mr10"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="客户端名称:">
          <el-input
            v-model="searchParams.latitude"
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
    </div> -->
    <div class="main-content">
      <div class="p10 right-table">
        <div class="table-list">
          <div class="mapConfiguration_container">
            <!-- v-permission="['/auth-client/add', 2]" -->
            <div class="btn-lists">
              <el-button type="primary" @click="addDialogShow"
                ><svg-icon class="svg-btn" icon-class="add" /><span
                  class="btn-span"
                  >新建</span
                ></el-button
              >
            </div>
          </div>
          <div class="table-content">
            <el-table
              ref="mapConfigurationTable"
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
                prop="dictId"
                label="地图"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span v-for="item in dictIdOption" :key="item.value">{{
                    Number(item.value) === scope.row.dictId ? item.label : ''
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="longitude"
                label="经度"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="latitude"
                label="纬度"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="height"
                label="高度"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="heading"
                label="偏航角"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="pitch"
                label="俯仰角"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="roll"
                label="翻滚角"
                :show-overflow-tooltip="true"
              >
              </el-table-column>
              <el-table-column
                prop="onStatus"
                label="状态"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.onStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    @change="changeSwitch(scope.row)"
                  >
                  </el-switch>
                </template>
              </el-table-column>

              <el-table-column width="100" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="editData(scope.row)"
                    >编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <pagination
              :pages-data="params"
              @size-change="sizeChange"
              @current-change="currentChange"
            /> -->
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
            <el-form-item label="地图类型：" prop="dictId">
              <el-select
                v-model="dialogForm.dictId"
                placeholder="请选择"
                style="width: 436px"
              >
                <el-option
                  v-for="o in dictIdOption"
                  :label="o.label"
                  :value="o.value"
                  :key="o.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="瓦片格式：" prop="imgType">
              <el-select
                v-model="dialogForm.imgType"
                placeholder="请选择"
                style="width: 436px"
              >
                <el-option
                  v-for="o in imgTypeOption"
                  :label="o.label"
                  :value="o.value"
                  :key="o.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="经度：" prop="longitude">
              <el-input
                v-model="dialogForm.longitude"
                style="width: 436px"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="纬度：" prop="latitude">
              <el-input
                v-model="dialogForm.latitude"
                style="width: 436px"
              ></el-input>
            </el-form-item>
            <el-form-item label="高度：" prop="height">
              <el-input
                v-model="dialogForm.height"
                style="width: 436px"
              ></el-input>
            </el-form-item>

            <el-form-item label="偏航角：" prop="heading">
              <el-input
                v-model="dialogForm.heading"
                style="width: 436px"
              ></el-input>
            </el-form-item>
            <el-form-item label="俯仰角：" prop="pitch">
              <el-input
                v-model="dialogForm.pitch"
                style="width: 436px"
              ></el-input>
            </el-form-item>
            <el-form-item label="翻滚角：" prop="roll">
              <el-input
                v-model="dialogForm.roll"
                style="width: 436px"
              ></el-input>
            </el-form-item>

            <el-form-item label="地图地址：" prop="url">
              <el-input
                v-model="dialogForm.url"
                style="width: 436px"
              ></el-input>
            </el-form-item>

            <!-- <el-form-item
              label="状态："
              prop="requireAuthorizationConsent"
            >
              <el-radio-group v-model="dialogForm.requireAuthorizationConsent">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item> -->
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
import { addGis, statusChangeGis, configGisList } from '@/api/method/mapConfig'
import { getGroupDictLists } from '@/api/method/dictionary'
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
        dictId: '',
        latitude: ''
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
      imgTypeOption: [
        {
          label: 'png',
          value: 'png'
        },
        {
          label: 'jpg',
          value: 'jpg'
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
        imgType: [{ required: true, message: '请选择', trigger: 'change' }],
        heading: [
          { required: true, message: '1~128个字符。', trigger: 'blur' }
        ],
        pitch: [{ required: true, message: '1~128个字符。', trigger: 'blur' }],
        roll: [{ required: true, message: '1~128个字符。', trigger: 'blur' }],
        url: [{ required: true, message: '1~128个字符。', trigger: 'blur' }],
        latitude: {
          required: true,
          message: '范围从-180~180的数字，支持小数点后6位。',
          pattern:
            /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,
          trigger: 'blur'
        },
        dictId: [{ required: true, message: '此为必填项。', trigger: 'blur' }],
        longitude: {
          required: true,
          message: '范围从-180~180的数字，支持小数点后6位。',
          pattern:
            /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,
          trigger: 'blur'
        },
        height: {
          required: true,
          message: '此为数字。',
          pattern: /^[0-9]*$/,
          trigger: 'blur'
        }
      },
      dictIdOption: [],
      title1: '新建',
      dialogForm: {
        dictId: '',
        latitude: '',
        height: '',
        heading: '',
        pitch: '',
        roll: '',
        longitude: '',
        url: '',
        imgType: 'png'
      },
      dialogShowDetails: false,
      tableData: [],
      editId: ''
    }
  },
  created() {},
  mounted() {
    this.init()
    this.getManufacturerDictionaryList()
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      await configGisList().then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
          setTimeout(() => {
            this.isShow = true
          }, 500)
        }
      })
    },
    async getManufacturerDictionaryList() {
      await getGroupDictLists('MapConfig').then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.itemName
            obj.value = item.itemValue
            this.dictIdOption.push(obj)
          })
        }
      })
    },
    addDialogShow() {
      this.dialogShow = true
      this.title1 = '新建'
      this.dialogForm = {
        dictId: '',
        latitude: '',
        longitude: '',
        height: '',
        heading: '',
        pitch: '',
        roll: '',
        url: '',
        imgType: 'png'
      }
    },
    changeSwitch(row) {
      let result = this.tableData.some((data, index) => {
        if (data.onStatus === 1 && row.id !== data.id) {
          return true
        }
      })
      if (result) {
        this.$message({
          type: 'warning',
          message: '仅允许开启一个地图'
        })
        row.onStatus = row.onStatus === 0 ? 1 : 0
      } else {
        let resName = ''
        this.dictIdOption.map((item) => {
          if (Number(item.value) === row.dictId) {
            resName = item.label
          }
        })
        let text = row.onStatus === 1 ? '启用' : '停用'

        this.$confirm('确认要"' + text + '""' + resName + '"吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            statusChangeGis({
              id: row.id,
              onStatus: row.onStatus
            }).then((res) => {
              if (res.data.code !== 0) {
                row.onStatus = row.onStatus === 0 ? 1 : 0
              }
            })
          })
          .catch(() => {
            row.onStatus = row.onStatus === 0 ? 1 : 0
          })
      }
    },
    editData(row) {
      this.dialogShow = true
      this.title1 = '编辑'
      const {
        dictId,
        latitude,
        longitude,
        height,
        url,
        imgType,
        heading,
        pitch,
        roll
      } = row
      console.log(1111, row)
      this.dialogForm.dictId = String(dictId)
      this.dialogForm.latitude = latitude
      this.dialogForm.longitude = longitude
      this.dialogForm.height = height

      this.dialogForm.heading = heading
      ;(this.dialogForm.pitch = pitch),
        (this.dialogForm.roll = roll),
        (this.dialogForm.url = url)
      this.dialogForm.imgType = imgType
      this.editId = row.id
    },
    save(formName, val) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (val === '新建') {
            console.log('this.dialogForm', this.dialogForm)

            addGis(this.dialogForm).then((res) => {
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
            addGis({
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
        .mapConfiguration_container {
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
