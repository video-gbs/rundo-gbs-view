<template>
  <div class="addequipment-content">
    <div class="panel-header-box">
      <div class="panel-header-box-border">
        <svg-icon icon-class="back-svg" class="back_svg" @click="goback" /><span
          class="back-title"
          >编辑用户</span
        >
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
              <el-form-item prop="username" label="用户账号">
                <el-input
                  v-model="form.username"
                  style="width: 436px"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="password" label="密码">
                <el-input
                  v-model="form.password"
                  style="width: 436px"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="workName" label="姓名">
                <el-input
                  v-model="form.workName"
                  style="width: 436px"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="rePassword" label="确认密码">
                <el-input
                  v-model="form.rePassword"
                  style="width: 436px"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="expiryStartTime" label="有效日期（开始）">
                <el-date-picker
                  v-model="form.expiryStartTime"
                  type="datetime"
                  placeholder="开始日期"
                  style="width: 436px"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="sectionId" label="所属部门">
                <el-select
                  ref="selectTree"
                  v-model="form.sectionId"
                  placeholder="请选择"
                  :popper-append-to-body="false"
                  style="width: 436px"
                  class="selectTree"
                >
                  <el-option :value="form.sectionId">
                    <el-tree
                      ref="userEditTree"
                      class="userEdit-tree"
                      :data="treeList"
                      node-key="id"
                      :props="defaultProps"
                      :default-expanded-keys="Ids"
                      highlight-current
                      :expand-on-click-node="false"
                      @node-click="nodeClickHandle"
                    >
                    </el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="expiryEndTime" label="有效日期（结束）">
                <el-date-picker
                  v-model="form.expiryEndTime"
                  type="datetime"
                  @change="changeExpiryDateEnd"
                  clearable
                  placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 436px"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="box-card1">
        <div class="clearfix1">
          <svg-icon icon-class="xxxx" class="pjqktj_svg" />
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
                <el-form-item
                  prop="workNum"
                  label="用户工号"
                  style="margin-left: 35px"
                >
                  <el-input
                    v-model="form1.workNum"
                    style="width: 436px"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="phone"
                  label="手机号码"
                  style="margin-left: 10px"
                >
                  <el-input
                    v-model="form1.phone"
                    style="width: 436px"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  prop="address"
                  label="地址"
                  style="margin-left: 35px"
                >
                  <el-input
                    v-model="form1.address"
                    style="width: 436px"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  prop="description"
                  label="描述"
                  style="margin-left: 10px"
                >
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
          <svg-icon icon-class="yhxx" class="pjqktj_svg" />
          <span>角色</span>
          <el-input
            placeholder="请输入角色名称"
            class="search-input"
            clearable
            v-model="roleName"
            style="width: 240px; float: right; margin: 20px 20px 0 0"
            ><el-button
              icon="el-icon-search"
              slot="append"
              @click="search()"
            ></el-button
          ></el-input>
        </div>
        <div class="last-table">
          <el-table
            ref="userTable"
            class="table-content-bottom"
            :data="tableData"
            row-key="id"
            @selection-change="handleSelectChange"
            @select="handleSelect"
            border
            :header-cell-style="{
              background: 'rgba(0, 75, 173, 0.06)',
              fontSize: '14px',
              fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
              fontWeight: 'bold',
              color: '#333333'
            }"
          >
            <el-table-column type="selection" width="80" align="center">
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            >
            </el-table-column>
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
              prop="createBy"
              label="创建人"
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
          <el-button @click="goback()"
            ><svg-icon class="svg-btn" icon-class="back-svg" />返回</el-button
          >
          <el-button type="primary" @click="save()"
            ><svg-icon class="svg-btn" icon-class="save" />保存</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'
import { getUnitList } from '@/api/method/unitManagement'

import { userUpdate } from '@/api/method/user'
import { userSearchRole } from '@/api/method/role'

