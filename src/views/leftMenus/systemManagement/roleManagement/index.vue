<template>
  <div class="router_container4 m20 bg-w">

    <div class="panel-header-box f jc-sb ai-c fw-w">
      <div class="title-css">角色管理</div>
    </div>
    <div class="p10">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column>
          <template slot="header">

            <div class="f ai-c jc-sb">
              <div>数据列表</div>
              <el-button size="mini" type="primary" @click="dialogShow(1)">新增</el-button>
            </div>
          </template>
          <el-table-column prop="label" label="角色名称" />
          <el-table-column prop="sort" label="角色说明" />
          <el-table-column width="200" label="操作" fixed="right"> <template slot-scope="scope">
            <el-button type="text" @click="dialogShow(0, scope.row)">权限设置 </el-button>
            <el-button type="text" @click="dialogShow(0, scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteFn(scope.row,remove,getList)">删除</el-button>

          </template>
          </el-table-column>
        </el-table-column>

      </el-table>
      <pagination :pages-data="params" @size-change="sizeChange" @current-change="currentChange" />
    </div>
    <el-dialog :title="dialog.title" :visible.sync="dialog.show" width="400px" :before-close="handleClose">
      <div>
        <el-form ref="roleForm" class="params-form" size="mini" :rules="rules" label-position="left" label-width="80px" :model="dialog.params">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="dialog.params.name" clearable :maxlength="15" />
          </el-form-item>
          <el-form-item label="角色说明">
            <el-input
              v-model="dialog.params.detail"
              type="textarea"
              :rows="2"
              :maxlength="50"
            />
          </el-form-item>
          <el-form-item label="角色状态">

            <el-row>
              <el-col>
                <el-radio v-model="dialog.params.status" :label="1">启用</el-radio>
                <el-radio v-model="dialog.params.status" :label="0">禁用</el-radio>
              </el-col>
            </el-row>

          </el-form-item>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="addFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import _mixins from '@/mixins/index'
import { addRoles, editRoles, deleteRoles, setDataAuth, setAppAuth } from '@/api/method/role'
import pagination from '@/components/Pagination/index.vue'
export default {
  name: '',
  components: { pagination },
  mixins: [_mixins],
  data() {
    return {
      search: {
        userName: '',
        phone: '',
        time: ''
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [
        { id: 1, label: 'afsdf', sort: 1, state: 1, createTime: '2022-11-11 15:25:14' }
      ],
      dialog: {
        show: false,
        title: '新增角色',
        params: {
          detail: '',
          name: '',
          status: 1
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 0, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      remove: deleteRoles

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    sizeChange(v) {
      console.log('v')
      // 执行搜索
    },
    currentChange(v) {
      console.log('v2')
      // 执行搜索
    },
    goPage(path, query) {
      this.$router.push(path)
    },
    dialogShow(act, data) {
      this.dialog.title = act ? '新增用户' : `编辑用户 - ${data.name}`
      this.dialog.show = !this.dialog.show
    },
    handleClose(done) {
      done()
    },
    getList() {
      // getRolesList(this.params)
    },
    addFn() {
      this.$refs['roleForm'].validate(v => {
        if (v) {
          addRoles(this.dialog.params).then(res => {
            if (res.code === 10000) {
              this.$message.success('添加成功')
              this.dialog.show = !this.dialog.show
              this.getList()
            }
          })
          return
        }
      })
    },
    editFn() {
      editRoles(this.dialog.params).then(res => {
        if (res.code === 10000) {
          this.$message.success('编辑成功')
          this.dialog.show = !this.dialog.show
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 100%;
}

.params-form{
  .el-input,.el-select{
    width: 100%;
    margin-right: 30px;
  }
}
.password-level-box{
  height: 28px !important;
   width: 100px;
  .password-level {
  height: 10px;
  width: 100px;

  >div {
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

::v-deep .el-form-item__content{
  // height: 28px;
  display: flex;
  align-items: center;
}
</style>
