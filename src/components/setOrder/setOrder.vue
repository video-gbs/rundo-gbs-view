<!--设置显示顺序,传入参数和方法-->
<template>
  <el-dialog title="编辑显示顺序" :visible.sync="visible" width="30%">
    <el-form v-if="orderForm" label-width="80px" :model="orderForm">
      <el-form-item label="标题">
        {{ orderForm.title }}
      </el-form-item>
      <el-form-item label="显示顺序">
        <el-input-number
          v-model="orderForm.orderValue"
          :min="0"
          :max="1000"
          label="描述文字"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelFn">取 消</el-button>
      <el-button type="primary" @click="submitFn">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: '',
  props: {
    config: {
      type: Object
    },
    fn: {
      type: Function
    }
  },
  data() {
    return {
      visible: false,
      orderForm: null
    }
  },
  watch: {
    config: {
      handler: function (n) {
        this.orderForm = n
      }
    }
  },
  mounted() {
    this.orderForm = this.config
  },
  methods: {
    cancelFn() {
      this.visible = !this.visible
    },
    refreshData() {
      // 更新数据，一般用于更新列表数据等
      this.$emit('refreshFn')
    },
    submitFn() {
      this.fn && this.fn(this.orderForm)
    }
  }
}
</script>
<style lang="scss" scoped></style>
