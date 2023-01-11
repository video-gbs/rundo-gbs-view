<template>
  <el-upload
    ref="upload"
    list-type="picture-card"
    class="format-form-upload"
    :class="photoHide ? 'hide-upload-btn' : 'show-upload-btn'"
    :action="keys"
    :auto-upload="true"
    :disabled="disabled"
    :file-list="fileList"
    :on-exceed="onExceed"
    :on-change="changeFile"
    :http-request="uploadFile"
    :on-remove="handleImageRemove"
    :before-upload="handleBeforeUpload"
    :accept="
      accept.length > 0
        ? accept.toString()
        : accepts.map((a) => `${a}`).toString()
    "
  >
    <i slot="default" class="el-icon-plus" />
    <div class="upload-explain">
      说明：<br />
      ①支持上传图片格式：{{
        accept.length > 0
          ? accept.toString()
          : accepts.map((a) => `*${a}`).join('、')
      }}；<br />
      ②单张图片大小不超过500M。
    </div>
  </el-upload>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  name: 'PUPload',
  props: {
    // 是否隐藏组件
    disabled: {
      type: Boolean,
      default: false
    },
    // 可选类型
    accept: {
      type: Array,
      default: () => []
    },
    // 双向绑定值
    value: {
      type: String,
      default: ''
    },
    // 上传类型
    keys: {
      type: String,
      default: 'file'
    },
    // 最大上传数量
    limit: {
      type: Number,
      default: null
    },
    // 是否开启替换模式
    isChange: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      photoHide: false, // 是否隐藏上传按钮
      fileList: [], // 图片数组
      accepts: ['.jpg', '.jpeg', '.png'], // 默认可选类型
      changeStatus: true,
      initStatus: false
    }
  },
  watch: {
    value: {
      handler(n, o) {
        if (this.changeStatus) {
          const fileList = n ? n.split(',') : []
          this.pushImage(fileList, this.keys)
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.value && !this.initStatus) {
      const fileList = this.value.split(',')
      this.pushImage(fileList, this.keys)
    }
  },
  methods: {
    /**
     * 超过限制数量替换第一张
     * @param {*} file
     * @param {*} fileList
     */
    changeFile(file, fileList) {
      if (fileList.length > this.limit) {
        this.fileList.splice(0, 1)
      }
    },
    /**
     * 自定义上传图片方法
     * @param {Object} raw 文件
     */
    uploadFile(raw) {
      const { file } = raw
      if (!this.loading) {
        this.loading = Loading.service({
          text: '上传中……',
          fullscreen: true
        })
      }
      const fileForm = new FormData()
      fileForm.append('file', file)
      this.$api.file
        .upload(fileForm)
        .then((res) => {
          if (res.data.code == 200) {
            const { name, url } = res.data.data
            this.fileList.push({
              name,
              url,
              raw: {
                code: url,
                action: 'file'
              }
            })
            this.handlePropChange(raw.action)
            if (!this.isChange) {
              if (this.fileList.length == this.limit) {
                this.photoHide = true
              }
            }
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
     * 限制上传文件大小
     */
    handleBeforeUpload(file) {
      const maxSIze = 500
      const isExceed = file.size / 1024 / 1024 < maxSIze
      if (!isExceed) {
        this.$message.error(`上传图片大小不能超过 ${maxSIze}MB!`)
        return false
      }
      return true
    },
    /**
     * 删除图片
     * @param {Object} file 图片文件
     */
    handleImageRemove(file) {
      this.fileList = this.fileList.filter((item) => file.url !== item.url)
      this.handlePropChange(file.raw.action)
      this.photoHide = false
    },
    /**
     * 触发回调
     * @param {String} key 字段名
     * @param {Object} e 值
     */
    handlePropChange(key, e) {
      const fileList = this.fileList.map((item) => {
        return item.url
      })
      this.changeStatus = false
      this.$emit('input', fileList.toString())
      this.$nextTick(() => {
        this.changeStatus = true
      })
    },
    /**
     * 初始化添加图片
     * @param {Object} item 对象
     * @param {String} key 字段名
     */
    pushImage(item, key) {
      if (!this.initStatus) {
        this.initStatus = true
      }

      this.fileList = []
      item.forEach((url) => {
        this.fileList.push({
          name: url,
          url: url,
          code: url,
          raw: {
            code: url,
            action: key
          }
        })
      })
    },
    /**
     * 超出上传上限提示
     * @param {*} files
     * @param {*} fileList
     */
    onExceed(files, fileList) {
      const msg = `最大上传数量：${this.limit}`
      this.$message.warning(msg)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.format-form-upload {
  display: flex;
  flex-direction: column;
  &.show-upload-btn {
    .el-upload--picture-card {
      height: 120px;
      width: 120px;
      line-height: 120px;
      order: 1;
      border-radius: 8px;
      .upload-explain {
        position: absolute;
        left: 140px;
        top: 0px;
        line-height: 25px;
        text-align: left;
        pointer-events: none;
        color: #999;
      }
    }
  }
  &.hide-upload-btn {
    .el-upload--picture-card {
      display: none;
    }
  }
  .el-upload-list--picture-card {
    display: block;
    order: 2;

    .el-upload-list__item {
      border-radius: 8px;
      height: 120px;
      width: 120px;
      margin: 24px 24px 0 0;
    }
  }
}
</style>
