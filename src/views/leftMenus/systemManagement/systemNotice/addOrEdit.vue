<!--编辑或添加公告-->
<template>
  <div class="router_container2 m20 bg-w f fd-c">
    <div class="panel-header-box f jc-sb ai-c">
      <div class="title-css">{{ title }}</div>
      <div class="f ai-c">
        <el-button size="mini" type="primary" @click="submitFn">保存</el-button>
        <el-button size="mini" @click="$router.push('/systemNotice')"
          >返回</el-button
        >
      </div>
    </div>
    <div class="nr-box p30 f1">
      <el-form
        ref="form"
        :model="params"
        label-width="100px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="展示标题" prop="title">
          <el-input
            v-model="params.title"
            clearable
            size="mini"
            placeholder="请输入标题"
          />
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
          <el-input-number
            v-model="params.orderValue"
            size="mini"
            :min="0"
            :max="1000"
            label=""
            @change="handleChange"
          />
          <span class="ml10 fs12 title-c-3">显示循序为0到1000有效</span>
        </el-form-item>
        <el-form-item label="关联内容" prop="pageUrl">
          <el-row>
            <el-col :span="24">
              <el-radio v-model="params.related" size="mini" :label="0"
                >内容展示</el-radio
              >
              <el-radio v-model="params.related" size="mini" :label="1"
                >关联外部链接</el-radio
              >
              <el-input
                v-if="params.related"
                v-model="params.pageUrl"
                size="mini"
                placeholder="请输入外链地址"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="content"
          :required="params.related === 0"
        >
          <!-- <PEditor id="publicManagement" :value="editorCxt" @change="contentChange" /> -->
          <PEditorVue :value="editorCxt" @input="contentChange" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import PEditorVue from "@/components/PEditorVue/index.vue";
import { addAffiche, editAffiche, getAfficheOne } from "@/api/method/affiche";
export default {
  name: "RoundChartManage",
  components: { PEditorVue },
  data() {
    const checkPageUrl = (rule, value, callback) => {
      if (this.params.related === 0) {
        callback();
      } else {
        if (!value) {
          callback(new Error("请输入链接地址"));
        } else {
          callback();
        }
      }
    };

    const checkContent = (rule, value, callback) => {
      if (this.params.related) {
        callback();
      } else {
        if (value && value !== "") {
          callback();
        } else {
          callback(new Error("请输入展示内容"));
        }
      }
    };

    return {
      title: "新增公告",
      action: "add",
      editorCxt: "",
      params: {
        content: "",
        isShow: 0,
        orderValue: 0,
        pageUrl: "",
        related: 0,
        title: "",
      },
      rules: {
        content: [{ validator: checkContent, trigger: "blur" }],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
        pageUrl: [
          // { required: false, message: '请输入链接地址', trigger: 'blur' },
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur",
          },
          { validator: checkPageUrl, trigger: ["blur", "change"] },
        ],
      },
    };
  },
  mounted() {
    console.log(this.$route.params);
    if (this.$route.params.id && this.$route.params.id !== "add") {
      this.action = "edit";
      this.title = "编辑公告";
      this.getNoticeById(this.$route.params.id);
    }
  },
  methods: {
    handleChange() {},
    contentChange(v) {
      // 监听富文本内容变化并赋值
      console.log("onchangevvvvv", v);
      this.params.content = v;
    },
    getNoticeById(v) {
      // 获取单个公告数据
      getAfficheOne(v).then((res) => {
        res.code === 10000 &&
          ((this.params = Object.assign(this.params, res.data)),
          (this.editorCxt = this.params.content));
      });
    },
    submitFn() {
      this.$refs["form"].validate((v) => {
        if (v) {
          const fn =
            this.action === "add"
              ? addAffiche(this.params)
              : editAffiche(this.params.id, this.params);
          fn.then((res) => {
            res.code === 10000 &&
              (this.$message.success(
                (this.action === "add" ? "添加" : "编辑") + "成功"
              ),
              this.$router.push("/publicManagement"));
          });
          return;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 50%;
}
::v-deep .el-form-item__content {
  display: flex;
  align-items: center;
  .el-row {
    width: 100%;
  }
}
.nr-box {
  overflow-y: auto;
}
</style>
