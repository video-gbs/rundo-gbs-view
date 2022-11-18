<template>
  <el-form
    v-if="!reload"
    ref="form"
    :model="form"
    :rules="rules"
    class="p-form format-form"
    :style="{ width: width }"
  >
    <el-form-item
      v-if="title"
      :label-width="labelWidth"
      class="title"
      :label="title"
    />
    <template v-for="(key, index) in Object.keys(props)">
      <el-form-item
        v-if="!props[key].hidden"
        :key="index"
        :label="props[key].label"
        :prop="key"
        :label-width="labelWidth"
      >
        <el-select
          v-if="props[key].type == 'select'"
          :ref="`form-${key}`"
          v-model="form[key]"
          style="width: 100%"
          :disabled="props[key].disabled"
          :multiple="props[key].multiple"
          :loading="props[key].loading"
          :placeholder="`请选择${props[key].label}`"
          @change="handlePropChange(key, $event)"
        >
          <template v-if="props[key].option">
            <el-option
              v-for="(op, index3) in props[key].options"
              :key="index3"
              :label="op[props[key].option[1]]"
              :value="op[props[key].option[0]]"
            />
          </template>
          <template v-else-if="props[key].dict">
            <el-option
              v-for="(op, index3) in props[key].options"
              :key="index3"
              :label="op.value"
              :value="op.key"
            />
          </template>
        </el-select>
        <el-radio-group
          v-else-if="props[key].type === 'radio'"
          :ref="`form-${key}`"
          v-model="form[key]"
          :disabled="props[key].disabled"
          @change="handlePropChange(key, $event)"
        >

          <template v-if="props[key].option">
            <el-radio
              v-for="(op, index3) in props[key].options"
              :key="index3"
              :label="op[props[key].option[0]]"
            >
              {{ op[props[key].option[1]] }}</el-radio>
          </template>
          <template v-else-if="props[key].dict">
            <el-radio
              v-for="(op, index3) in props[key].options"
              :key="index3"
              :label="op.key"
            >{{ op.value }}</el-radio>
          </template>
        </el-radio-group>
        <el-date-picker
          v-else-if="props[key].type == 'date'"
          v-model="form[key]"
          :type="props[key].dateType"
          :disabled="props[key].disabled"
          style="width: 100%"
          :value-format="props[key].format"
          :placeholder="`请选择${props[key].label}`"
          @change="handlePropChange(key, $event)"
        />
        <el-upload
          v-else-if="props[key].type == 'img'"
          class="format-form-upload"
          :action="key"
          :disabled="props[key].disabled"
          list-type="picture-card"
          :auto-upload="true"
          :on-remove="handleImageRemove"
          :http-request="uploadFile"
          :file-list="fileList[key]"
          :limit="props[key].limit ? props[key].limit : 999"
          :accept="props[key].accept ? props[key].accept : accepts.toString()"
        >
          <i slot="default" class="el-icon-plus" />
          <div class="upload-explain">
            说明：<br>
            ①支持上传图片格式：{{ props[key].accept ? props[key].accept : accepts.map(a => `*${a}`).toString() }}；<br>
            <!-- ①支持上传图片格式："*.jpg"、"*.jpeg"、"*.png"；<br> -->
            ②单张图片大小不超过500M。
          </div>
        </el-upload>
        <el-color-picker
          v-else-if="props[key].type == 'color'"
          v-model="form[key]"
          :disabled="props[key].disabled"
          :show-alpha="props[key].showAlpha"
          :color-format="props[key].colorFormat"
          :popper-class="props[key].popperClass"
          :predefine="props[key].predefine"
          @change="handlePropChange(key, $event)"
        />
        <PInputMap
          v-else-if="props[key].type == 'PInputMap'"
          v-model="form[key]"
          :polygon-options="props[key].polygonOptions"
          :input-map-type="props[key].mapType"
        />
        <PInputRegion
          v-else-if="props[key].type == 'region'"
          v-model="form[key]"
        />
        <el-input
          v-else-if="props[key].type == 'textarea'"
          v-model="form[key]"
          type="textarea"
          :disabled="props[key].disabled"
          :rows="props[key].rows"
          :placeholder="`请输入${props[key].label}`"
          @change="handlePropChange(key, $event)"
        />
        <slot v-else-if="props[key].type == 'slot'" :name="key" />
        <el-input
          v-else-if="props[key].type == 'number'"
          v-model="form[key]"
          :disabled="props[key].disabled"
          :placeholder="`请输入${props[key].label}`"
          @input="handleNumber($event, key)"
          @change="handlePropChange(key, $event)"
        >
          <template v-if="props[key].suffix" slot="append">{{
            props[key].suffix
          }}</template>
        </el-input>
        <el-input-number
          v-else-if="props[key].type == 'inputNumber'"
          v-model="form[key]"
          :disabled="props[key].disabled"
          :step="props[key].step || 1"
          :step-strictly="props[key].stepStrictly"
          :precision="props[key].precision"
          :controls-position="props[key].controlsPosition? 'right': null"
          :min="props[key].min"
          :max="props[key].max"
          @change="handlePropChange(key, $event)"
        />
        <el-input
          v-else
          v-model="form[key]"
          :disabled="props[key].disabled"
          :placeholder="`请输入${props[key].label}`"
          :maxlength="props[key].maxlength? props[key].maxlength: null"
          :show-word-limit="!!props[key].maxlength"
          :minlength="props[key].minlength? props[key].minlength: null"
          @change="handlePropChange(key, $event)"
        >
          <template v-if="props[key].suffix" slot="append">{{
            props[key].suffix
          }}</template>
        </el-input>
      </el-form-item>
    </template>
  </el-form>
