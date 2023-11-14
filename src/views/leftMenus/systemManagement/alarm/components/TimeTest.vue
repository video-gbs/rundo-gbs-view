<template>
  <div class="timeTemplate-main">
    <el-dialog
      v-if="dialog.show"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="950px"
      top="100px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div style="display: flex; justify-content: space-between">
          <div style="font-weight: bold">
            {{ isEdit ? '编辑时间模板' : '新建时间模板' }}
          </div>
        </div>
      </div>
      <el-form
        ref="accountForm"
        label-width="140px"
        :rules="rules"
        :model="dialog.params"
      >
        <el-form-item
          label="模板名称"
          prop="templateName"
          class="time-template"
        >
          <el-input
            class="item-input"
            v-model="dialog.params.templateName"
            clearable
            style="width: 340px"
          ></el-input>
        </el-form-item>

        <el-form-item label="配置预案开启时段" class="time-template1">
        </el-form-item>

        <div class="time-container">
          <div
            v-for="(item, index) in timeLists"
            :key="item"
            class="times-box"
            :id="`timeSlider${index + 1}`"
          >
            <label class="label-week">{{ item }}</label>
          </div>
        </div>
      </el-form>
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
export default {
  name: '',
  components: {},
  data() {
    const checkName = (rule, value, cb) => {
      const regName = /^((?!\\|\/|:|\*|\?|<|>|\||"|'|;|&|%|\s).){1,32}$/
      if (value.length === 0) {
        return cb(new Error('此为必填项。'))
      }
      setTimeout(() => {
        if (regName.test(value)) {
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
    return {
      isEdit: false,
      formData: {
        templateName: null
      },
      dialog: {
        show: true,
        title: '新建',
        params: {
          templateName: '',
          timePeriodList: []
        }
      },
      timeLists: [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日'
      ],
      rules: {
        templateName: {
          required: true,
          max: 32,
          validator: checkName,
          trigger: 'blur'
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    dialogShow(act, data) {
      this.dialog.params = {
        templateName: null,
        timePeriodList: []
      }
      // if (act === 0) {
      //   this.isEdit = true
      //   this.editId = data.id
      //   this.dialog.params = Object.assign({}, data, {
      //     templateName: data.templateName,
      //     timePeriodList: data.timePeriodDtoList
      //   })
      // }
      this.dialog.title = act ? '新建' : '编辑'
      this.dialog.show = !this.dialog.show
    },
    handleClose(done) {
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .time-template {
  margin-left: -60px;
}
::v-deep .time-template1 {
  margin-left: -5px;
}
.timeTemplate-main {
  .time-container {
    background: #fff;
    .times-box {
      width: 920px;
      height: 90px;
      line-height: 90px;
      background: rgba(0, 0, 0, 0.02);
      margin-bottom: 4px;
      .label-week {
        margin-left: 16px;
      }
    }
  }
}
</style>
