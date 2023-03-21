<template>
  <el-upload
    ref="upload"
    class="format-form-upload"
    :action="keys"
    :disabled="disabled"
    list-type="picture-card"
    :auto-upload="true"
    :on-remove="handleImageRemove"
    :http-request="uploadFile"
    :file-list="fileList"
    :limit="limit"
    :on-exceed="onExceed"
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
          : accepts.map((a) => `*${a}`).join('')
      }}；<br />
      ②单张图片大小不超过500M。
    </div>
  </el-upload>
</template>

<script>
import { Loading } from 'element-ui'
import { Local } from '@/utils/storage'
import { isEmpty } from 'lodash'
export default {
  name: 'PFileUpload',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    accept: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    },
    keys: {
      type: String,
      default: 'file'
    },
    limit: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      fileList: [], // 文件列表
      accepts: ['.jpg', '.jpeg', '.png'],
      regExp: [],
      headers: {
        Authorization: `Basic ${Local.getToken()}`
      },
      actionUrl: '/store/v1/file/upload',
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
    isEmpty(o) {
      return isEmpty(o)
    },
    /**
     * 自定义上传图片
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
      this.fileList = this.fileList.filter((item) => file.url !== item.url)
      this.handlePropChange(file.raw.action)
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

  .el-upload--picture-card {
    height: 120px;
    width: 120px;
    line-height: 120px;
    order: 1;
    border-radius: 8px;

    // margin-bottom: 20px;
    // position: relative;
    .el-icon-plus {
    }

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
