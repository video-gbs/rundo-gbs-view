<!--编辑或添加轮播图-->
<template>
  <div class="router_container2 m20 bg-w">
    <div class="panel-header-box f jc-sb ai-c">
      <div class="title-css">{{ title }}</div>
      <div class="f ai-c">
        <el-button size="mini" type="primary"  @click="submitFn">保存</el-button>
        <el-button size="mini" @click="$router.push('/roundChart')">返回</el-button>
      </div>
    </div>
    <div class="p30">
      <el-form :rules="rules" :model="params" label-width="100px" label-position="left">
        <el-form-item label="展示标题" prop="title">
          <el-input v-model="params.title" clearable size="mini" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="轮播图图片" prop="fileName">
          <div>
            <el-upload
              size="mini"
              drag
              action=""
              :http-request="uploadFn"
              @before-upload="beforeUpload"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">{{ `① 支持上传图片格式："*.jpg"、"*.jpeg"、"*.png"； ② 单张图片大小不超过50M；` }}</div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number v-model="params.orderValue" size="mini" :min="0" :max="10000" label="描述文字" @change="handleChange" />
        </el-form-item>
        <el-form-item label="关联内容">
          <el-row>
            <el-col :span="24">
              <el-radio v-model="params.related" size="mini" :label="0">内容展示</el-radio>
              <el-radio v-model="params.related" size="mini" :label="1">关联外部链接</el-radio>
              <el-input v-if="params.related" v-model="params.pageUrl" size="mini" placeholder="请输入外链地址" />

            </el-col>

          </el-row>

        </el-form-item>
        <el-form-item label="描述">
          <PEditor id="roundChart" :value="editorCxt" @change="contentChange" />
        </el-form-item>
      </el-form>
      
    </div>
  </div>
</template>
<script>
import { uploadFiles } from '@/api/method/files'
import { addRoundChart, editRoundChart } from '@/api/method/roundChart'
export default {
  name: 'RoundChartManage',
  data() {
    return {
      title: '新增轮播图',
      params: {
        'content': '', // 展示内容
        'fileName': '文件名哦', // fileName
        'isShow': 0, // 是否显示，0显示，1不显示
        'orderValue': 0, // 显示顺序
        'pageUrl': '', // 外部链接url
        'related': 0, // 关联选项: 0:内容展示，关联外部链接
        'title': ''// 展示标题,示例值(xxxxxx)
      },
      action: 'add', // 判断是新增还是编辑
      uploadData: {
        // file: null,
        fileBatchId: ''
      },
      editorCxt:'',
      rules: {
        content: [
          { required: true, message: '请输入提交的内容', trigger: 'blur' }
        ], title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        pageUrl: [
          { required: true, message: '请输入连接地址', trigger: 'blur' },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    console.log(this.$route.params)
    if (this.$route.params.id !== 'add') {
      console.log('sd')
      this.action = 'edit'
      this.title = '编辑轮播图'
      this.getChartById()
      
    }
  },
  methods: {
    handleChange() {},
    contentChange(v) {
      // 监听富文本内容变化并赋值
      this.params.content = v
    },
    getChartById() {
      // 获取单个轮播图数据
      const one = {
        content: '展示内容11111',
        createTime: '2022-11-17 15:42:51',
        id: 1593147638770516000,
        isShow: 0,
        orderValue: 4,
        pageUrl: 'http://www.baidu.com',
        related: 1,
        title: '标题1'
      }
      Object.assign(this.params, one)
      this.editorCxt = this.params.content
    },
    beforeUpload(file) {
      console.log('file', file)
    },
    uploadFn(file) {
      console.log('zidingyi', file)
      uploadFiles({ file: file.file })
    },
    submitFn() {
      const fn = this.action === 'add' ? addRoundChart(this.params) : editRoundChart({ id: 0, params: this.params })
      fn.then(res=>{
        if(res.code===10000)
        {
          this.$message.success(`${this.action === 'add'?'新增':'编辑'}成功`)
          setTimeout(()=>{this.$router.push('/roundChart')},500)
        }
        
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.el-input{
  width: 50%;
}
::v-deep .el-form-item__content{
  display: flex;
  align-items: center;
   .el-row{
    width: 100%;
   }
 }
</style>
