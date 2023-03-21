export default {
  photoUrlApi: '/politics/portal/file/showImg/',
  pageConfig: {
    size: [10, 20, 30, 40]
  },
  // 图形验证码地址
  code: process.env.VUE_APP_BASE_API + '/politics/portal/sys/captcha?key=',
  // 文件上传地址
  fileUpload: process.env.VUE_APP_BASE_API + '/politics/v1/file/batchUploadImg',
  // 文件阅览地址
  filePreview: process.env.VUE_APP_BASE_API + '/politics/v1/file/preview'
}
