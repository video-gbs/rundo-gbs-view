<template>
  <div class="router_container4 m20 bg-w f fd-c ai-s">
    <div class="panel-header-box f jc-sb ai-c fw-w">
      <div class="title-css">单位账号管理</div>
      <div>
        <el-select
          v-model="search.deptId"
          class="mr10"
          size="small"
          clearable
          filterable
          placeholder="请选择单位"
          @clear="getOtherUnitList"
          @change="getOtherUnitList"
        >
          <el-option
            v-for="i in deptList"
            :key="i.id"
            :label="i.name"
            :value="i.id"
          />
        </el-select>
        <el-button size="mini" type="primary" @click="dialogShow(1)"
          >新增账号</el-button
        >
        <el-button size="mini" @click="$router.push('/unitManagement')"
          >返回</el-button
        >
      </div>
    </div>
    <div class="p10 f1 f fd-c" style="overflow-y: auto">
      <el-table
        :height="'auto'"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#EAEAEA' }"
        border
      >
        <el-table-column prop="account" label="账号" />
        <el-table-column prop="nickName" label="昵称" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="roleName" label="所属角色" />
        <el-table-column prop="status" label="帐号状态">
          <template slot-scope="scope">
            <span>{{
              scope.row.status === '1'
                ? '启用'
                : scope.row.status === '0'
                ? '禁用'
                : '-'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editPassword(scope.row)"
              >修改密码</el-button
            >
            <el-button type="text" @click="dialogShow(0, scope.row)"
              >编辑</el-button
            >
            <el-button type="text" @click="deleteAccount(scope.row)">
              <span>删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="f jc-e mt10">
        <el-pagination
          background
          :current-page="search.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="search.size"
          layout="sizes, prev, pager, next, jumper"
          :total="search.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      v-if="editShow"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="748px"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="accountForm"
          class="params-form"
          size="mini"
          label-position="left"
          label-width="80px"
          :model="dialog.params"
          :rules="rules"
          @keyup.enter="submit('accountForm')"
        >
          <el-form-item label="账号" prop="account">
            <el-input v-model="dialog.params.account" placeholder="6~20字符" />
          </el-form-item>
          <el-form-item
            v-if="editShowChild"
            label="密码"
            prop="password"
            :rules="editShowChild ? rules.password : [{ required: false }]"
          >
            <div class="f fd-c mr30">
              <el-input
                v-model="dialog.params.password"
                placeholder="6~20字符"
                @input="checkPassworLevel"
              />
              <span class="fs12 mt10"
                >请使用大写字母（A~Z）、小写字母（a~z）、数字（0~9）三种组合</span
              >
            </div>
          </el-form-item>
          <el-form-item
            v-if="editShowChild"
            style="position: absolute; right: 60px; top: 140px"
          >
            <div class="password-level-box f ai-c">
              <div class="password-level f ai-c">
                <div
                  :style="{
                    'background-color':
                      passwordLevel > 0 ? 'rgba(30, 86, 160, .4)' : ''
                  }"
                />
                <div
                  :style="{
                    'background-color':
                      passwordLevel > 1 ? 'rgba(30, 86, 160, .8)' : ''
                  }"
                />
                <div
                  :style="{
                    'background-color':
                      passwordLevel > 2 ? 'rgba(30, 86, 160, 1)' : ''
                  }"
                />
                <span
                  v-if="passwordLevel === 1"
                  class="fs12 ml5"
                  style="color: rgba(30, 86, 160, 0.4)"
                >
                  弱
                </span>
                <span
                  v-if="passwordLevel === 2"
                  class="fs12 ml5"
                  style="color: rgba(30, 86, 160, 0.8)"
                >
                  中
                </span>
                <span
                  v-if="passwordLevel === 3"
                  class="fs12 ml5"
                  style="color: rgba(30, 86, 160, 1)"
                >
                  强
                </span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            v-if="editShowChild"
            label="确认密码"
            prop="rePassword"
            :rules="editShowChild ? rules.rePassword : [{ required: false }]"
          >
            <el-input v-model="dialog.params.rePassword" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input
              v-model="dialog.params.nickName"
              placeholder="最多40个字符"
            />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dialog.params.name" placeholder="最多20个字符" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dialog.params.mobile" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dialog.params.email" />
          </el-form-item>
          <!-- <el-form-item label="所属角色" prop="roleId">
            <el-select v-model="dialog.params.roleId" placeholder="请选择">
              <el-option
                v-for="i in selectList"
                :key="i.id"
                :label="i.label"
                :value="i.id"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="所属部门" prop="deptId">
            <el-select v-model="dialog.params.deptId" placeholder="请选择">
              <el-option
                v-for="i in deptList.filter((i) => {
                  return i.id !== ''
                })"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="账号状态">
            <el-radio v-model="dialog.params.status" :label="1">启用</el-radio>
            <el-radio v-model="dialog.params.status" :label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit('accountForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="passwordVisible" width="748px">
      <el-form
        ref="savePasswordForm"
        :model="passwordForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="password">
          <div class="f fd-c mr30">
            <el-input
              v-model="passwordForm.password"
              placeholder="6~20字符"
              class="new_password_input"
              @input="checkPassworLevel1"
            />
            <span class="fs12 mt10"
              >请使用大写字母（A~Z）、小写字母（a~z）、数字（0~9）三种组合</span
            >
          </div>
        </el-form-item>
        <el-form-item style="position: absolute; right: 35px; top: 105px">
          <div class="password-level-box f ai-c">
            <div class="password-level f ai-c">
              <div
                :style="{
                  'background-color':
                    passwordLevel1 > 0 ? 'rgba(30, 86, 160, 0.4)' : ''
                }"
              />
              <div
                :style="{
                  'background-color':
                    passwordLevel1 > 1 ? 'rgba(30, 86, 160, 0.8)' : ''
                }"
              />
              <div
                :style="{
                  'background-color':
                    passwordLevel1 > 2 ? 'rgba(30, 86, 160, 1)' : ''
                }"
              />

              <span
                v-if="passwordLevel1 === 1"
                class="fs12 ml5"
                style="color: rgba(30, 86, 160, 0.4)"
              >
                弱
              </span>
              <span
                v-if="passwordLevel1 === 2"
                class="fs12 ml5"
                style="color: rgba(30, 86, 160, 0.8)"
              >
                中
              </span>
              <span
                v-if="passwordLevel1 === 3"
                class="fs12 ml5"
                style="color: rgba(30, 86, 160, 1)"
              >
                强
              </span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input
            v-model="passwordForm.rePassword"
            class="new_password_input"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePassword('savePasswordForm')"
          >保 存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  otherUnitAdd,
  otherUnitEdit,
  otherUnitListByDept,
  otherUnitDelete,
  otherUnitEditPassword
} from '@/api/method/otherUnitManagement'
// import { unitList } from '@/api/method/unitManagement'
// import { getRolesList } from "@/api/method/role";

