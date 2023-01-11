<template>
  <el-input
    v-model="inputVal"
    :disabled="disabled"
    :maxlength="maxlength"
    :placeholder="placeholder"
    @input="handleNumber($event)"
    @change="handlePropChange($event)"
  >
    <template v-if="suffix" slot="append">{{ suffix }}</template>
  </el-input>
</template>

<script>
export default {
  name: 'PInputNumber',
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    suffix: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: 16
    }
  },
  data() {
    return {
      inputVal: null,
      changeForm: true
    }
  },
  watch: {
    value: {
      handler(n, o) {
        console.log('value', n)
        if (this.changeForm) {
          this.inputVal = n
        }
      },
      deep: true
    }
  },
  mounted() {
    this.inputVal = this.value
  },
  methods: {
    /**
     * 强制数字类型
     * @param {String} val 输入值
     */
    handleNumber(val) {
      if (val !== '' && val.substr(0, 1) === '.') {
        val = ''
      }
      val = val.replace(/^0*(0\.|[1-9])/, '$1') // 解决 粘贴不生效
      val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      val = val.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3') // 只能输入4个小数
      // val = val.replace(/^(\d+)\.(\d\d).*$/, '$1.$2')// 只能输入4个小数
      // val = val.replace(/^(\d\d\d\d\d\d\d\d\d\d\d\d)\.(\d\d\d\d).*$/, '$1.$2')// 只能输入4个小数
      // val = val.replace(/^(\d{1,5})?\.(\d{1,4}).*$/, '$1.$2')// 只能输入4个小数
      // val = val.replace(/^[0-9]+(.[0-9]{1,3})?$/, '')// 只能输入4个小数
      if (val.indexOf('.') < 0 && val !== '') {
        if (val.substr(0, 1) === '0' && val.length === 2) {
          val = val.substr(1, val.length)
        }
      }
      this.changeForm = false
      this.inputVal = val // parseFloat(val)
    },
    /**
     * 触发回调
     * @param {Object} e 值
     */
    handlePropChange(e) {
      this.changeForm = false
      this.$emit('input', this.inputVal)
      this.$emit('change', this.inputVal)
      this.$nextTick(() => {
        this.changeForm = true
      })
    }
  }
}
</script>
