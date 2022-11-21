<!--编辑或添加公告-->
<template>
  <div class="router_container2 m20 bg-w">
    <div class="panel-header-box f jc-sb ai-c">
      <div class="title-css">{{ title }}</div>
      <div class="f ai-c">
        <el-button size="mini" type="primary">保存</el-button>
        <el-button size="mini" @click="$router.push('/publicManagement')">返回</el-button>
      </div>
    </div>
    <div class="p30">
      <el-form :model="params" label-width="100px" label-position="left">
        <el-form-item label="展示标题">
          <el-input v-model="params.title" clearable size="mini" placeholder="请输入标题" />
        </el-form-item>
        <!-- <el-form-item label="公告">
          <div>
            <el-upload
              size="mini"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">{{ `① 支持上传图片格式："*.jpg"、"*.jpeg"、"*.png"； ② 单张图片大小不超过50M；` }}</div>
            </el-upload>
          </div>
        </el-form-item> -->
        <el-form-item label="显示顺序">
          <el-input-number v-model="params.sort" size="mini" :min="1" :max="10000" label="描述文字" @change="handleChange" />
        </el-form-item>
        <el-form-item label="关联内容">
          <el-row>
            <el-col :span="24"> <el-radio v-model="params.link" size="mini" :label="0">内容展示</el-radio>
              <el-radio v-model="params.link" size="mini" :label="1">关联外部链接</el-radio>
              <el-input v-if="params.link" v-model="params.linkUrl" size="mini" placeholder="请输入外链地址" />

            </el-col>

          </el-row>

        </el-form-item>
        <el-form-item label="描述">
          <PEditor @change="contentChange" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RoundChartManage',
  data() {
    return {
      title: '新增公告',
      params: {
        'content': '展示内容',
        'isShow': 0,
        'orderValue': 0,
        'pageUrl': 'http://www.baidu.com',
        'related': 0,
        'title': 'xxxxxx'
      }
    }
  },
  mounted() {
    if (this.$route.params.id !== 'add') {
      this.title = '编辑公告'
      this.getNoticeById()
    }
  },
  methods: {
    handleChange() {},
    contentChange(v) {
      // 监听富文本内容变化并赋值
      this.params.content = v
    },
    getNoticeById() {
      // 获取单个公告数据
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