import { Local } from '@/utils/storage'

export default {
  name: 'OtherUnitManagement',

  data() {
    return {
      search: {
        current: 1,
        size: 10,
        deptId: '',
        total: 0
      },
      passwordForm: {
        password: '',
        rePassword: '',
        id: ''
      },
      selectList: [],
      passwordVisible: false,
      rules: {
        account: [
          { required: true, message: '不能为空', trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: '长度为6-20个字符',
            trigger: 'change'
          }
        ],
        name: {
          required: true,
          message: '不能为空,长度不能超过20个字符',
          trigger: 'change',
          max: 20
        },
        mobile: {
          pattern: /^(1[3-9]\d{9})$/,
          message: '请输入正确的手机号码',
          trigger: 'change',
          required: false
        },
        password: [
          {
            required: true,
            message: '不能为空,长度为6-20个字符',
            trigger: 'change',
            min: 6,
            max: 20
          },
          {
            validator: (rule, value, callback) => {
              if (this.handlePasswordLevel(value)) {
                callback()
              } else {
                callback('密码强度不够，至少包含数字/字母/字符两种组合')
              }
            },
            trigger: 'change'
          }
        ],
        rePassword: {
          required: true,
          message: '不能为空,长度为6-20个字符',
          trigger: 'change',
          min: 6,
          max: 20
        },
        nickName: {
          required: true,
          message: '不能为空',
          trigger: 'change',
          max: 40
        },
        email: {
          pattern:
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9_\.\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
          required: true,
          message: '请输入正确的邮箱',
          trigger: 'change'
        },
        deptId: {
          required: true,
          message: '不能为空',
          trigger: 'change'
        }
        // roleId: {
        //   required: true,
        //   message: '不能为空',
        //   trigger: 'change'
        // }
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        proCount: 0
      },
      tableData: [],
      editShow: true,
      editShowChild: true,
      editId: '',
      dialog: {
        show: false,
        title: '新增用户',
        params: {
          account: '',
          status: 1,
          password: '',
          rePassword: '',
          nickName: '',
          name: '',
          email: '',
          deptId: ''
        }
      },
      deptList: [{ id: '', name: '全部' }],
      state: [
        { id: 1, label: '启用' },
        { id: 0, label: '禁用' }
      ],
      passwordLevel: 0,
      passwordLevel1: 0,
      headers: {
        Authorization: Local.getToken()
      }
    }
  },
  mounted() {
    this.search.deptId = this.$route.params?.pid || ''
    this.dialog.params.deptId = this.$route.params?.pid || ''
    // this.checkPassworLevel()
    this.getOtherUnitList()
    // this.getList()
    this.getDeptList()
  },
  methods: {
    /**
     * 编辑超管密码
     */
    editPassword(row) {
      this.passwordVisible = true
      this.passwordForm.id = row.id
    },
    // getList() {
    //   otherUnitDeptRoleList().then((res) => {
    //     if (res.data.code === 10000) {
    //       res.data.map((item) => {
    //         const obj = {
    //           id: '',
    //           label: ''
    //         }
    //         obj.id = item.roleId
    //         obj.label = item.roleName
    //         this.selectList.push(obj)
    //       })
    //     }
    //   })
    // },

    savePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            !this.handlePasswordCheck(
              this.passwordForm.password,
              this.passwordForm.rePassword
            )
          ) {
            return
          }
          otherUnitEditPassword({
            id: this.passwordForm.id,
            password: this.passwordForm.password
          }).then((res) => {
            if (res.data.code === 10000) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.passwordVisible = false
              this.getOtherUnitList()
            }
          })
        }
      })
    },
    /**
     * 校验密码强度
     * @param {password} 密码
     */
    handlePasswordLevel(password) {
      let level = 0
      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(password)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(password)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(password)) {
        level++
      }
      if (level >= 2) {
        return true
      } else {
        this.$message.error('密码强度不够，至少包含数字/字母/字符两种组合')
        return false
      }
    },
    /**
     * 校验密码
     * @param {password} 新密码
     * @param {rePassword} 确认密码
     */
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
    handleSizeChange(v) {
      this.search.size = v
      this.getOtherUnitList()
    },
    handleCurrentChange(v) {
      this.search.current = v
      this.getOtherUnitList()
    },
    goPage(path, query) {
      this.$router.push(path)
    },
    dialogShow(act, data) {
      this.dialog.params = {
        account: '',
        status: 1,
        password: '',
        rePassword: '',
        nickName: '',
        name: '',
        email: '',
        deptId: ''
      }
      this.editShow = true
      if (act === 0) {
        // this.editShow = false;
        this.editShowChild = false
        const { account, email, mobile, name, nickName, status, deptId } = data
        this.dialog.params.account = account
        this.dialog.params.email = email
        this.dialog.params.mobile = mobile
        this.dialog.params.name = name
        this.dialog.params.nickName = nickName
        this.dialog.params.status = Number(status)
        this.dialog.params.deptId = deptId || ''
        this.editId = data.id
      } else {
        this.editShowChild = true
      }
      this.dialog.title = act ? '添加账号' : '编辑用户'
      this.dialog.show = !this.dialog.show
    },

    deleteAccount(row) {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        otherUnitDelete(row.id).then((res) => {
          if (res.data.code === 10000) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.params.pageNum = 1
            this.getOtherUnitList()
          }
        })
      })
    },
    getDeptList() {
      // 获取部门
      // unitList({ current: 1, size: 399 }).then((res) => {
      //   if (res.data.code === 10000) {
      //     this.deptList = [...this.deptList, ...res.data?.records]
      //   }
      // })
    },
    searchFn() {
      // 通过部门搜索
    },
    getOtherUnitList() {
      otherUnitListByDept(this.search).then((res) => {
        if (res.data.code === 10000) {
          this.tableData = res.data.rows
          this.search.total = res.data.total
          this.search.pages = res.data.size
          this.search.current = res.data.current
        }
      })
    },

    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.dialog.title) {
            case '添加账号':
              if (
                !this.handlePasswordCheck(
                  this.dialog.params.password,
                  this.dialog.params.rePassword
                )
              ) {
                return
              }
              otherUnitAdd(this.dialog.params).then((res) => {
                if (res.data.code === 10000) {
                  this.$message({
                    type: 'success',
                    message: '其他单位账号新增成功'
                  })
                  this.dialog.show = false
                  this.getOtherUnitList()
                }
              })
              break
            case '编辑用户':
              otherUnitEdit({ id: this.editId, ...this.dialog.params }).then(
                (res) => {
                  if (res.data.code === 10000) {
                    this.$message({
                      type: 'success',
                      message: '账号修改成功'
                    })
                    this.dialog.show = false
                    this.getOtherUnitList()
                  }
                }
              )
              break

            default:
              break
          }
        }
      })
    },
    handleClose(done) {
      done()
    },
    checkPassworLevel() {
      const reg = /[A-Z]/
      const reg2 = /[a-z]/
      const reg3 = /[0-9]/
      this.passwordLevel = 0
      reg.test(this.dialog.params.password) && (this.passwordLevel += 1)
      reg2.test(this.dialog.params.password) && (this.passwordLevel += 1)
      reg3.test(this.dialog.params.password) && (this.passwordLevel += 1)

      const l = this.dialog.params.password.length
      if (l < 5 || l > 20) {
        this.passwordLevel = 0
      }
    },
    checkPassworLevel1() {
      const reg = /[A-Z]/
      const reg2 = /[a-z]/
      const reg3 = /[0-9]/
      this.passwordLevel1 = 0
      reg.test(this.passwordForm.password) && (this.passwordLevel1 += 1)
      reg2.test(this.passwordForm.password) && (this.passwordLevel1 += 1)
      reg3.test(this.passwordForm.password) && (this.passwordLevel1 += 1)

      const l = this.passwordForm.password.length
      if (l < 5 || l > 20) {
        this.passwordLevel1 = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid #eaeaea;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #eaeaea;
}
::v-deep .el-dialog__body {
  padding: 30px 108px;
}
.el-input {
  width: 120px;
}
.new_password_input {
  width: 380px;
}

.params-form {
  .el-input,
  .el-select {
    width: 345px;
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

::v-deep .el-form-item__content {
  // height: 28px;
  display: flex;
  align-items: center;
}
.delete-button {
  color: red !important;
}
.mr30 {
  width: calc(100% - 30px);
}
</style>
