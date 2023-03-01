<template>
  <div class="userAdd-content">
    <div class="panel-header-box">
      <div>
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" />
        <span class="back-title">新建用户</span>
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="pjqktj" class="pjqktj_svg" />
        <span>基本信息</span>
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-width="auto" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="userAccount" label="用户账号">
                <el-input
                  v-model="form.userAccount"
                  style="width: 436px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="password" label="密码">
                <el-input
                  v-model="form.password"
                  style="width: 436px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="desc" label="用户姓名">
                <el-input
                  v-model="form.userName"
                  style="width: 436px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="rePassword" label="确认密码">
                <el-input
                  v-model="form.rePassword"
                  style="width: 436px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="expiryDateStart" label="有效日期（开始）">
                <el-date-picker
                  v-model="form.expiryDateStart"
                  type="datetime"
                  placeholder="开始日期"
                  style="width: 436px"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="orgId" label="所属部门">
                <el-select
                  ref="selectTree"
                  v-model="form.orgId"
                  placeholder="请选择"
                  :popper-append-to-body="false"
                  style="width: 436px"
                  class="selectTree"
                >
                  <el-option :value="List">
                    <el-tree
                      class="userAddTree"
                      :data="treeList"
                      node-key="id"
                      :props="defaultProps"
                      :default-expanded-keys="Ids"
                      ref="tree"
                      highlight-current
                      :expand-on-click-node="false"
                      @node-click="nodeClickHandle"
                    ></el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="desc" label="有效日期（结束）">
                <el-date-picker
                  v-model="form.expiryDateEnd"
                  type="datetime"
                  placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 436px"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12"></el-col> -->
          </el-row>
        </el-form>
      </div>
      <div class="box-card1">
        <div class="clearfix1">
          <svg-icon icon-class="pjqktj" class="pjqktj_svg" />
          <span>详细信息</span>
        </div>
        <div class="text item">
          <el-form
            ref="form1"
            :model="form1"
            label-width="120px"
            :rules="rules"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item prop="desc" label="用户工号">
                  <el-input
                    v-model="form1.jobNo"
                    style="width: 436px"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="desc" label="手机号码">
                  <el-input
                    v-model="form1.phone"
                    style="width: 436px"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="desc" label="地址">
                  <el-input
                    v-model="form1.address"
                    style="width: 436px"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="desc" label="描述">
                  <el-input
                    v-model="form1.description"
                    type="textarea"
                    :rows="2"
                    :maxlength="50"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="box-card-last">
        <div slot="header" class="clearfix">
          <svg-icon icon-class="pjqktj" class="pjqktj_svg" />
          <span>角色</span>
        </div>
        <div class="last-table">
          <el-table
            ref="userTable"
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
              type="selection"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            ></el-table-column>
            <el-table-column
              prop="roleName"
              label="角色名称"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="roleDesc"
              label="角色描述"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="createdBy"
              label="创建"
              :show-overflow-tooltip="true"
            />
          </el-table>
          <pagination
            :pages-data="params"
            @size-change="sizeChange"
            @current-change="currentChange"
          />
        </div>
        <div class="dialog-footer">
          <el-button @click="goback()">
            <svg-icon class="svg-btn" icon-class="back-svg" />返回
          </el-button>
          <el-button type="primary" @click="save()">
            <svg-icon class="svg-btn" icon-class="save" />保存
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'
import { getVideoAraeTree, getUserInfoList } from '@/api/method/role'
import { addUser } from '@/api/method/user'
import moment from 'moment'
export default {
  name: '',
  components: { pagination },
  data() {
    return {
      tableData: [],
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      treeList: [],
      List: '',
      Ids: [],
      Id: '',
      defaultProps: {
        children: 'children',
        label: 'areaName'
      },
      form: {
        userAccount: '',
        password: '',
        userName: '',
        rePassword: '',
        expiryDateStart: '',
        orgId: '',
        expiryDateEnd: ''
      },
      form1: {
        address: '',
        description: '',
        phone: '',
        jobNo: ''
      },
      roleIds: [],
      rules: {
        userAccount: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: {
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        rePassword: {
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        orgId: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'change'
          }
        ],
        expiryDateStart: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    ;(this.form = {
      userAccount: '',
      password: '',
      userName: '',
      rePassword: '',
      expiryDateStart: '',
      orgId: '',
      expiryDateEnd: ''
    }),
      (this.form1 = {
        address: '',
        description: '',
        phone: '',
        jobNo: ''
      }),
      this.init()
    this.getLists()
  },
  methods: {
    async init(id) {
      await getVideoAraeTree()
        .then((res) => {
          if (res.code === 0) {
            this.treeList = res.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getLists(id) {
      await getUserInfoList({
        current: this.params.pageNum,
        pageSize: this.params.pageSize
      })
        .then((res) => {
          if (res.code === 0) {
            this.tableData = res.data.records
            this.params.total = res.data.total
            this.params.pages = res.data.pages
            this.params.current = res.data.current
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // handleSelectionChange(val) {
    //   if (val.length > 1) {
    //     val.map((item) => {
    //       this.roleIds.push(item.id)
    //     })

    //     this.roleIds = [...new Set(this.roleIds)]
    //     console.log('this.roleIds', this.roleIds)
    //   }
    // },

    handlePasswordCheck(password, rePassword) {
      if (!password) {
        this.$message.error('请输入密码')
        return false
      }
      if (!rePassword) {
        this.$message.error('请确认新密码')
        return false
      }
      if (password && rePassword && password.trim() !== rePassword.trim()) {
        this.$message.error('两次输入的密码不一致')
        return false
      }
      return true
    },
    save(formName) {
      // console.log(1111,this.$refs.userTable.selection)
      Promise.all([
        this.$refs.form.validate(),
        this.$refs.form1.validate()
      ]).then(() => {
        if (
          !this.handlePasswordCheck(this.form.password, this.form.rePassword)
        ) {
          return
        }
        this.form.orgId = this.Id
        const roleIds = []
        console.log(
          'this.$refs.userTable.selection',
          this.$refs.userTable.selection
        )
        this.$refs.userTable.selection.map((item) => {
          roleIds.push(item.id)
        })
        console.log('roleIds', roleIds)
        addUser({ roleIds, ...this.form, ...this.form1 }).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '新建成功'
            })
            this.goback()
          }
        })
      })
    },

    goback() {
      this.$router.push({ path: '/accountManagement' })
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
    },
    currentChange(proCount) {
      this.params.proCount = proCount
    },
    nodeClickHandle(data) {
      this.form.orgId = data.areaName
      this.Id = data.id
      this.$refs.selectTree.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 0 16px;
  height: 62px;
}
::v-deep .el-card__body {
  padding-bottom: 0;
}

// 去掉顶部线条
::v-deep .userAddTree > .el-tree-node::after {
  border-top: none !important;
}
::v-deep .userAddTree > .el-tree-node::before {
  border-left: none;
}
.userAdd-content {
  .panel-header-box {
    margin: 0;
    padding: 0 20px;
    border: 1px solid #eaeaea;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    .back-svg {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
    .back-title {
      position: relative;
      top: 0px;
      left: 10px;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
    }
  }
  .box-card {
    margin: 20px 20px 0 20px;
    height: calc(100% - 86px);
    overflow-y: auto;

    .clearfix {
      height: 80px;
      line-height: 62px;
      span {
        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #004bad;
      }
      .pjqktj_svg {
        width: 1.5rem;
        height: 1.5rem;
        position: relative;
        top: 3px;
        left: -3px;
      }
    }
  }
  .box-card1 {
    margin: 0 -20px;

    .clearfix1 {
      height: 62px;
      line-height: 62px;
      padding-left: 20px;

      border-bottom: 1px solid #eaeaea;
      span {
        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #004bad;
      }
      .pjqktj_svg {
        width: 1.5rem;
        height: 1.5rem;
        position: relative;
        top: 3px;
        left: -3px;
      }
    }
    .text {
      margin-top: 20px;
    }
  }
  .box-card-last {
    margin: 0 -20px;
    .last-table {
      padding: 20px;
    }
    .clearfix {
      height: 62px;
      line-height: 62px;
      padding-left: 20px;

      border-bottom: 1px solid #eaeaea;
      span {
        font-size: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #004bad;
      }
      .pjqktj_svg {
        width: 1.5rem;
        height: 1.5rem;
        position: relative;
        top: 3px;
        left: -3px;
      }
    }
    .text {
      margin-top: 20px;
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
}
::v-deep .el-textarea__inner {
  width: 436px;
  height: 100px;
}
</style>
