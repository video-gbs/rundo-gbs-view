<template>
  <div class="main">
    <div class="panel-header-box">
      <div>安防区域</div>
    </div>
    <div class="main-content">
      <div class="securityArea_container">
        <div class="btn-lists">
          <el-button type="primary" @click="dialogShow()"
            ><svg-icon class="svg-btn" icon-class="add" />新增</el-button
          >
          <el-button
            ><svg-icon class="svg-btn" icon-class="move" />移动</el-button
          >
          <el-button @click="deleteAccount(1)"
            ><svg-icon class="svg-btn" icon-class="del" />删除</el-button
          >
        </div>
        <leftTree />
      </div>
      <el-card class="right-box-card">
        <div slot="header" class="clearfix">
          <svg-icon icon-class="zzgl" class="tzgg_svg" />
          <span>分组信息</span>
        </div>

        <el-form
          ref="save"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="100px"
          class="area-form"
        >
          <el-form-item label="分组名称" prop="name">
            <div class="f fd-c mr30">
              <el-input v-model="form.name" placeholder="6~20字符" />
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.inputValue" type="textarea" />
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <el-button type="primary" @click="save('savePasswordForm')"
            ><svg-icon class="svg-btn" icon-class="save" />保 存</el-button
          >
        </div>
      </el-card>
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
          <el-form-item label="上级分组" prop="sjfz">
            <el-select v-model="dialog.params.sjfz" placeholder="请选择">
              <el-option
                v-for="i in types"
                :key="i.id"
                :label="i.label"
                :value="i.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="分组名称" prop="fzmc">
            <el-input v-model="dialog.params.fzmc" placeholder="最多40个字符" />
          </el-form-item>

          <el-form-item label="描述">
            <el-input v-model="dialog.description" type="textarea" />
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
  </div>
</template>

<script>
import leftTree from '../components/leftTree'

export default {
  name: '',
  components: { leftTree },
  data() {
    return {
      types: [
        { id: 1, label: '市领导' },
        { id: 2, label: '市级单位' },
        { id: 3, label: '县市区' },
        { id: 4, label: '其他' }
      ],
      dialog: {
        show: false,
        title: '新建分组',
        params: {}
      },
      editShow: false,
      form: {
        name: '',
        inputValue: ''
      },
      rules: {
        name: {
          required: true,
          message: '不能为空',
          trigger: 'blur',
          max: 20
        },
        sjfz: {
          required: true,
          message: '不能为空',
          trigger: 'change'
        },
        fzmc: {
          required: true,
          message: '不能为空',
          trigger: 'blur',
          max: 40
        }
      }
    }
  },
  mounted() {},
  methods: {
    handleClose(done) {
      done()
    },
    dialogShow() {
      this.editShow = true
      this.dialog.show = !this.dialog.show
    },
    save() {},
    deleteAccount(row) {
      this.$confirm('删除后数据无法恢复，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  .panel-header-box {
    margin: 0;
    padding: 0 20px;
    border: 1px solid #eaeaea;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
  }
  .main-content {
    height: calc(100% - 0px);
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
        .svg-btn {
          position: relative;
          top: 1px;
          left: -4px;
        }
      }
    }
    .right-box-card {
      width: 100%;
      margin: 20px 20px 20px 0;
      position: relative;
      .dialog-footer {
        width: 100%;
        height: 52px;
        line-height: 52px;
        position: absolute;
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
  }
}
.area-form {
  .el-input {
    width: 436px;
  }
}
::v-deep .el-textarea__inner {
  width: 436px;
  height: 300px;
}
</style>