import moment from 'moment'
import { Local } from '@/utils/storage'
export default {
  name: '',
  components: { pagination },
  props: ['userEditRow'],
  data() {
    const checkPhone = (rule, value, cb) => {
      const regPhone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/

      if (value === '' || value === null || value.length === 0) {
        return cb()
      }
      setTimeout(() => {
        if (regPhone.test(value)) {
          return cb()
        } else {
          return cb(new Error(`1～11个数字。`))
        }
      }, 500)
    }
    const checkUserAccount = (rule, value, cb) => {
      const regUserAccount = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/
      if (value.length === 0) {
        return cb(new Error('此为必填项。'))
      }
      setTimeout(() => {
        if (regUserAccount.test(value)) {
          return cb()
        } else {
          return cb(
            new Error(
              `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `
            )
          )
        }
      }, 500)
    }
    const checkUserAccount1 = (rule, value, cb) => {
      const regUserAccount1 = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/
      if (value.length === 0) {
        return cb()
      }
      setTimeout(() => {
        if (regUserAccount1.test(value)) {
          return cb()
        } else {
          return cb(
            new Error(
              `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `
            )
          )
        }
      }, 500)
    }
    const checkPassword = (rule, value, cb) => {
      if (value === '' || value === null || value.length === 0) {
        return cb()
      }
      setTimeout(() => {
        const regPassword =
          /^(?!^\d+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^a-z0-9]+$)(?!^[^A-Z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S*$/
        if (regPassword.test(value)) {
          return cb()
        } else {
          return cb(
            new Error(
              '8~20个字符;至少由大写字母、小写字母、数字、特殊字符任意两种组成。'
            )
          )
        }
      }, 500)
    }

    return {
      tableData: [],
      roleName: '',
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      treeList: [],
      selectedObj: {},
      selectedData: [],

      List: '',
      Ids: [],
      Id: '',
      defaultProps: {
        children: 'childList',
        label: 'sectionName'
      },
      // isCheckedId: '',
      isChecked: false,
      form: {
        username: '',
        password: null,
        rePassword: null,
        expiryEndTime: '',
        sectionId: '',
        expiryStartTime: '',
        workName: ''
      },
      resName: '',
      form1: {
        address: '',
        description: '',
        phone: null,
        workNum: ''
      },

      roleIds: [],
      userId: '',
      rules: {
        username: {
          max: 32,
          validator: checkUserAccount1,
          // message: `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `,
          // pattern: /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/,
          trigger: 'blur'
        },
        workName: {
          required: true,
          max: 32,
          validator: checkUserAccount1,
          // message: `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `,
          // pattern: /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/,
          trigger: 'blur'
        },
        password: {
          // required: true,
          max: 20,
          min: 8,
          validator: checkPassword,
          // message:
          //   '8~20个字符;至少由大写字母、小写字母、数字、特殊字符任意两种组成。',
          // pattern: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,20}/,
          trigger: 'blur'
        },
        rePassword: {
          // required: true,
          max: 20,
          min: 8,
          validator: checkPassword,
          // message:
          //   '8~20个字符;至少由大写字母、小写字母、数字、特殊字符任意两种组成。',
          // pattern: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,20}/,
          trigger: 'blur'
        },

        sectionId: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'change'
          }
        ],
        expiryStartTime: [
          {
            required: true,
            message: '此为必填项。',
            trigger: 'change'
          }
        ],
        workNum: {
          max: 32,
          // message: `1-32个字符，不能有空格,不能包含 \ / : * ? " < | ' & % > ; 特殊字符。 `,
          // pattern: /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/,
          validator: checkUserAccount1,
          trigger: 'blur'
        },
        address: {
          message: '支持最大长度128个字符。',
          trigger: 'blur',
          max: 128
        },
        phone: [
          {
            max: 11,
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        description: {
          message: '支持最大长度128个字符。',
          trigger: 'blur',
          max: 128
        }
      }
    }
  },
  created() {
    console.log('this.$props.userEditRow', this.$props.userEditRow)
    const {
      address,
      description,
      expiryEndTime,
      expiryStartTime,
      workNum,
      id,
      phone,
      workName,
      username,
      sectionId
    } = this.$props.userEditRow
    this.form1.address = address
    this.form1.description = description
    this.form.expiryEndTime = expiryEndTime
    this.form.expiryStartTime = expiryStartTime
    this.form1.workNum = workNum
    this.userId = id
    this.form.password = null
    this.form1.phone = phone
    this.form.rePassword = null
    this.form.sectionId = sectionId
    this.form.roleIds = []

    this.selectedData = []

    this.form.workName = workName
    this.form.username = username
    this.Id = sectionId
  },
  mounted() {
    this.init()
    this.getLists()
  },
  methods: {
    async getLists() {
      await userSearchRole({
        page: this.params.pageNum,
        num: this.params.pageSize,
        userId: this.$props.userEditRow.id,
        roleName: this.roleName
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.list
            this.handleRowSelection(this.tableData)
            this.params.total = res.data.data.total
            this.params.pages = res.data.data.pages
            this.params.current = res.data.data.current
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async init() {
      await getUnitList()
        .then((res) => {
          if (res.data.code === 0) {
            this.treeList = [res.data.data]
            this.getTreeName(this.treeList, this.form.sectionId)
            console.log(
              'this.form.sectionId',
              this.form.sectionId,
              this.resName
            )
            this.form.sectionId = this.resName
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // 回显树名字
    getTreeName(arr, id) {
      arr.map((item) => {
        if (item.id === id) {
          this.resName = item.sectionName
          this.Id = id
          return
        } else {
          if (item.childList && item.childList.length > 0) {
            this.getTreeName(item.childList, id)
          }
        }
      })
    },
    changeExpiryDateEnd(val) {
      if (val === null) {
        this.form.expiryEndTime = ''
      } else {
        this.form.expiryEndTime = val
      }
    },
    search() {
      this.getLists()
    },
    handleSelectChange(selection) {
      // 全选取消，删除当前页所有数据
      if (selection.length === 0) {
        this.tableData.forEach((item) => {
          delete this.selectedObj[item.id]
        })
      }
      // 勾选数据 添加
      selection.forEach((item) => {
        this.selectedObj[item.id] = item
      })
      // 获取所有分页勾选的数据
      this.selectedData = []
      for (const key in this.selectedObj) {
        this.selectedData.push(this.selectedObj[key])
      }
    },

    handleSelect(selection, row) {
      if (selection.length === 0) {
        // this.isCheckedId = row.id

        this.isChecked = true
      } else {
        this.isChecked = false
      }

      // 取消单个勾选时，删除对应属性
      if (!selection.some((item) => item.id === row.id)) {
        delete this.selectedObj[row.id]
      }
    },

    // 处理当前列表选中状态
    handleRowSelection(data) {
      data.forEach((item) => {
        if (
          this.selectedObj[item.id] ||
          item.userId === this.$props.userEditRow.id
        ) {
          this.$nextTick(() => {
            this.$refs.userTable.toggleRowSelection(item)
          })
        }
      })
    },

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
        // if (
        //   !this.handlePasswordCheck(this.form.password, this.form.rePassword)
        // ) {
        //   return
        // }
        this.form.sectionId = this.Id
        const roleIds = []
        this.selectedData.map((item) => {
          roleIds.push(item.id)
        })
        userUpdate({
          userId: this.userId,
          ...this.form,
          ...this.form1,
          roleIds
        }).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.isChecked = false
            this.goback()
          }
        })
      })
    },

    goback() {
      this.$emit('init')
      this.$emit('changeIsShow', false, 'edit')
    },
    sizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getLists()
    },
    currentChange(proCount) {
      this.params.proCount = proCount
      this.getLists()
    },
    nodeClickHandle(data) {
      this.form.sectionId = data.sectionName
      this.Id = data.id
      this.$refs.selectTree.blur()
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
// 滚动条大小设置
::v-deep .box-card::-webkit-scrollbar {
  /*纵向滚动条*/
  width: 5px;
  /*横向滚动条*/
  height: 5px;
}

// 滚动条滑块样式设置
::v-deep .box-card::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}

// 滚动条背景样式设置
::v-deep .box-card::-webkit-scrollbar-track {
  background: none;
}

// 表格横向和纵向滚动条对顶角样式设置
::v-deep .box-card::-webkit-scrollbar-corner {
  background-color: #111;
}
// 去除滚动条上方多余显示
::v-deep .el-table__header .has-gutter th.gutter {
  display: none !important;
}
// 去掉顶部线条
::v-deep .userEdit-tree > .el-tree-node::after {
  border-top: none !important;
}
::v-deep .userEdit-tree > .el-tree-node::before {
  border-left: none;
}
::v-deep .el-card__header {
  padding: 0 16px;
  height: 62px;
}
::v-deep .el-card__body {
  padding-bottom: 0;
}
.selectTree {
  .el-select-dropdown__item {
    height: 200px !important;
    min-width: 260px;
    overflow-y: scroll !important;
    background: #fff !important;
  }
}
.addequipment-content {
  .panel-header-box {
    margin: 0;
    padding: 0 16px;
    border-top: 1px solid #eaeaea;
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
    .panel-header-box-border {
      border-top: 1px solid #eaeaea;
    }
  }
  .box-card {
    margin: 20px 20px 0 20px;
    height: calc(100% - 110px);
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