</template>
<script>
/**
 * 组件为json格式表单
 * 包含的表单类型（type字段）：select、date、img、color、PInputMap、textarea、number、text（默认）
 * 表单参数格式为json类型，key为字段名
 * @param {String} key 字段名：{
 *   @param {String} type：字段类型,
 *   @param {String} label：文字描述
 *   @param {Boolean} disabled：是否禁用，默认为false不禁用
 *   @param {Boolean} hidden：是否隐藏，默认为false不隐藏
 *   @param {String} up：需要联动的另一个表单字段，当被联动的字段的值改变触发change，则通知所有关联的字段
 *   @param {String} dict：字典列表，主要为select提供下拉列表
 *   @param {Function} api：需要调用的接口，主要为select提供下拉列表
 *   @param {Object} param：给api查询提供的参数
 *   @param {[Boolean, String]} join：参数拼接方式，默认为false不拼接，true则为url拼接param字段的参数，如果为字符串则直接拼接join字符串
 *   @param {Array} option：api接口返回的数据对应的字段数组，第0为value，第1为label
 *   @param {String} suffix：单行表单后缀单位，目前只有text配置有
 *   @param {String} alias：别名，当通过接口获取表单数据并初始化时，如果配置的字段名和返回数据的字段不一致，则使用alias字段别名来获取
 *   @param {[Boolean, String]} split: 是否分割，当值为字符串，但表单需求数组是配置,分隔符默认为“,”
 * }
 */
