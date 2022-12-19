<!--编辑或新增专题-->
<template>
  <div class="router_container2 m20 bg-w f fd-c">
    <div class="panel-header-box f jc-sb ai-c">
      <div class="title-css">{{ title }}</div>
      <div class="f ai-c">
        <el-button size="mini" type="primary" @click="submitFn">保存</el-button>
        <el-button
          size="mini"
          @click="$router.push('/specialTopicManagementIndex')"
          >返回</el-button
        >
      </div>
    </div>
    <div class="nr-box p30 f1">
      <el-form
        ref="form"
        :rules="rules"
        :model="params"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="展示标题" prop="title">
          <el-input
            v-model="params.title"
            clearable
            size="mini"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item label="专题图片" prop="photoUrl">
          <div>
            <el-row>
              <el-col :span="params.photoUrl ? 14 : 24">
                <el-upload
                  ref="uploadRef"
                  size="mini"
                  drag
                  action=""
                  :http-request="uploadFn"
                  :on-remove="onRemove"
                  :limit="1"
                >
                  <i class="el-icon-upload" />
                  <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                  </div>
                  <div slot="tip" class="el-upload__tip">
                    {{
                      `① 只能上传一张图片图片,格式："*.jpg"、"*.jpeg"、"*.png"； ② 大小不超过50M；`
                    }}
                  </div>
                </el-upload>
                <div>{{ `已选择 ${params.photoUrl ? 1 : 0}/1` }}</div>
              </el-col>
              <el-col
                v-if="params.photoUrl"
                :span="10"
                class="f fd-c jc-c ai-c"
              >
                <div class="ml20">当前专题图片</div>
                <div class="ml20 f ai-c jc-c round-img-box">
                  <i class="el-icon-delete" @click="clickIconRemove" />
                  <img :src="params.photoUrl || ''" />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="简述" prop="description">
          <el-input
            v-model="params.description"
            clearable
            size="mini"
            type="textarea"
            maxlength="1000"
            rows="5"
            placeholder="请输入简述"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="关联内容" prop="outUrl">
          <el-row>
            <el-col :span="24">
              <el-radio v-model="params.contentSet" size="mini" :label="1"
                >内容展示</el-radio
              >
              <el-radio v-model="params.contentSet" size="mini" :label="2"
                >关联外部链接</el-radio
              >
              <el-input
                v-if="params.contentSet === 2"
                v-model="params.outUrl"
                size="mini"
                placeholder="请输入外链地址"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          label="内容"
          prop="content"
          :required="params.contentSet === 1"
        >
          <!-- <PEditor id="roundChart" :value="editorCxt" @change="contentChange" /> -->

          <PEditorVue :value="editorCxt" @input="contentChange" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import PEditorVue from "@/components/PEditorVue/index.vue";
import { uploadImg } from "@/api/method/files";
import { addItem, editItem, getOne } from "@/api/method/specialTopic";

export default {
  name: "",
  components: { PEditorVue },
  data() {
    const checkPageUrl = (rule, value, callback) => {
      if (this.params.contentSet === 1) {
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
      if (this.params.contentSet === 2) {
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
      title: "新增专题",
      params: {
        content: "", // 内容
        contentSet: 1, // 1内容展示，2关联外部链接
        description: "", //	简述
        isReview: 0, //	是否可评论， 0关闭 1开启）
        isShow: 0, //	是否显示，0隐藏，1显示 ）
        photoUrl: "", // 图片url
        outUrl: "", // 外链
        settingInsertDto: {
          attachmentFlag: 0, // 附件补充，0无需填写，默认1可选择填写
          contentFlag: 0, //	内容，0无需填写，默认1需填写
          domainFlag: 0, //	领域，0无需选择，默认1需选择
          telFlag: 0, //	联系方式，0无需填写，默认1可选择填写
          titleFlag: 0, //	标题，0无需填写，默认1需填写
          toObjFlag: 0, //	留言对象，0无需选择，默认1需选择
          trueNameFlag: 0, //	真实姓名，0无需填写，默认1可选择填写
          typeFlag: 0, // 分类，0无需选择，默认1需选择
        },
        title: "", // 标题
      },
      copyParams: {},
      action: "add", // 判断是新增还是编辑
      uploadData: {
        // file: null,
        fileBatchId: "",
      },
      editorCxt: "",

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
        outUrl: [
          // { required: true, message: '请输入链接地址', trigger: 'blur' },
          { validator: checkPageUrl, trigger: ["blur", "change"] },
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur",
          },
        ],
        photoUrl: [
          { required: true, message: "请上传一张轮播图", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // if (this.$route.params.id !== 'add') {
    //   console.log('sd')
    //   this.action = 'edit'
    //   this.title = '编辑轮播图'
    //   this.getChartById()
    // }
  },
  mounted() {
    console.log(this.$route.params);
    if (this.$route.params.id && this.$route.params.id !== "add") {
      console.log("sd");
      this.action = "edit";
      this.title = "编辑专题";
      this.getOneById(this.$route.params.id);
    }
  },
  methods: {
    contentChange(v) {
      // 监听富文本内容变化并赋值
      this.params.content = v;
    },
    getOneById(v) {
      // 获取单个专题数据
      getOne(v).then((res) => {
        if (res.code === 10000) {
          Object.assign(this.params, res.data);
          this.copyParams = res.data;
          this.editorCxt = this.params.content;
        }
      });
    },
    uploadFn(file) {
      console.log("file自定定义上传", file);
      const ft = ["image/png", "image/jpeg"];

      if (file.file.size / 1024 / 1024 > 50) {
        this.$refs["uploadRef"].clearFiles();
        this.$message.warning("图片体积大于50M");
        return;
      }
      if (!ft.includes(file.file.type)) {
        this.$refs["uploadRef"].clearFiles();
        this.$message.warning("只能上传jpg/jpeg/png格式的图片");
        return;
      }
      const obj = new FormData();
      obj.append("files", file.file);
      uploadImg(obj)
        .then((res) => {
          res.code === 10000 && (this.params.photoUrl = res.data[0].url);

          res.code !== 10000 && this.$refs["uploadRef"].clearFiles();
        })
        .catch(() => {
          this.$refs["uploadRef"].clearFiles();
        });
    },
    onRemove(file, fileList) {
      !fileList.length && (this.params.photoUrl = "");
    },
    clickIconRemove() {
      this.$refs["uploadRef"].clearFiles();
      this.params.photoUrl = "";
    },
    submitFn() {
      if (this.params.photoUrl === "") {
        // 不更换新的图片
        this.params.photoUrl = this.copyParams.photoUrl;
      }
      this.$refs["form"].validate((v) => {
        if (v) {
          console.log(this.params);

          const fn =
            this.action === "add"
              ? addItem(this.params)
              : editItem(this.params);
          fn.then((res) => {
            if (res.code === 10000) {
              this.$message.success(
                `${this.action === "add" ? "新增" : "编辑"}成功`
              );
              setTimeout(() => {
                this.$router.push("/specialTopicManagementIndex");
              }, 500);
            }
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
.round-img-box {
  width: 100%;
  position: relative;
  > i {
    background-color: #fff;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
    transform: translateX(-50%);
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
  }
  > img {
    width: 100%;
    height: auto;
  }
}
.nr-box {
  overflow-y: auto;
}
</style>