import { Loading } from 'element-ui'
import { Local } from '@/utils/storage'
import PInputRegion from '@/components/PInputRegion'
export default {
  components: {
    PInputRegion
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: { // 初始化的表单
      type: Object,
      default: () => {}
    },
    title: { // 表单标题
      type: String,
      default: null
    },
    props: { // 表单参数
      type: Object,
      default: () => {}
    },
    rules: { // 校验规则
      type: Object,
      default: () => {}
    },
    width: { // 宽度
      type: [String, Number],
      default: '100%'
    },
    labelWidth: { // 描述宽度
      type: [String, Number],
      default: '100px'
    }
  },
  data() {
    return {
      form: {}, // 表单的值
      fileList: {}, // 文件列表
      reload: false, // 碰到无法解决的问题，则进行重载
      changeForm: true, // 解决v-model和watch造成重复渲染问题
      accepts: ['.jpg', '.jpeg', '.png'],
      regExp: {}
    }
  },
  watch: {
    value: {
      handler(n, o) {
        if (this.changeForm) {
          Object.keys(this.props).forEach(key => {
            if (n[key] != undefined) {
              let value = n[key]
              if (this.props[key].split && typeof n[key] == 'string') {
                if (typeof this.props[key].split == 'string') {
                  value = n[key].split(this.props[key].split)
                } else {
                  value = n[key].split(',')
                }
              }
              if (this.form[key] == undefined) {
                this.$set(this.form, key, value)
              } else {
                this.form[key] = value
              }
            } else {
              if (this.props[key].type == 'img') {
                if (n[key].length) {
                  this.pushImage(n[key], key)
                } else {
                  this.fileList[key] = []
                }
              }
            }
          })
          // this.reset(n)
        }
      },
      deep: true
    }
  },
  created() {
    let hasId = false
    // 初始化表单
    Object.keys(this.props).forEach((key) => {
      const item = this.props[key]
      if (item.type == 'id') {
        hasId = true
      }
      if (item.value) {
        this.form[key] = item.value
      }
      // this.$set(this.form, key, this.value[key])
      if (item.type == 'img' && !this.form[key]) {
        this.form[key] = []
        if (this.props[key].accept && this.props[key].accept instanceof Array) {
          this.regExp[key] = new RegExp(`(\\${this.props[key].accept.join('|\\')})$`)
        } else if (!this.props[key].accept) {
          this.regExp[key] = new RegExp(`(\\${this.accepts.join('|\\')})$`)
        }
      }
      if (item.api && typeof item.api == 'function' && !item.up) {
        item.loading = true
        let param
        if (item.param) {
          param = item.param
        } else if (item.join) {
          param = item.join
        }
        item.api(param).then((res) => {
          item.loading = false
          if (item.type == 'select') {
            this.$set(item, 'options', res.data.rows || (res.data.data && res.data.data.rows) || res.data.data)
            if (item.multiple) {
              const option = {}
              option[item.option[0]] = 'all'
              option[item.option[1]] = '全部' + item.label
              item.options.unshift(option)
            }
          } else {
            this.form[key] = res.data.data
          }
        }).catch(() => {
          item.loading = false
        })
      } else if (item.dict && !item.options) {
        this.$set(item, 'options', this.$dict(this.props[key].dict))
      }
    })
    // 初始化change回调
    // 必须单独遍历一次，因为字段属性顺序可能不是顺着的
    Object.keys(this.props).forEach((key) => {
      const item = this.props[key]
      if (item.up) {
        if (this.props[item.up].change) {
          this.props[item.up].change.push(this.defaultChange(item, key))
        } else {
          this.$set(this.props[item.up], 'change', [
            this.defaultChange(item, key)
          ])
        }
      }
    })
    // 没有ID则默认赋予id字段
    if (!hasId) {
      this.props['id'] = {
        type: 'id',
        hidden: true
      }
      this.form['id'] = ''
    }
    this.reset(this.value)
  },
  mounted() {
  },

  methods: {
    /**
     * 重置表单
     * @param {Object} form 初始表单值
     */
    reset(form) {
      return new Promise((resolve, reject) => {
        this.form = {}
        this.fileList = {}
        if (form && form != {}) {
          Object.keys(this.props).forEach(key => {
            const item = this.props[key]
            let value = form[key]
            // 如果有指定字段别名，则使用别名
            if (this.props[key].alias && form[this.props[key].alias]) {
              const k = this.props[key].alias
              if (form[k] instanceof Array) {
                value = []
                form[k].forEach(item => {
                  value.push(item[this.props[key].option[0]])
                })
              } else {
                value = form[k]
              }
            }
            if (item.split && value && typeof value == 'string') {
              if (typeof item.split == 'string') {
                value = value.split(item.split)
              } else {
                value = value.split(',')
              }
            }
            this.$set(this.form, key, value)
            if (item.change && item.change.length) {
            // 手动触发下拉框的change事件
              if (this.$refs['form-' + key]) {
                this.$refs['form-' + key][0].emitChange(form[key])
              }
            }
            if (item.type == 'img' && this.form[key]) {
              this.pushImage(this.form[key], key)
            } else if (item.type == 'img' && !this.form[key]) {
              this.form[key] = []
            }
          })
        }
        if (this.$refs['form'] && this.$refs['form'].resetFields) {
          this.$refs['form'].resetFields()
        }
        resolve()
      })
    },
    /**
     * 初始化添加图片
     * @param {Object} item 对象
     * @param {String} key 字段名
     */
    pushImage(item, key) {
      if (!this.fileList[key]) {
        this.$set(this.fileList, key, [])
        // this.fileList[key] = []
      }
      item.forEach(async(url, index) => {
        if (url.indexOf('http') == -1) {
          if (url) {
            const result = await this.$api.file.getFileUrl({ idStr: url })
            if (result.data.data && result.data.data.length != 0) {
              this.fileList[key].push({
                name: result.data.data[0].name,
                url: result.data.data[0].url,
                raw: {
                  code: result.data.data[0].fileCode,
                  action: key
                }
              })
            }
          }
        } else {
          this.fileList[key].push({
            name: url,
            url: url,
            code: url,
            raw: {
              code: url,
              action: key
            }
          })
        }
      })
    },
    /**
     * 动态添加change回调
     * @param {Object} item prop属性
     * @param {String} key 字段名
     */
    defaultChange(item, key) {
      return (key1, $event) => {
        if (item.api) {
          this.$set(this.form, key, '')
          this.$set(item, 'options', [])
          item.loading = true
          let param
          if (item.param) {
            param = item.param
            param[item.up] = $event
          } else if (item.join == true) {
            param = $event
          } else if (item.join) {
            param = item.join
          } else {
            param = {}
            // param[this.props[item.up].option[0]] = $event
            param[item.up] = $event
          }
          item.api(param).then((res) => {
            item.loading = false
            if (item.type == 'select') {
              this.$set(item, 'options', res.data.rows || (res.data.data && res.data.data.rows) || res.data.data)
            } else {
              this.form[key] = res.data.data
            }
          }).catch(() => {
            item.loading = false
          })
        } else if (item.dict) {
          if (this.props[item.up].options) {
            this.props[item.up].options.some(op => {
              if (op[this.props[item.up].option[0]] == this.form[item.up]) {
                if (item.alias) {
                  this.form[key] = op[item.alias]
                } else {
                  this.form[key] = op[key]
                }
                return true
              }
            })
          }
        }
        this.handlePropChange(key)
      }
    },
    validate(callback) {
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate(valid => {
          this.$nextTick(() => {
            callback && callback(valid)
            resolve(valid)
          })
        })
      })
    },
    /**
     * 触发回调
     * @param {String} key 字段名
     * @param {Object} e 值
     */
    handlePropChange(key, e) {
      if (this.props[key] && e != undefined && this.props[key].change) {
        this.props[key].change.forEach((change) => {
          change(key, e)
        })
      }
      if (this.props[key].multiple && e.includes('all')) {
        const list = []
        const o1 = this.props[key].option[0]
        this.props[key].options.forEach(item => {
          if (item[o1] !== 'all') {
            list.push(item[o1])
          }
        })
        this.form[key] = list
      } else if (this.props[key].multiple && !e.includes('all')) {
        this.form[key] = e
      }
      this.changeForm = false
      this.$emit('input', this.form)
      this.$emit('change', this.form, key)
      this.$nextTick(() => {
        this.changeForm = true
      })
    },
    /**
     * 自定义上传图片
     * @param {Object} raw 文件
     */
    uploadFile(raw) {
      const { file } = raw
      if (this.regExp[raw.action] && !this.regExp[raw.action].test(file.name)) {
        this.$message({
          type: 'warning',
          message: '上传的文件格式不支持'
        })
        this.fileList[raw.action] = this.fileList[raw.action].filter(item => {
          return true
        })
        return
      }
      if (!this.loading) {
        this.loading = Loading.service({
          text: '上传中……',
          fullscreen: true
        })
      }
      const fileForm = new FormData()
      fileForm.append('file', file)
      fileForm.append('appId', Local.get('appId') || window.config.appId)
      this.$api.file
        .upload(fileForm)
        .then((res) => {
          if (res.data.code == 200) {
            const { fileCode, url } = res.data.data
            raw.file.action = raw.action
            raw.file.code = fileCode
            if (!this.form[raw.action]) {
              this.form[raw.action] = []
            }
            this.form[raw.action].push(url)
            const codeKey = raw.action + '-code'
            if (!this.form[codeKey]) {
              this.form[codeKey] = []
            }
            this.form[codeKey].push(fileCode)
            this.handlePropChange(url)
            // this.handlePropChange(raw.action)
          }
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            this.loading.close()
            this.loading = null
            this.$message({
              type: 'success',
              message: '上传成功'
            })
          })
        })
        .catch(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          this.loading.close()
          this.loading = null
        })
    },
    /**
     * 删除图片
     * @param {Object} file 图片文件
     */
    handleImageRemove(file) {
      this.form[file.raw.action] = this.form[file.raw.action].filter(
        (code) => file.raw.code !== code)
      this.handlePropChange(file.raw.action)
    },
    /**
     * 强制数字类型
     * @param {String} val 输入值
     * @param {String} key 字段名
     */
    handleNumber(val, key) {
      if (val !== '' && val.substr(0, 1) === '.') {
        val = ''
      }
      val = val.replace(/^0*(0\.|[1-9])/, '$1')// 解决 粘贴不生效
      val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      val = val.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3')// 只能输入8个小数
      if (val.indexOf('.') < 0 && val !== '') {
        if (val.substr(0, 1) === '0' && val.length === 2) {
          val = val.substr(1, val.length)
        }
      }
      this.changeForm = false
      this.form[key] = val // parseFloat(val)
    }
  }
}
</script>
<style lang="scss">
.format-form {
  .title {
    position: relative;
    .el-form-item__label {
      font-size: 20px;
      font-weight: bold;
      &::before {
        content: " ";
        background-color: #00b690;
        width: 6px;
        height: 22px;
        border-radius: 3px;
        left: 0px;
        top: 9px;
        position: absolute;
      }
    }
  }
  .el-form-item {
    .el-form-item__content {
      & > .format-form-upload {
        display: flex;
        flex-direction: column;
        .el-upload--picture-card {
          height: 80px;
          width: 80px;
          line-height: 80px;
          order: 1;
          border-radius: 8px;
          // margin-bottom: 20px;
          // position: relative;
          .el-icon-plus {
          }
          .upload-explain {
            position: absolute;
            left: 100px;
            top: 0px;
            line-height: 25px;
            text-align: left;
            pointer-events: none;
            color: #999;
          }
        }
        .el-upload-list--picture-card {
          display: block;
          order: 2;
          .el-upload-list__item {
            border-radius: 8px;
            height: 80px;
            width: 80px;
            margin: 24px 24px 0 0;
          }
        }
      }
    }
  }
}
</style>
